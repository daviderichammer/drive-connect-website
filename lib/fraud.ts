// lib/fraud.ts - Phase 7F: Fraud Detection & Prevention Library
import { prisma } from '@/lib/prisma';

export interface FraudCheckResult {
  blocked: boolean;
  flagged: boolean;
  reason?: string;
  signals: string[];
}

// Known VPN/proxy IP ranges (simplified - in production use a proper IP intelligence API)
const KNOWN_VPN_RANGES = [
  '10.', '172.16.', '172.17.', '172.18.', '172.19.',
  '172.20.', '172.21.', '172.22.', '172.23.', '172.24.',
  '172.25.', '172.26.', '172.27.', '172.28.', '172.29.',
  '172.30.', '172.31.', '192.168.',
];

function isPrivateIP(ip: string): boolean {
  return KNOWN_VPN_RANGES.some(range => ip.startsWith(range));
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '0.0.0.0';
}

// Log activity for monitoring
export async function logActivity(
  renterId: number | null,
  request: Request,
  action: string,
  fingerprintHash?: string
): Promise<number> {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  const log = await prisma.renterActivityLog.create({
    data: {
      renterId,
      ipAddress: ip,
      userAgent,
      fingerprintHash: fingerprintHash || null,
      action,
    },
  });
  return log.id;
}

