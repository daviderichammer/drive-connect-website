// app/api/admin/renters/[id]/signals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getAdminFromSession, ADMIN_SESSION_COOKIE } from '@/lib/auth';
import { calculateTrustScore } from '@/lib/fraud';

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const renterId = parseInt(id);

    const renter = await prisma.renterAccount.findUnique({
      where: { id: renterId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        licenseNumber: true,
        trustedStatus: true,
        trustedSince: true,
        trustScore: true,
        verificationStatus: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!renter) {
      return NextResponse.json({ success: false, error: 'Renter not found' }, { status: 404 });
    }

    const [signals, activityLogs, blacklistEntries] = await Promise.all([
      prisma.fraudSignal.findMany({
        where: { renterId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.renterActivityLog.findMany({
        where: { renterId },
        orderBy: { timestamp: 'desc' },
        take: 20,
      }),
      prisma.blacklistedRenter.findMany({
        where: {
          OR: [
            { renterId },
            { email: renter.email },
            ...(renter.phone ? [{ phone: renter.phone }] : []),
            ...(renter.licenseNumber ? [{ licenseNumber: renter.licenseNumber }] : []),
          ],
        },
      }),
    ]);

    const currentScore = await calculateTrustScore(renterId);

    return NextResponse.json({
      success: true,
      renter,
      trustScore: currentScore,
      signals,
      activityLogs,
      blacklistEntries,
      summary: {
        totalSignals: signals.length,
        criticalSignals: signals.filter(s => s.severity === 'critical').length,
        highSignals: signals.filter(s => s.severity === 'high').length,
        unreviewedSignals: signals.filter(s => !s.reviewedAt).length,
        isBlacklisted: blacklistEntries.some(b => b.isActive),
      },
    });
  } catch (error) {
    console.error('Renter signals GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
