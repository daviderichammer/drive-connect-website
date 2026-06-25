// app/api/admin/fraud/blacklist/[id]/route.ts
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const entryId = parseInt(id);

    // Soft delete - mark as inactive
    const entry = await prisma.blacklistedRenter.update({
      where: { id: entryId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Blacklist entry removed', entry });
  } catch (error) {
    console.error('Blacklist DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
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
    const entry = await prisma.blacklistedRenter.findUnique({
      where: { id: parseInt(id) },
    });

    if (!entry) {
      return NextResponse.json({ success: false, error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Blacklist GET by ID error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
