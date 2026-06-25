import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // For testing without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        await handleRefund(charge);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const booking = await prisma.booking.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (booking) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: 'paid',
        status: 'confirmed',
        stripeChargeId: paymentIntent.latest_charge as string || null,
      },
    });
    console.log(`Payment confirmed for booking ${booking.bookingReference}`);
  }
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const booking = await prisma.booking.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (booking) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: 'failed',
        status: 'cancelled',
      },
    });
    console.log(`Payment failed for booking ${booking.bookingReference}`);
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const booking = await prisma.booking.findFirst({
    where: { stripeChargeId: charge.id },
  });

  if (booking) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: 'refunded',
        status: 'cancelled',
      },
    });
    console.log(`Refund processed for booking ${booking.bookingReference}`);
  }
}
