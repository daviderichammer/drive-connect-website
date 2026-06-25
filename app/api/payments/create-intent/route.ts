import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-05-28.basil',
});

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
      insuranceTier,
      renterFirstName,
      renterLastName,
      renterEmail,
      renterPhone,
      renterLicenseNumber,
      renterLicenseState,
    } = body;

    if (!vehicleId || !startDate || !endDate || !renterEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
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

    // Calculate pricing with dynamic pricing
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = parseFloat(vehicle.dailyRate.toString());

    // Dynamic pricing multiplier
    const pricingMultiplier = calculatePricingMultiplier(start, end);
    
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

    // Apply peak pricing multiplier
    basePrice = parseFloat((basePrice * pricingMultiplier).toFixed(2));

    // Duration discounts
    let durationDiscount = 0;
    if (days >= 28) {
      durationDiscount = parseFloat((basePrice * 0.20).toFixed(2));
    } else if (days >= 7) {
      durationDiscount = parseFloat((basePrice * 0.10).toFixed(2));
    }

    // Early bird discount (7+ days ahead)
    const daysUntilStart = Math.ceil((start.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const earlyBirdDiscount = daysUntilStart >= 7 ? parseFloat((basePrice * 0.05).toFixed(2)) : 0;

    const discountedBase = basePrice - durationDiscount - earlyBirdDiscount;

    // Protection plan pricing
    const PROTECTION_PRICES: Record<string, number> = {
      none: 0, basic: 15, standard: 29, premium: 49,
    };
    const protectionPrice = (PROTECTION_PRICES[protectionPlan] || 0) * days;

    // Insurance pricing (Phase 6C)
    const INSURANCE_PRICES: Record<string, number> = {
      basic: 9.99, standard: 14.99, premium: 24.99,
    };
    const insuranceAmount = insuranceTier ? parseFloat(((INSURANCE_PRICES[insuranceTier] || 0) * days).toFixed(2)) : 0;

    const deliveryPrice = (deliveryOption !== 'pickup' && vehicle.deliveryFee)
      ? parseFloat(vehicle.deliveryFee.toString())
      : 0;

    const subtotal = discountedBase + protectionPrice + insuranceAmount + deliveryPrice;
    const taxes = parseFloat((subtotal * 0.07).toFixed(2));
    const totalPrice = parseFloat((subtotal + taxes).toFixed(2));

    // Price breakdown for display
    const priceBreakdown = JSON.stringify({
      dailyRate,
      days,
      basePrice,
      pricingMultiplier,
      durationDiscount,
      earlyBirdDiscount,
      discountedBase,
      protectionPrice,
      insuranceAmount,
      deliveryPrice,
      subtotal,
      taxes,
      totalPrice,
    });

    // Create Stripe Payment Intent
    const amountInCents = Math.round(totalPrice * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        vehicleId: vehicleId.toString(),
        startDate,
        endDate,
        renterEmail,
        protectionPlan,
        insuranceTier: insuranceTier || '',
      },
      description: `Drive Connect booking: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      receipt_email: renterEmail,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      pricing: {
        days,
        basePrice,
        pricingMultiplier,
        durationDiscount,
        earlyBirdDiscount,
        discountedBase,
        protectionPrice,
        insuranceAmount,
        deliveryPrice,
        taxes,
        totalPrice,
        priceBreakdown,
      },
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

function calculatePricingMultiplier(start: Date, end: Date): number {
  const month = start.getMonth(); // 0-11
  const dayOfWeek = start.getDay(); // 0=Sun, 6=Sat
  
  let multiplier = 1.0;
  
  // Summer peak season (June-August)
  if (month >= 5 && month <= 7) {
    multiplier += 0.15;
  }
  
  // Holiday season (November-December)
  if (month >= 10 && month <= 11) {
    multiplier += 0.10;
  }
  
  // Weekend premium (Friday-Sunday start)
  if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
    multiplier += 0.10;
  }
  
  // Check for major US holidays
  const holidays = getUSHolidays(start.getFullYear());
  const startStr = start.toISOString().split('T')[0];
  if (holidays.includes(startStr)) {
    multiplier += 0.20;
  }
  
  return parseFloat(multiplier.toFixed(4));
}

function getUSHolidays(year: number): string[] {
  return [
    `${year}-01-01`, // New Year's Day
    `${year}-07-04`, // Independence Day
    `${year}-11-28`, // Thanksgiving (approx)
    `${year}-11-29`, // Black Friday
    `${year}-12-24`, // Christmas Eve
    `${year}-12-25`, // Christmas Day
    `${year}-12-31`, // New Year's Eve
    `${year}-05-26`, // Memorial Day (approx)
    `${year}-09-01`, // Labor Day (approx)
  ];
}
