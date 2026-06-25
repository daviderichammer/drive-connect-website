import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

// GET /api/renter/deposits - Renter views their deposit status
export async function GET() {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Get all bookings for this renter and find associated deposits
    const bookings = await prisma.booking.findMany({
      where: { renterEmail: renter.email },
      select: {
        id: true,
        bookingReference: true,
        startDate: true,
        endDate: true,
        status: true,
        vehicle: { select: { year: true, make: true, model: true } },
        host: { select: { businessName: true, ownerName: true, phone: true } },
      },
    });

    const bookingIds = bookings.map((b) => b.id);
    const deposits = await prisma.depositRecord.findMany({
      where: { bookingId: { in: bookingIds } },
      orderBy: { createdAt: "desc" },
    });

    // Map deposits to bookings
    const depositMap = new Map(deposits.map((d) => [d.bookingId, d]));

    // Also get deposit tiers for context
    const tiers = await prisma.depositTier.findMany();
    const tierMap = new Map(tiers.map((t) => [t.vehicleClass, t]));

    const result = bookings.map((booking) => {
      const deposit = depositMap.get(booking.id);
      return {
        booking,
        deposit: deposit
          ? {
              ...deposit,
              amountRequired: parseFloat(deposit.amountRequired.toString()),
              amountCollected: deposit.amountCollected ? parseFloat(deposit.amountCollected.toString()) : null,
            }
          : null,
      };
    });

    return NextResponse.json({ deposits: result, tiers: tiers.map((t) => ({ ...t, minAmount: parseFloat(t.minAmount.toString()), maxAmount: parseFloat(t.maxAmount.toString()), defaultAmount: parseFloat(t.defaultAmount.toString()) })) });
  } catch (error) {
    console.error("Get renter deposits error:", error);
    return NextResponse.json({ error: "Failed to fetch deposits." }, { status: 500 });
  }
}
