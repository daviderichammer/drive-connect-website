import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

// POST /api/operator/deposits/confirm - Operator confirms deposit collected
export async function POST(request: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, amountCollected, collectionMethod, notes } = body;

    if (!bookingId || amountCollected == null || !collectionMethod) {
      return NextResponse.json({ error: "bookingId, amountCollected, and collectionMethod are required." }, { status: 400 });
    }

    const validMethods = ["cash", "card", "venmo", "zelle", "paypal", "other"];
    if (!validMethods.includes(collectionMethod)) {
      return NextResponse.json({ error: "Invalid collection method." }, { status: 400 });
    }

    // Verify booking belongs to this operator
    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), hostId: host.id },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    // Upsert deposit record
    const deposit = await prisma.depositRecord.upsert({
      where: { bookingId: parseInt(bookingId) },
      update: {
        amountCollected: parseFloat(amountCollected),
        collectionMethod,
        status: "collected",
        collectedAt: new Date(),
        notes: notes || null,
      },
      create: {
        bookingId: parseInt(bookingId),
        operatorId: host.id,
        renterId: 0, // renter not linked via FK in this schema
        amountRequired: parseFloat(amountCollected),
        amountCollected: parseFloat(amountCollected),
        collectionMethod,
        status: "collected",
        collectedAt: new Date(),
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      deposit: {
        ...deposit,
        amountRequired: parseFloat(deposit.amountRequired.toString()),
        amountCollected: deposit.amountCollected ? parseFloat(deposit.amountCollected.toString()) : null,
      },
    });
  } catch (error) {
    console.error("Confirm deposit error:", error);
    return NextResponse.json({ error: "Failed to confirm deposit." }, { status: 500 });
  }
}
