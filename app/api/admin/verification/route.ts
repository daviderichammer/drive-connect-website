import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function getAdminFromSession(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_session')?.value;
  if (!adminToken) return null;
  // Simple admin check - in production use proper JWT
  if (adminToken === 'admin_authenticated') return { id: 1, name: 'Admin' };
  return null;
}

export async function GET(request: NextRequest) {
  try {
    // Check admin auth via cookie or header
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_session')?.value;
    const authHeader = request.headers.get('x-admin-auth');
    
    if (!adminToken && authHeader !== 'admin_authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    const renters = await prisma.renterAccount.findMany({
      where: {
        verificationStatus: status === 'all' ? undefined : status,
        licenseImageFront: { not: null },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        licenseNumber: true,
        licenseState: true,
        licenseImageFront: true,
        licenseImageBack: true,
        verificationStatus: true,
        verificationNotes: true,
        verificationReviewedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, renters });
  } catch (error) {
    console.error('Admin verification GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_session')?.value;
    const authHeader = request.headers.get('x-admin-auth');
    
    if (!adminToken && authHeader !== 'admin_authenticated') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { renterId, action, notes } = body;

    if (!renterId || !action) {
      return NextResponse.json({ success: false, error: 'renterId and action required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'action must be approve or reject' }, { status: 400 });
    }

    const updatedRenter = await prisma.renterAccount.update({
      where: { id: parseInt(renterId) },
      data: {
        verificationStatus: action === 'approve' ? 'verified' : 'rejected',
        licenseVerified: action === 'approve',
        verificationNotes: notes || null,
        verificationReviewedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Renter ${action === 'approve' ? 'verified' : 'rejected'} successfully`,
      status: updatedRenter.verificationStatus,
    });
  } catch (error) {
    console.error('Admin verification PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
