// app/api/renter/trust-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentRenter } from '@/lib/auth';
import { calculateTrustScore, checkTrustedStatusEligibility } from '@/lib/fraud';

export async function GET(request: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const score = await calculateTrustScore(renter.id);
    const eligibility = await checkTrustedStatusEligibility(renter.id);

    // Get recent fraud signals
    const recentSignals = await prisma.fraudSignal.findMany({
      where: { renterId: renter.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get activity log count
    const activityCount = await prisma.renterActivityLog.count({
      where: { renterId: renter.id },
    });

    return NextResponse.json({
      success: true,
      trust: {
        status: renter.trustedStatus,
        score,
        trustedSince: renter.trustedSince,
        eligibleForTrusted: eligibility.eligible,
        eligibilityReasons: eligibility.reasons,
        recentSignals: recentSignals.map(s => ({
          id: s.id,
          type: s.signalType,
          severity: s.severity,
          action: s.autoActionTaken,
          date: s.createdAt,
        })),
        activityCount,
        verificationStatus: renter.verificationStatus,
      },
    });
  } catch (error) {
    console.error('Trust status GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
