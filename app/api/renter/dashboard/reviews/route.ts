import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const reviews = await prisma.review.findMany({
      where: { renterId: renter.id },
      include: {
        vehicle: { select: { year: true, make: true, model: true, photos: true } },
        booking: { select: { bookingReference: true, startDate: true, endDate: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { bookingId, rating, text } = await req.json();

    if (!bookingId || !rating) {
      return NextResponse.json({ error: "Booking ID and rating are required." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    // Verify booking belongs to renter and is completed
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        renterEmail: renter.email,
        status: "completed",
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found or not eligible for review." }, { status: 404 });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this trip." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        renterId: renter.id,
        bookingId,
        vehicleId: booking.vehicleId,
        rating,
        text: text?.trim() || null,
      },
    });

    // Update vehicle rating
    const allReviews = await prisma.review.findMany({
      where: { vehicleId: booking.vehicleId },
      select: { rating: true },
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.vehicle.update({
      where: { id: booking.vehicleId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    });

    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }
}
