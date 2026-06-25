// app/api/admin/fraud/blacklist/route.ts
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
    const search = searchParams.get('search') || '';
    const activeOnly = searchParams.get('active') !== 'false';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (activeOnly) where.isActive = true;
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { phone: { contains: search } },
        { licenseNumber: { contains: search } },
        { notes: { contains: search } },
      ];
    }

    const [entries, total] = await Promise.all([
      prisma.blacklistedRenter.findMany({
        where,
        orderBy: { addedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blacklistedRenter.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      entries,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Blacklist GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { renterId, email, phone, licenseNumber, reason, notes, expiresAt } = body;

    if (!reason) {
      return NextResponse.json({ success: false, error: 'Reason is required' }, { status: 400 });
    }

    if (!email && !phone && !licenseNumber && !renterId) {
      return NextResponse.json(
        { success: false, error: 'At least one identifier (email, phone, license, or renter ID) is required' },
        { status: 400 }
      );
    }

    // Get admin user id
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: admin },
      select: { id: true },
    });

    const entry = await prisma.blacklistedRenter.create({
      data: {
        renterId: renterId ? parseInt(renterId) : null,
        email: email?.toLowerCase() || null,
        phone: phone || null,
        licenseNumber: licenseNumber || null,
        reason,
        addedBy: adminUser?.id || null,
        notes: notes || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
    });

    // If renter ID provided, also update their trusted status
    if (renterId) {
      await prisma.renterAccount.update({
        where: { id: parseInt(renterId) },
        data: {
          trustedStatus: reason === 'fraud' || reason === 'stolen_identity' ? 'banned' : 'suspended',
          isActive: false,
        },
      });
    }

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Blacklist POST error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
