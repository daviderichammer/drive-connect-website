import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-05-28.basil',
});

function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'DC-';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

const PROTECTION_PRICES: Record<string, number> = {
  none: 0, basic: 15, standard: 29, premium: 49,
};

const INSURANCE_PRICES: Record<string, number> = {
  basic: 9.99, standard: 14.99, premium: 24.99,
};

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
      protectionPlan = 'basic',
      insuranceTier,
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

    // Check if booking already exists for this payment intent
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

    // Calculate pricing
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = parseFloat(vehicle.dailyRate.toString());

    // Dynamic pricing
    const pricingMultiplier = calculatePricingMultiplier(start);
    
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

    basePrice = parseFloat((basePrice * pricingMultiplier).toFixed(2));

    // Duration discounts
    let durationDiscount = 0;
    if (days >= 28) {
      durationDiscount = parseFloat((basePrice * 0.20).toFixed(2));
    } else if (days >= 7) {
      durationDiscount = parseFloat((basePrice * 0.10).toFixed(2));
    }

    // Early bird discount
    const daysUntilStart = Math.ceil((start.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const earlyBirdDiscount = daysUntilStart >= 7 ? parseFloat((basePrice * 0.05).toFixed(2)) : 0;

    const discountedBase = basePrice - durationDiscount - earlyBirdDiscount;
    const protectionPrice = (PROTECTION_PRICES[protectionPlan] || 0) * days;
    const insuranceAmount = insuranceTier ? parseFloat(((INSURANCE_PRICES[insuranceTier] || 0) * days).toFixed(2)) : 0;
    const deliveryPrice = (deliveryOption !== 'pickup' && vehicle.deliveryFee)
      ? parseFloat(vehicle.deliveryFee.toString()) : 0;
    const subtotal = discountedBase + protectionPrice + insuranceAmount + deliveryPrice;
    const taxes = parseFloat((subtotal * 0.07).toFixed(2));
    const totalPrice = parseFloat((subtotal + taxes).toFixed(2));

    const priceBreakdown = JSON.stringify({
      dailyRate, days, basePrice, pricingMultiplier,
      durationDiscount, earlyBirdDiscount, discountedBase,
      protectionPrice, insuranceAmount, deliveryPrice, subtotal, taxes, totalPrice,
    });

    // Platform fee (15%)
    const platformFeeAmount = parseFloat((totalPrice * 0.15).toFixed(2));
    const hostPayoutAmount = parseFloat((totalPrice - platformFeeAmount).toFixed(2));

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
        basePrice: discountedBase,
        protectionPrice,
        deliveryPrice,
        taxes,
        totalPrice,
        status: 'confirmed',
        paymentStatus: 'paid',
        stripePaymentIntentId: paymentIntentId,
        stripeChargeId: paymentIntent.latest_charge as string || null,
        insuranceTier: insuranceTier || null,
        insuranceAmount: insuranceAmount || null,
        pricingMultiplier,
        earlyBirdDiscount,
        durationDiscount,
        priceBreakdown,
        hostPayoutAmount,
        platformFeeAmount,
        payoutStatus: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      booking: {
        bookingReference: booking.bookingReference,
        totalPrice,
        paymentStatus: 'paid',
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

function calculatePricingMultiplier(start: Date): number {
  const month = start.getMonth();
  const dayOfWeek = start.getDay();
  let multiplier = 1.0;
  if (month >= 5 && month <= 7) multiplier += 0.15;
  if (month >= 10 && month <= 11) multiplier += 0.10;
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) multiplier += 0.10;
  return parseFloat(multiplier.toFixed(4));
}
