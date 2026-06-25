import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "all"; // upcoming, active, past, all
    const now = new Date();

    let whereClause: Record<string, unknown> = { renterEmail: renter.email };

    if (filter === "upcoming") {
      whereClause = {
        ...whereClause,
        startDate: { gt: now },
        status: { in: ["confirmed", "pending"] },
      };
    } else if (filter === "active") {
      whereClause = {
        ...whereClause,
        startDate: { lte: now },
        endDate: { gte: now },
        status: "active",
      };
    } else if (filter === "past") {
      whereClause = {
        ...whereClause,
        OR: [
          { endDate: { lt: now } },
          { status: { in: ["completed", "cancelled"] } },
        ],
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        vehicle: {
          select: {
            id: true,
            year: true,
            make: true,
            model: true,
            trim: true,
            photos: true,
            city: true,
            pickupInstructions: true,
          },
        },
        host: {
          select: {
            businessName: true,
            ownerName: true,
            phone: true,
            email: true,
          },
        },
        review: true,
      },
      orderBy: { startDate: "desc" },
    });

    const trips = bookings.map((b) => ({
      id: b.id,
      bookingReference: b.bookingReference,
      startDate: b.startDate,
      endDate: b.endDate,
      pickupTime: b.pickupTime,
      returnTime: b.returnTime,
      status: b.status,
      paymentStatus: b.paymentStatus,
      totalPrice: Number(b.totalPrice),
      basePrice: Number(b.basePrice),
      protectionPrice: Number(b.protectionPrice),
      deliveryPrice: Number(b.deliveryPrice),
      taxes: Number(b.taxes),
      protectionPlan: b.protectionPlan,
      deliveryOption: b.deliveryOption,
      deliveryAddress: b.deliveryAddress,
      vehicle: b.vehicle,
      host: b.host,
      hasReview: !!b.review,
      reviewId: b.review?.id || null,
    }));

    return NextResponse.json({ trips });
  } catch (error) {
    console.error("Get renter trips error:", error);
    return NextResponse.json({ error: "Failed to fetch trips." }, { status: 500 });
  }
}

// Cancel a trip
export async function PATCH(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { bookingId, action } = await req.json();

    if (!bookingId || action !== "cancel") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        renterEmail: renter.email,
        status: { in: ["pending", "confirmed"] },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or cannot be cancelled." }, { status: 404 });
    }

    // Check if trip is more than 24 hours away
    const hoursUntilTrip = (booking.startDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntilTrip < 24) {
      return NextResponse.json({
        error: "Trips cannot be cancelled within 24 hours of the start time. Please contact support.",
      }, { status: 400 });
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ success: true, message: "Trip cancelled successfully." });
  } catch (error) {
    console.error("Cancel trip error:", error);
    return NextResponse.json({ error: "Failed to cancel trip." }, { status: 500 });
  }
}
