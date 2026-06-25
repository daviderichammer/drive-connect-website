// app/api/admin/renters/[id]/suspend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getAdminFromSession, ADMIN_SESSION_COOKIE } from '@/lib/auth';
import { createFraudSignal } from '@/lib/fraud';

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

export async function POST(
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
    const body = await request.json();
    const { reason, permanent = false } = body;

    const renter = await prisma.renterAccount.findUnique({
      where: { id: renterId },
    });

    if (!renter) {
      return NextResponse.json({ success: false, error: 'Renter not found' }, { status: 404 });
    }

    const newStatus = permanent ? 'banned' : 'suspended';

    await prisma.renterAccount.update({
      where: { id: renterId },
      data: {
        trustedStatus: newStatus,
        isActive: false,
      },
    });

    // Get admin user id
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: admin },
      select: { id: true },
    });

    // Create fraud signal for manual suspension
    await prisma.fraudSignal.create({
      data: {
        renterId,
        signalType: 'suspicious_pattern',
        severity: permanent ? 'critical' : 'high',
        details: {
          reason: reason || 'Manual admin action',
          action: permanent ? 'banned' : 'suspended',
          adminEmail: admin,
        },
        autoActionTaken: permanent ? 'suspended' : 'blocked',
        reviewedBy: adminUser?.id || null,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Renter ${permanent ? 'banned' : 'suspended'} successfully`,
      renterId,
      newStatus,
    });
  } catch (error) {
    console.error('Suspend renter error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
