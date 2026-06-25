import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { calculateFullPricing } from '@/lib/pricing';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-06-24.dahlia',
});

function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'DC-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paymentIntentId,
      vehicleId,
      startDate,
      endDate,
      pickupTime = '10:00',
      returnTime = '10:00',
      deliveryOption = 'pickup',
      deliveryAddress,
      protectionPlan = 'standard',
      insuranceTier = 'standard',
      renterFirstName,
      renterLastName,
      renterEmail,
      renterPhone,
      renterLicenseNumber,
      renterLicenseState,
    } = body;

    if (!paymentIntentId || !vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, error: `Payment not completed. Status: ${paymentIntent.status}` },
        { status: 400 }
      );
    }

    // Check if booking already exists for this payment intent (idempotency)
    const existingBooking = await prisma.booking.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (existingBooking) {
      return NextResponse.json({
        success: true,
        booking: { bookingReference: existingBooking.bookingReference },
      });
    }

    // Fetch vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
      include: { host: true },
    });

    if (!vehicle) {
      return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    }

    // Phase 6E: Use centralized dynamic pricing engine
    const pricing = calculateFullPricing({
      dailyRate: parseFloat(vehicle.dailyRate.toString()),
      startDate,
      endDate,
      protectionPlan,
      insuranceTier,
      deliveryOption,
      deliveryFee: vehicle.deliveryFee ? parseFloat(vehicle.deliveryFee.toString()) : 0,
    });

    const priceBreakdown = JSON.stringify({
      dailyRate: parseFloat(vehicle.dailyRate.toString()),
      days: pricing.days,
      basePrice: pricing.basePrice,
      pricingMultiplier: pricing.pricingMultiplier,
      peakLabel: pricing.peakLabel,
      durationDiscount: pricing.durationDiscount,
      earlyBirdDiscount: pricing.earlyBirdDiscount,
      discountedBase: pricing.discountedBase,
      protectionPrice: pricing.protectionPrice,
      insuranceAmount: pricing.insuranceAmount,
      deliveryPrice: pricing.deliveryPrice,
      subtotal: pricing.subtotal,
      taxes: pricing.taxes,
      totalPrice: pricing.totalPrice,
      savings: pricing.savings,
    });

    // Platform fee (15%)
    const platformFeeAmount = parseFloat((pricing.totalPrice * 0.15).toFixed(2));
    const hostPayoutAmount = parseFloat((pricing.totalPrice - platformFeeAmount).toFixed(2));

    // Generate unique booking reference
    let bookingReference = generateBookingReference();
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.booking.findUnique({ where: { bookingReference } });
      if (!existing) break;
      bookingReference = generateBookingReference();
      attempts++;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

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
        basePrice: pricing.discountedBase,
        protectionPrice: pricing.protectionPrice,
        deliveryPrice: pricing.deliveryPrice,
        taxes: pricing.taxes,
        totalPrice: pricing.totalPrice,
        status: 'confirmed',
        paymentStatus: 'paid',
        stripePaymentIntentId: paymentIntentId,
        stripeChargeId: (paymentIntent.latest_charge as string) || null,
        insuranceTier: insuranceTier || null,
        insuranceAmount: pricing.insuranceAmount || null,
        pricingMultiplier: pricing.pricingMultiplier,
        earlyBirdDiscount: pricing.earlyBirdDiscount,
        durationDiscount: pricing.durationDiscount,
        priceBreakdown,
        hostPayoutAmount,
        platformFeeAmount,
        payoutStatus: 'pending',
      },
    });

    // Update vehicle trip count
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { trips: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      booking: {
        bookingReference: booking.bookingReference,
        totalPrice: pricing.totalPrice,
        paymentStatus: 'paid',
        days: pricing.days,
        savings: pricing.savings,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to confirm booking' },
      { status: 500 }
    );
  }
}
