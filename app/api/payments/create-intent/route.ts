import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { calculateFullPricing } from '@/lib/pricing';
import { checkPaymentFraud } from '@/lib/fraudMiddleware';
import { getCurrentRenter } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-06-24.dahlia',
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
      protectionPlan = 'standard',
      insuranceTier = 'standard',
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

    // Fraud check: try to get logged-in renter for deeper checks
    const renter = await getCurrentRenter().catch(() => null);
    if (renter) {
      const fraudCheck = await checkPaymentFraud(request, renter.id, renterEmail);
      if (fraudCheck.blocked && fraudCheck.response) {
        return fraudCheck.response;
      }
    } else {
      // Anonymous: check blacklist only
      const blacklisted = await prisma.blacklistedRenter.findFirst({
        where: {
          isActive: true,
          OR: [
            { email: renterEmail?.toLowerCase() },
            ...(renterPhone ? [{ phone: renterPhone }] : []),
            ...(renterLicenseNumber ? [{ licenseNumber: renterLicenseNumber }] : []),
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
          { success: false, error: 'Payment not allowed. Please contact support.' },
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

    // Create Stripe Payment Intent
    const amountInCents = Math.round(pricing.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        vehicleId: vehicleId.toString(),
        startDate,
        endDate,
        renterEmail,
        renterFirstName: renterFirstName || '',
        renterLastName: renterLastName || '',
        renterPhone: renterPhone || '',
        renterLicenseNumber: renterLicenseNumber || '',
        renterLicenseState: renterLicenseState || '',
        protectionPlan,
        insuranceTier,
        deliveryOption,
        pickupTime,
        returnTime,
        totalDays: pricing.days.toString(),
        totalPrice: pricing.totalPrice.toString(),
      },
      description: `Drive Connect booking: ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      receipt_email: renterEmail,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      pricing: {
        days: pricing.days,
        basePrice: pricing.basePrice,
        pricingMultiplier: pricing.pricingMultiplier,
        peakLabel: pricing.peakLabel,
        durationDiscount: pricing.durationDiscount,
        durationDiscountLabel: pricing.durationDiscountLabel,
        earlyBirdDiscount: pricing.earlyBirdDiscount,
        discountedBase: pricing.discountedBase,
        protectionPrice: pricing.protectionPrice,
        insuranceAmount: pricing.insuranceAmount,
        deliveryPrice: pricing.deliveryPrice,
        taxes: pricing.taxes,
        totalPrice: pricing.totalPrice,
        savings: pricing.savings,
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
