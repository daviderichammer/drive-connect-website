// app/api/admin/renters/[id]/reinstate/route.ts
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
    const { notes } = body;

    const renter = await prisma.renterAccount.findUnique({
      where: { id: renterId },
    });

    if (!renter) {
      return NextResponse.json({ success: false, error: 'Renter not found' }, { status: 404 });
    }

    if (renter.trustedStatus === 'banned') {
      return NextResponse.json(
        { success: false, error: 'Banned renters cannot be reinstated through this endpoint. Use admin override.' },
        { status: 400 }
      );
    }

    // Recalculate trust score
    const score = await calculateTrustScore(renterId);

    // Determine new status based on verification
    const newStatus = renter.verificationStatus === 'verified' ? 'pending' : 'unverified';

    await prisma.renterAccount.update({
      where: { id: renterId },
      data: {
        trustedStatus: newStatus,
        isActive: true,
        trustScore: score,
      },
    });

    // Get admin user id
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: admin },
      select: { id: true },
    });

    // Log reinstatement as a reviewed signal
    await prisma.fraudSignal.create({
      data: {
        renterId,
        signalType: 'suspicious_pattern',
        severity: 'low',
        details: {
          action: 'reinstated',
          notes: notes || 'Manual admin reinstatement',
          adminEmail: admin,
          newStatus,
        },
        autoActionTaken: 'none',
        reviewedBy: adminUser?.id || null,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Renter reinstated successfully',
      renterId,
      newStatus,
      trustScore: score,
    });
  } catch (error) {
    console.error('Reinstate renter error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
