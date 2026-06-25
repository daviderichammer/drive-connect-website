// app/api/admin/fraud/signals/[id]/review/route.ts
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
    const signalId = parseInt(id);
    const body = await request.json();
    const { notes } = body;

    // Get admin user id
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: admin },
      select: { id: true },
    });

    const signal = await prisma.fraudSignal.update({
      where: { id: signalId },
      data: {
        reviewedBy: adminUser?.id || null,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, signal });
  } catch (error) {
    console.error('Signal review error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
