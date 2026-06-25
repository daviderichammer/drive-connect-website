// app/api/admin/fraud/signals/route.ts - already covers signals
// This is the fraud dashboard overview: app/api/admin/fraud/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getAdminFromSession, ADMIN_SESSION_COOKIE } from '@/lib/auth';

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalSignals,
      unreviewedSignals,
      criticalSignals,
      last7DaysSignals,
      last24hSignals,
      blacklistedCount,
      suspendedRenters,
      bannedRenters,
      trustedRenters,
      recentSignals,
      signalsByType,
      signalsBySeverity,
      flaggedIPs,
    ] = await Promise.all([
      prisma.fraudSignal.count(),
      prisma.fraudSignal.count({ where: { reviewedAt: null } }),
      prisma.fraudSignal.count({ where: { severity: 'critical', reviewedAt: null } }),
      prisma.fraudSignal.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.fraudSignal.count({ where: { createdAt: { gte: oneDayAgo } } }),
      prisma.blacklistedRenter.count({ where: { isActive: true } }),
      prisma.renterAccount.count({ where: { trustedStatus: 'suspended' } }),
      prisma.renterAccount.count({ where: { trustedStatus: 'banned' } }),
      prisma.renterAccount.count({ where: { trustedStatus: 'trusted' } }),
      prisma.fraudSignal.findMany({
        where: { reviewedAt: null },
        include: {
          renter: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
        orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
        take: 10,
      }),
      prisma.fraudSignal.groupBy({
        by: ['signalType'],
        _count: { id: true },
        where: { createdAt: { gte: thirtyDaysAgo } },
        orderBy: { _count: { id: 'desc' } },
      }),
      prisma.fraudSignal.groupBy({
        by: ['severity'],
        _count: { id: true },
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
      prisma.renterActivityLog.findMany({
        where: { flagged: true, timestamp: { gte: sevenDaysAgo } },
        select: { ipAddress: true, flagReason: true, timestamp: true },
        orderBy: { timestamp: 'desc' },
        take: 10,
        distinct: ['ipAddress'],
      }),
    ]);

    return NextResponse.json({
      success: true,
      overview: {
        totalSignals,
        unreviewedSignals,
        criticalSignals,
        last7DaysSignals,
        last24hSignals,
        blacklistedCount,
        suspendedRenters,
        bannedRenters,
        trustedRenters,
      },
      recentSignals,
      signalsByType: signalsByType.map(s => ({
        type: s.signalType,
        count: s._count.id,
      })),
      signalsBySeverity: signalsBySeverity.map(s => ({
        severity: s.severity,
        count: s._count.id,
      })),
      flaggedIPs,
    });
  } catch (error) {
    console.error('Fraud dashboard GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