// Check blacklist by email, phone, or license number
export async function checkBlacklist(params: {
  email?: string;
  phone?: string;
  licenseNumber?: string;
}): Promise<{ blacklisted: boolean; reason?: string; notes?: string }> {
  const conditions: Record<string, unknown>[] = [];

  if (params.email) {
    conditions.push({ email: params.email.toLowerCase(), isActive: true });
  }
  if (params.phone) {
    conditions.push({ phone: params.phone, isActive: true });
  }
  if (params.licenseNumber) {
    conditions.push({ licenseNumber: params.licenseNumber, isActive: true });
  }

  if (conditions.length === 0) return { blacklisted: false };

  const entry = await prisma.blacklistedRenter.findFirst({
    where: {
      OR: conditions,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  if (entry) {
    return {
      blacklisted: true,
      reason: entry.reason,
      notes: entry.notes || undefined,
    };
  }

  return { blacklisted: false };
}

// Check IP anomalies
export async function checkIPAnomalies(
  ip: string,
  renterId?: number
): Promise<{ flagged: boolean; reason?: string }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Check multiple accounts from same IP
  const ipLogs = await prisma.renterActivityLog.findMany({
    where: {
      ipAddress: ip,
      timestamp: { gte: oneHourAgo },
      renterId: { not: null },
    },
    select: { renterId: true },
    distinct: ['renterId'],
  });

  const uniqueRenters = new Set(ipLogs.map(l => l.renterId)).size;
  if (uniqueRenters >= 3) {
    return {
      flagged: true,
      reason: `Multiple accounts (${uniqueRenters}) detected from same IP address`,
    };
  }

  // Check for rapid successive booking attempts from same IP
  const recentBookingAttempts = await prisma.renterActivityLog.count({
    where: {
      ipAddress: ip,
      action: 'booking_attempt',
      timestamp: { gte: oneHourAgo },
    },
  });

  if (recentBookingAttempts >= 5) {
    return {
      flagged: true,
      reason: `Rapid booking attempts (${recentBookingAttempts}) from same IP in 1 hour`,
    };
  }

  return { flagged: false };
}

// Check booking behavior patterns
export async function checkBookingBehavior(
  renterId: number
): Promise<{ flagged: boolean; severity?: string; reason?: string }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Check for multiple failed payment attempts in 1 hour
  const failedPayments = await prisma.renterActivityLog.count({
    where: {
      renterId,
      action: 'payment_attempt',
      flagged: true,
      timestamp: { gte: oneHourAgo },
    },
  });

  if (failedPayments >= 3) {
    return {
      flagged: true,
      severity: 'high',
      reason: `${failedPayments} failed payment attempts in the last hour`,
    };
  }

  // Check for multiple flags in 7 days
  const recentFlags = await prisma.fraudSignal.count({
    where: {
      renterId,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  if (recentFlags >= 3) {
    return {
      flagged: true,
      severity: 'critical',
      reason: `${recentFlags} fraud signals in the last 7 days`,
    };
  }

  return { flagged: false };
}

// Create a fraud signal
export async function createFraudSignal(params: {
  renterId: number;
  signalType: string;
  severity: string;
  details: Record<string, unknown>;
  autoActionTaken?: string;
}): Promise<void> {
  await prisma.fraudSignal.create({
    data: {
      renterId: params.renterId,
      signalType: params.signalType,
      severity: params.severity,
      details: params.details,
      autoActionTaken: params.autoActionTaken || 'none',
    },
  });

  // Auto-suspend if critical or multiple signals
  if (params.severity === 'critical' || params.autoActionTaken === 'suspended') {
    await prisma.renterAccount.update({
      where: { id: params.renterId },
      data: {
        trustedStatus: 'suspended',
        isActive: false,
      },
    });
  }
}

// Main fraud check middleware function
export async function runFraudCheck(
  request: Request,
  action: string,
  params: {
    renterId?: number;
    email?: string;
    phone?: string;
    licenseNumber?: string;
    fingerprintHash?: string;
  }
): Promise<FraudCheckResult> {
  const result: FraudCheckResult = {
    blocked: false,
    flagged: false,
    signals: [],
  };

  const ip = getClientIP(request);

  // Log the activity
  const logId = await logActivity(params.renterId || null, request, action, params.fingerprintHash);

  // 1. Blacklist check
  if (params.email || params.phone || params.licenseNumber) {
    const blacklistResult = await checkBlacklist({
      email: params.email,
      phone: params.phone,
      licenseNumber: params.licenseNumber,
    });

    if (blacklistResult.blacklisted) {
      result.blocked = true;
      result.flagged = true;
      result.reason = `Blacklisted: ${blacklistResult.reason}`;
      result.signals.push('blacklist_match');

      // Update the log entry as flagged
      await prisma.renterActivityLog.update({
        where: { id: logId },
        data: { flagged: true, flagReason: result.reason },
      });

      if (params.renterId) {
        await createFraudSignal({
          renterId: params.renterId,
          signalType: 'blacklist_match',
          severity: 'critical',
          details: { reason: blacklistResult.reason, notes: blacklistResult.notes },
          autoActionTaken: 'blocked',
        });
      }

      return result;
    }
  }

  // 2. IP anomaly check
  const ipCheck = await checkIPAnomalies(ip, params.renterId);
  if (ipCheck.flagged) {
    result.flagged = true;
    result.signals.push('ip_anomaly');

    await prisma.renterActivityLog.update({
      where: { id: logId },
      data: { flagged: true, flagReason: ipCheck.reason },
    });

    if (params.renterId) {
      await createFraudSignal({
        renterId: params.renterId,
        signalType: 'ip_anomaly',
        severity: 'medium',
        details: { ip, reason: ipCheck.reason },
        autoActionTaken: 'flagged',
      });
    }
  }

  // 3. Behavior pattern check (only for authenticated renters)
  if (params.renterId) {
    const behaviorCheck = await checkBookingBehavior(params.renterId);
    if (behaviorCheck.flagged) {
      result.flagged = true;
      result.signals.push('suspicious_pattern');

      if (behaviorCheck.severity === 'critical') {
        result.blocked = true;
        result.reason = behaviorCheck.reason;

        await createFraudSignal({
          renterId: params.renterId,
          signalType: 'suspicious_pattern',
          severity: 'critical',
          details: { reason: behaviorCheck.reason },
          autoActionTaken: 'suspended',
        });
      } else {
        await createFraudSignal({
          renterId: params.renterId,
          signalType: 'suspicious_pattern',
          severity: behaviorCheck.severity || 'medium',
          details: { reason: behaviorCheck.reason },
          autoActionTaken: 'flagged',
        });
      }
    }

    // 4. Check renter account status
    const renter = await prisma.renterAccount.findUnique({
      where: { id: params.renterId },
      select: { trustedStatus: true, isActive: true },
    });

    if (renter && (renter.trustedStatus === 'suspended' || renter.trustedStatus === 'banned')) {
      result.blocked = true;
      result.reason = `Account ${renter.trustedStatus}`;
    }

    if (renter && !renter.isActive) {
      result.blocked = true;
      result.reason = 'Account inactive';
    }
  }

  return result;
}

// Calculate trust score for a renter
export async function calculateTrustScore(renterId: number): Promise<number> {
  let score = 50; // Base score

  const renter = await prisma.renterAccount.findUnique({
    where: { id: renterId },
    include: {
      reviews: true,
      fraudSignals: {
        where: {
          createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        },
      },
    },
  });

  if (!renter) return 0;

  // Boost for verified identity
  if (renter.verificationStatus === 'verified') score += 20;
  if (renter.licenseVerified) score += 10;

  // Boost for completed rentals (via reviews)
  score += Math.min(renter.reviews.length * 5, 20);

  // Deduct for fraud signals
  for (const signal of renter.fraudSignals) {
    if (signal.severity === 'critical') score -= 30;
    else if (signal.severity === 'high') score -= 20;
    else if (signal.severity === 'medium') score -= 10;
    else score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

// Check if renter qualifies for trusted status
export async function checkTrustedStatusEligibility(renterId: number): Promise<{
  eligible: boolean;
  reasons: string[];
}> {
  const reasons: string[] = [];

  const renter = await prisma.renterAccount.findUnique({
    where: { id: renterId },
    include: {
      reviews: true,
      fraudSignals: {
        where: { severity: { in: ['high', 'critical'] } },
      },
    },
  });

  if (!renter) return { eligible: false, reasons: ['Renter not found'] };

  if (renter.verificationStatus !== 'verified') {
    reasons.push('Identity not verified');
  }

  if (renter.reviews.length === 0) {
    reasons.push('No completed rentals');
  }

  if (renter.fraudSignals.length > 0) {
    reasons.push('Active fraud signals');
  }

  if (renter.trustedStatus === 'banned' || renter.trustedStatus === 'suspended') {
    reasons.push(`Account is ${renter.trustedStatus}`);
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

// Grant trusted status
export async function grantTrustedStatus(renterId: number): Promise<void> {
  const score = await calculateTrustScore(renterId);
  await prisma.renterAccount.update({
    where: { id: renterId },
    data: {
      trustedStatus: 'trusted',
      trustedSince: new Date(),
      trustScore: score,
    },
  });
}

// Revoke trusted status
export async function revokeTrustedStatus(
  renterId: number,
  newStatus: 'unverified' | 'pending' | 'suspended' | 'banned'
): Promise<void> {
  await prisma.renterAccount.update({
    where: { id: renterId },
    data: {
      trustedStatus: newStatus,
      ...(newStatus === 'suspended' || newStatus === 'banned' ? { isActive: false } : {}),
    },
  });
}
