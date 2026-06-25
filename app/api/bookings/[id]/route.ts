import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Support both numeric ID and booking reference
    const isNumeric = /^\d+$/.test(id);

    const booking = await prisma.booking.findFirst({
      where: isNumeric
        ? { id: parseInt(id) }
        : { bookingReference: id },
      include: {
        vehicle: {
          include: {
            host: {
              select: {
                businessName: true,
                ownerName: true,
                phone: true,
                description: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    const days = Math.ceil(
      (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      success: true,
      booking: {
        ...booking,
        basePrice: parseFloat(booking.basePrice.toString()),
        protectionPrice: parseFloat(booking.protectionPrice.toString()),
        deliveryPrice: parseFloat(booking.deliveryPrice.toString()),
        taxes: parseFloat(booking.taxes.toString()),
        totalPrice: parseFloat(booking.totalPrice.toString()),
        vehicle: {
          ...booking.vehicle,
          dailyRate: parseFloat(booking.vehicle.dailyRate.toString()),
          photos: (() => {
            try { return JSON.parse(booking.vehicle.photos || '[]'); } catch { return []; }
          })(),
        },
        days,
      },
    });
  } catch (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
