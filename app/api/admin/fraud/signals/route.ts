// app/api/admin/fraud/signals/route.ts
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const severity = searchParams.get('severity');
    const signalType = searchParams.get('type');
    const unreviewed = searchParams.get('unreviewed') === 'true';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (severity) where.severity = severity;
    if (signalType) where.signalType = signalType;
    if (unreviewed) where.reviewedAt = null;

    const [signals, total] = await Promise.all([
      prisma.fraudSignal.findMany({
        where,
        include: {
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              trustedStatus: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.fraudSignal.count({ where }),
    ]);

    // Get summary stats
    const stats = await prisma.fraudSignal.groupBy({
      by: ['severity'],
      _count: { id: true },
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    return NextResponse.json({
      success: true,
      signals,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats: stats.reduce((acc, s) => ({ ...acc, [s.severity]: s._count.id }), {}),
    });
  } catch (error) {
    console.error('Admin fraud signals GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
