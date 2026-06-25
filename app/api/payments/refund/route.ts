import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, bookingReference, reason } = body;

    if (!bookingId && !bookingReference) {
      return NextResponse.json(
        { success: false, error: 'Booking ID or reference required' },
        { status: 400 }
      );
    }

    // Find booking
    const booking = await prisma.booking.findFirst({
      where: bookingId
        ? { id: parseInt(bookingId) }
        : { bookingReference },
    });

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }

    if (booking.paymentStatus !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Booking has not been paid or already refunded' },
        { status: 400 }
      );
    }

    if (!booking.stripePaymentIntentId) {
      return NextResponse.json(
        { success: false, error: 'No payment intent found for this booking' },
        { status: 400 }
      );
    }

    // Process refund via Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(booking.stripePaymentIntentId);
    
    if (!paymentIntent.latest_charge) {
      return NextResponse.json(
        { success: false, error: 'No charge found to refund' },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({
      charge: paymentIntent.latest_charge as string,
      reason: (reason as 'duplicate' | 'fraudulent' | 'requested_by_customer') || 'requested_by_customer',
    });

    // Update booking status
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: 'refunded',
        status: 'cancelled',
      },
    });

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100,
      status: refund.status,
    });
  } catch (error) {
    console.error('Refund error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}
