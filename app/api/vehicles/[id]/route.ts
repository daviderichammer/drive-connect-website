import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseInt(id);

    if (isNaN(vehicleId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        host: {
          select: {
            id: true,
            businessName: true,
            ownerName: true,
            description: true,
            logoUrl: true,
            serviceAreas: true,
            insuranceVerified: true,
          },
        },
        bookings: {
          where: {
            status: { notIn: ['cancelled'] },
            endDate: { gte: new Date() },
          },
          select: {
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    const result = {
      ...vehicle,
      photos: (() => {
        try {
          return JSON.parse(vehicle.photos || '[]');
        } catch {
          return [];
        }
      })(),
      dailyRate: parseFloat(vehicle.dailyRate.toString()),
      weeklyRate: vehicle.weeklyRate ? parseFloat(vehicle.weeklyRate.toString()) : null,
      monthlyRate: vehicle.monthlyRate ? parseFloat(vehicle.monthlyRate.toString()) : null,
      securityDeposit: vehicle.securityDeposit ? parseFloat(vehicle.securityDeposit.toString()) : null,
      deliveryFee: vehicle.deliveryFee ? parseFloat(vehicle.deliveryFee.toString()) : null,
      rating: parseFloat(vehicle.rating.toString()),
    };

    return NextResponse.json({ success: true, vehicle: result });
  } catch (error) {
    console.error('Vehicle detail error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}
