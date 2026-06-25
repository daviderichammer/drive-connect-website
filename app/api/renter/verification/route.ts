import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function getRenterFromSession(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('renter_session')?.value;
  if (!sessionToken) return null;

  const session = await prisma.renterSession.findUnique({
    where: { sessionToken },
    include: { renter: true },
  });

  if (!session || session.expiresAt < new Date()) return null;
  return session.renter;
}

export async function GET(request: NextRequest) {
  try {
    const renter = await getRenterFromSession(request);
    if (!renter) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      verification: {
        status: renter.verificationStatus,
        licenseImageFront: renter.licenseImageFront,
        licenseImageBack: renter.licenseImageBack,
        verificationNotes: renter.verificationNotes,
        verificationReviewedAt: renter.verificationReviewedAt,
        licenseNumber: renter.licenseNumber,
        licenseState: renter.licenseState,
      },
    });
  } catch (error) {
    console.error('Verification GET error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const renter = await getRenterFromSession(request);
    if (!renter) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const frontImage = formData.get('frontImage') as File | null;
    const backImage = formData.get('backImage') as File | null;
    const licenseNumber = formData.get('licenseNumber') as string;
    const licenseState = formData.get('licenseState') as string;

    if (!frontImage || !backImage) {
      return NextResponse.json(
        { success: false, error: 'Both front and back license images are required' },
        { status: 400 }
      );
    }

    // Save images to public/uploads/licenses/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'licenses');
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const frontFileName = `${renter.id}_${timestamp}_front.${frontImage.name.split('.').pop()}`;
    const backFileName = `${renter.id}_${timestamp}_back.${backImage.name.split('.').pop()}`;

    const frontBuffer = Buffer.from(await frontImage.arrayBuffer());
    const backBuffer = Buffer.from(await backImage.arrayBuffer());

    await writeFile(path.join(uploadDir, frontFileName), frontBuffer);
    await writeFile(path.join(uploadDir, backFileName), backBuffer);

    const frontUrl = `/uploads/licenses/${frontFileName}`;
    const backUrl = `/uploads/licenses/${backFileName}`;

    // Update renter record
    await prisma.renterAccount.update({
      where: { id: renter.id },
      data: {
        licenseImageFront: frontUrl,
        licenseImageBack: backUrl,
        licenseNumber: licenseNumber || renter.licenseNumber,
        licenseState: licenseState || renter.licenseState,
        verificationStatus: 'pending',
        verificationNotes: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'License images uploaded successfully. Verification is pending review.',
      status: 'pending',
    });
  } catch (error) {
    console.error('Verification POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload verification documents' }, { status: 500 });
  }
}
