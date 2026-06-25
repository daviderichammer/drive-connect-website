// lib/fraudMiddleware.ts
// Fraud-check middleware for booking creation, payment attempts, and registration

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface FraudCheckResult {
  blocked: boolean;
  flagged: boolean;
  reason?: string;
  signalType?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Check if an email/phone/license is blacklisted
 */
async function checkBlacklist(
  email?: string | null,
  phone?: string | null,
  licenseNumber?: string | null,
  renterId?: number | null
): Promise<FraudCheckResult> {
  const conditions: Record<string, unknown>[] = [];
  if (email) conditions.push({ email: email.toLowerCase() });
  if (phone) conditions.push({ phone });
  if (licenseNumber) conditions.push({ licenseNumber });
  if (renterId) conditions.push({ renterId });

  if (conditions.length === 0) return { blocked: false, flagged: false };

  const entry = await prisma.blacklistedRenter.findFirst({
    where: {
      isActive: true,
      OR: conditions,
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      ],
    },
  });

  if (entry) {
    return {
      blocked: true,
      flagged: true,
      reason: `Blacklisted: ${entry.reason}`,
      signalType: 'blacklist_match',
      severity: 'critical',
    };
  }

  return { blocked: false, flagged: false };
}

/**
 * Check renter trust status
 */
async function checkRenterStatus(renterId: number): Promise<FraudCheckResult> {
  const renter = await prisma.renterAccount.findUnique({
    where: { id: renterId },
    select: { trustedStatus: true, isActive: true },
  });

  if (!renter) return { blocked: true, flagged: false, reason: 'Renter not found' };

  if (!renter.isActive || renter.trustedStatus === 'banned') {
    return {
      blocked: true,
      flagged: true,
      reason: 'Account is banned',
      signalType: 'blacklist_match',
      severity: 'critical',
    };
  }

  if (renter.trustedStatus === 'suspended') {
    return {
      blocked: true,
      flagged: true,
      reason: 'Account is suspended',
      signalType: 'suspicious_pattern',
      severity: 'high',
    };
  }

  return { blocked: false, flagged: false };
}

/**
 * Check for rapid booking attempts (more than 3 in 10 minutes)
 */
async function checkRapidBookings(renterId: number, ipAddress: string): Promise<FraudCheckResult> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const recentAttempts = await prisma.renterActivityLog.count({
    where: {
      OR: [{ renterId }, { ipAddress }],
      action: 'booking_attempt',
      timestamp: { gte: tenMinutesAgo },
    },
  });

  if (recentAttempts >= 5) {
    return {
      blocked: true,
      flagged: true,
      reason: `Rapid booking attempts: ${recentAttempts} in 10 minutes`,
      signalType: 'rapid_bookings',
      severity: 'high',
    };
  }

  if (recentAttempts >= 3) {
    return {
      blocked: false,
      flagged: true,
      reason: `Elevated booking attempts: ${recentAttempts} in 10 minutes`,
      signalType: 'rapid_bookings',
      severity: 'medium',
    };
  }

  return { blocked: false, flagged: false };
}

/**
 * Check for multiple failed payment attempts (more than 3 in 1 hour)
 */
async function checkFailedPayments(renterId: number, ipAddress: string): Promise<FraudCheckResult> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const failedAttempts = await prisma.renterActivityLog.count({
    where: {
      OR: [{ renterId }, { ipAddress }],
      action: 'payment_failed',
      timestamp: { gte: oneHourAgo },
    },
  });

  if (failedAttempts >= 5) {
    return {
      blocked: true,
      flagged: true,
      reason: `Multiple failed payments: ${failedAttempts} in 1 hour`,
      signalType: 'multiple_failed_payments',
      severity: 'critical',
    };
  }

  if (failedAttempts >= 3) {
    return {
      blocked: false,
      flagged: true,
      reason: `Repeated failed payments: ${failedAttempts} in 1 hour`,
      signalType: 'multiple_failed_payments',
      severity: 'high',
    };
  }

  return { blocked: false, flagged: false };
}

/**
 * Check for IP anomalies (multiple accounts from same IP)
 */
