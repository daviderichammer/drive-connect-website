import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const now = new Date();

    // Get upcoming trips
    const upcomingTrips = await prisma.booking.findMany({
      where: {
        renterEmail: renter.email,
        startDate: { gt: now },
        status: { in: ["confirmed", "pending"] },
      },
      include: {
        vehicle: { select: { year: true, make: true, model: true, photos: true, city: true } },
        host: { select: { businessName: true, ownerName: true, phone: true } },
      },
      orderBy: { startDate: "asc" },
      take: 3,
    });

    // Get active trips
    const activeTrips = await prisma.booking.findMany({
      where: {
        renterEmail: renter.email,
        startDate: { lte: now },
        endDate: { gte: now },
        status: "active",
      },
      include: {
        vehicle: { select: { year: true, make: true, model: true, photos: true, city: true } },
        host: { select: { businessName: true, ownerName: true, phone: true } },
      },
    });

    // Get total trips count
    const totalTrips = await prisma.booking.count({
      where: {
        renterEmail: renter.email,
        status: { in: ["completed", "active"] },
      },
    });

    // Get unread messages count
    const unreadMessages = await prisma.message.count({
      where: {
        renterEmail: renter.email,
        senderType: "host",
        isRead: false,
      },
    });

    // Get favorites count
    const favoritesCount = await prisma.favorite.count({
      where: { renterId: renter.id },
    });

    // Get pending reviews (completed trips without reviews)
    const completedBookings = await prisma.booking.findMany({
      where: {
        renterEmail: renter.email,
        status: "completed",
      },
      select: { id: true },
    });

    const reviewedBookingIds = await prisma.review.findMany({
      where: { renterId: renter.id },
      select: { bookingId: true },
    });

    const reviewedIds = new Set(reviewedBookingIds.map((r) => r.bookingId));
    const pendingReviews = completedBookings.filter((b) => !reviewedIds.has(b.id)).length;

    return NextResponse.json({
      upcomingTrips: upcomingTrips.map((b) => ({
        id: b.id,
        bookingReference: b.bookingReference,
        startDate: b.startDate,
        endDate: b.endDate,
        pickupTime: b.pickupTime,
        status: b.status,
        totalPrice: b.totalPrice,
        vehicle: b.vehicle,
        host: b.host,
      })),
      activeTrips: activeTrips.map((b) => ({
        id: b.id,
        bookingReference: b.bookingReference,
        startDate: b.startDate,
        endDate: b.endDate,
        returnTime: b.returnTime,
        status: b.status,
        vehicle: b.vehicle,
        host: b.host,
        pickupInstructions: b.deliveryAddress,
        deliveryOption: b.deliveryOption,
      })),
      stats: {
        totalTrips,
        unreadMessages,
        favoritesCount,
        pendingReviews,
      },
    });
  } catch (error) {
    console.error("Renter dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data." }, { status: 500 });
  }
}
