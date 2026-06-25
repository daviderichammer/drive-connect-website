import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkBookingFraud } from '@/lib/fraudMiddleware';

function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'DC-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

const PROTECTION_PRICES: Record<string, number> = {
  none: 0,
  basic: 15,
  standard: 29,
  premium: 49,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicleId,
      startDate,
      endDate,
      pickupTime = '10:00',
      returnTime = '10:00',
      deliveryOption = 'pickup',
      deliveryAddress,
      protectionPlan = 'basic',
      renterFirstName,
      renterLastName,
      renterEmail,
      renterPhone,
      renterLicenseNumber,
      renterLicenseState,
      renterId,
    } = body;

    // Validate required fields
    if (!vehicleId || !startDate || !endDate || !renterFirstName || !renterLastName ||
        !renterEmail || !renterPhone || !renterLicenseNumber || !renterLicenseState) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fraud check middleware (if renter ID is known)
    if (renterId) {
      const fraudCheck = await checkBookingFraud(request, parseInt(renterId), renterEmail, renterPhone);
      if (fraudCheck.blocked && fraudCheck.response) {
        return fraudCheck.response;
      }
    } else {
      // Even without renterId, check blacklist by email/phone
      const { checkBookingFraud: _, ...fraudLib } = await import('@/lib/fraudMiddleware');
      // Check blacklist directly for anonymous bookings
      const blacklisted = await prisma.blacklistedRenter.findFirst({
        where: {
          isActive: true,
          OR: [
            { email: renterEmail?.toLowerCase() },
            { phone: renterPhone },
            { licenseNumber: renterLicenseNumber },
          ],
          AND: [
            {
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
              ],
            },
          ],
        },
      });

      if (blacklisted) {
        return NextResponse.json(
          { success: false, error: 'Booking not allowed. Please contact support.' },
          { status: 403 }
        );
      }
    }

    // Fetch vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
      include: { host: true },
    });

    if (!vehicle || vehicle.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Vehicle not available' },
        { status: 404 }
      );
    }

    // Check availability
    const start = new Date(startDate);
    const end = new Date(endDate);

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: { notIn: ['cancelled'] },
        startDate: { lte: end },
        endDate: { gte: start },
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { success: false, error: 'Vehicle is not available for the selected dates' },
        { status: 409 }
      );
    }

    // Calculate pricing
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = parseFloat(vehicle.dailyRate.toString());

    let basePrice: number;
    if (days >= 28 && vehicle.monthlyRate) {
      const months = Math.floor(days / 28);
      const remainingDays = days % 28;
      basePrice = months * parseFloat(vehicle.monthlyRate.toString()) + remainingDays * dailyRate;
    } else if (days >= 7 && vehicle.weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      basePrice = weeks * parseFloat(vehicle.weeklyRate.toString()) + remainingDays * dailyRate;
    } else {
      basePrice = days * dailyRate;
    }

    const protectionPrice = (PROTECTION_PRICES[protectionPlan] || 0) * days;
    const deliveryPrice = (deliveryOption !== 'pickup' && vehicle.deliveryFee)
      ? parseFloat(vehicle.deliveryFee.toString())
      : 0;
    const subtotal = basePrice + protectionPrice + deliveryPrice;
    const taxes = parseFloat((subtotal * 0.07).toFixed(2));
    const totalPrice = parseFloat((subtotal + taxes).toFixed(2));

    // Generate unique booking reference
    let bookingReference = generateBookingReference();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.booking.findUnique({ where: { bookingReference } });
      if (!existing) break;
      bookingReference = generateBookingReference();
      attempts++;
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        vehicleId: vehicle.id,
        hostId: vehicle.hostId,
        renterFirstName,
        renterLastName,
        renterEmail,
        renterPhone,
        renterLicenseNumber,
        renterLicenseState,
        startDate: start,
        endDate: end,
        pickupTime,
        returnTime,
        deliveryOption,
        deliveryAddress: deliveryAddress || null,
        protectionPlan,
        basePrice,
        protectionPrice,
        deliveryPrice,
        taxes,
        totalPrice,
        status: 'confirmed',
        paymentStatus: 'pending',
      },
      include: {
        vehicle: {
          include: {
            host: {
              select: {
                businessName: true,
                ownerName: true,
                phone: true,
              },
            },
          },
        },
      },
    });

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
    }, { status: 201 });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