async function checkIPAnomaly(ipAddress: string, renterId?: number): Promise<FraudCheckResult> {
  if (!ipAddress || ipAddress === '127.0.0.1' || ipAddress === '::1') {
    return { blocked: false, flagged: false };
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Count distinct renter IDs from this IP in last 24 hours
  const recentActivity = await prisma.renterActivityLog.findMany({
    where: {
      ipAddress,
      timestamp: { gte: oneDayAgo },
      renterId: { not: null },
    },
    select: { renterId: true },
    distinct: ['renterId'],
  });

  const distinctRenters = recentActivity.filter(a => a.renterId !== renterId).length;

  if (distinctRenters >= 5) {
    return {
      blocked: false,
      flagged: true,
      reason: `IP ${ipAddress} used by ${distinctRenters + 1} different accounts in 24 hours`,
      signalType: 'ip_anomaly',
      severity: 'high',
    };
  }

  if (distinctRenters >= 3) {
    return {
      blocked: false,
      flagged: true,
      reason: `IP ${ipAddress} used by ${distinctRenters + 1} different accounts in 24 hours`,
      signalType: 'ip_anomaly',
      severity: 'medium',
    };
  }

  return { blocked: false, flagged: false };
}

/**
 * Log activity to renter_activity_logs
 */
async function logActivity(
  renterId: number | null,
  ipAddress: string,
  action: string,
  flagged: boolean,
  flagReason?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await prisma.renterActivityLog.create({
      data: {
        renterId,
        ipAddress,
        action,
        flagged,
        flagReason: flagReason || null,

      },
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

/**
 * Create a fraud signal
 */
async function createSignal(
  renterId: number,
  signalType: string,
  severity: string,
  details: Record<string, unknown>,
  autoAction: string
) {
  try {
    await prisma.fraudSignal.create({
      data: {
        renterId,
        signalType,
        severity,
        details: details as object,
        autoActionTaken: autoAction,
      },
    });
  } catch (err) {
    console.error('Failed to create fraud signal:', err);
  }
}

/**
 * Main fraud check for booking creation
 */
export async function checkBookingFraud(
  request: NextRequest,
  renterId: number,
  renterEmail?: string,
  renterPhone?: string
): Promise<{ blocked: boolean; response?: NextResponse }> {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  // Log the booking attempt
  await logActivity(renterId, ipAddress, 'booking_attempt', false);

  // Run checks
  const checks = await Promise.all([
    checkRenterStatus(renterId),
    checkBlacklist(renterEmail, renterPhone, null, renterId),
    checkRapidBookings(renterId, ipAddress),
    checkIPAnomaly(ipAddress, renterId),
  ]);

  for (const check of checks) {
    if (check.blocked) {
      // Log flagged activity
      await logActivity(renterId, ipAddress, 'booking_blocked', true, check.reason);

      // Create fraud signal if applicable
      if (check.signalType && check.severity) {
        await createSignal(
          renterId,
          check.signalType,
          check.severity,
          { reason: check.reason, ipAddress, action: 'booking_attempt' },
          'blocked'
        );
      }

      return {
        blocked: true,
        response: NextResponse.json(
          { success: false, error: 'Booking blocked. Please contact support.' },
          { status: 403 }
        ),
      };
    }

    if (check.flagged && check.signalType && check.severity) {
      await logActivity(renterId, ipAddress, 'booking_flagged', true, check.reason);
      await createSignal(
        renterId,
        check.signalType,
        check.severity,
        { reason: check.reason, ipAddress, action: 'booking_attempt' },
        'flagged'
      );
    }
  }

  return { blocked: false };
}

/**
 * Main fraud check for payment attempts
 */
export async function checkPaymentFraud(
  request: NextRequest,
  renterId: number,
  renterEmail?: string
): Promise<{ blocked: boolean; response?: NextResponse }> {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  // Run checks
  const checks = await Promise.all([
    checkRenterStatus(renterId),
    checkBlacklist(renterEmail, null, null, renterId),
    checkFailedPayments(renterId, ipAddress),
    checkIPAnomaly(ipAddress, renterId),
  ]);

  for (const check of checks) {
    if (check.blocked) {
      await logActivity(renterId, ipAddress, 'payment_blocked', true, check.reason);

      if (check.signalType && check.severity) {
        await createSignal(
          renterId,
          check.signalType,
          check.severity,
          { reason: check.reason, ipAddress, action: 'payment_attempt' },
          'blocked'
        );
      }

      return {
        blocked: true,
        response: NextResponse.json(
          { success: false, error: 'Payment blocked. Please contact support.' },
          { status: 403 }
        ),
      };
    }

    if (check.flagged && check.signalType && check.severity) {
      await logActivity(renterId, ipAddress, 'payment_flagged', true, check.reason);
      await createSignal(
        renterId,
        check.signalType,
        check.severity,
        { reason: check.reason, ipAddress, action: 'payment_attempt' },
        'flagged'
      );
    }
  }

  return { blocked: false };
}

/**
 * Main fraud check for registration
 */
export async function checkRegistrationFraud(
  request: NextRequest,
  email: string,
  phone?: string
): Promise<{ blocked: boolean; response?: NextResponse }> {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  // Check blacklist
  const blacklistCheck = await checkBlacklist(email, phone, null, null);

  if (blacklistCheck.blocked) {
    await logActivity(null, ipAddress, 'registration_blocked', true, blacklistCheck.reason);

    return {
      blocked: true,
      response: NextResponse.json(
        { success: false, error: 'Registration not allowed. Please contact support.' },
        { status: 403 }
      ),
    };
  }

  // Check IP anomaly for registrations (more than 3 new accounts from same IP in 24h)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentRegistrations = await prisma.renterActivityLog.count({
    where: {
      ipAddress,
      action: 'registration',
      timestamp: { gte: oneDayAgo },
    },
  });

  if (recentRegistrations >= 3) {
    await logActivity(null, ipAddress, 'registration_blocked', true, `Multiple registrations from IP: ${recentRegistrations} in 24h`);

    return {
      blocked: true,
      response: NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      ),
    };
  }

  // Log successful registration attempt
  await logActivity(null, ipAddress, 'registration', false);

  return { blocked: false };
}

/**
 * Log a failed payment (called after payment failure)
 */
export async function logFailedPayment(
  request: NextRequest,
  renterId: number,
  reason?: string
) {
  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') || 'unknown';

  await logActivity(renterId, ipAddress, 'payment_failed', false, reason);
}
