import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function GET() {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total bookings
    const totalBookings = await prisma.booking.count({
      where: { hostId: host.id },
    });

    // Revenue this month
    const monthlyRevenue = await prisma.booking.aggregate({
      where: {
        hostId: host.id,
        status: { notIn: ["cancelled"] },
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalPrice: true },
    });

    // Revenue last month (for comparison)
    const lastMonthRevenue = await prisma.booking.aggregate({
      where: {
        hostId: host.id,
        status: { notIn: ["cancelled"] },
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { totalPrice: true },
    });

    // Active vehicles
    const activeVehicles = await prisma.vehicle.count({
      where: { hostId: host.id, status: "active" },
    });

    // Total vehicles
    const totalVehicles = await prisma.vehicle.count({
      where: { hostId: host.id },
    });

    // Average rating across all vehicles
    const vehicleRatings = await prisma.vehicle.aggregate({
      where: { hostId: host.id, rating: { gt: 0 } },
      _avg: { rating: true },
    });

    // Upcoming bookings (next 7 days)
    const next7Days = new Date();
    next7Days.setDate(next7Days.getDate() + 7);
    const upcomingBookings = await prisma.booking.count({
      where: {
        hostId: host.id,
        status: { in: ["confirmed", "pending"] },
        startDate: { gte: now, lte: next7Days },
      },
    });

    // Active bookings right now
    const activeBookings = await prisma.booking.count({
      where: {
        hostId: host.id,
        status: "active",
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    // Pending bookings
    const pendingBookings = await prisma.booking.count({
      where: {
        hostId: host.id,
        status: "pending",
      },
    });

    // Recent bookings
    const recentBookings = await prisma.booking.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        vehicle: {
          select: { year: true, make: true, model: true },
        },
      },
    });

    // Pending payout amount
    const pendingPayout = await prisma.booking.aggregate({
      where: {
        hostId: host.id,
        status: { in: ["confirmed", "active", "completed"] },
        paymentStatus: "pending",
      },
      _sum: { totalPrice: true },
    });

    const currentRevenue = parseFloat(monthlyRevenue._sum.totalPrice?.toString() || "0");
    const prevRevenue = parseFloat(lastMonthRevenue._sum.totalPrice?.toString() || "0");
    const revenueChange = prevRevenue > 0
      ? Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100)
      : 0;

    return NextResponse.json({
      totalBookings,
      monthlyRevenue: currentRevenue,
      revenueChange,
      activeVehicles,
      totalVehicles,
      averageRating: vehicleRatings._avg.rating
        ? parseFloat(vehicleRatings._avg.rating.toString()).toFixed(1)
        : "0.0",
      upcomingBookings,
      activeBookings,
      pendingBookings,
      pendingPayout: parseFloat(pendingPayout._sum.totalPrice?.toString() || "0"),
      recentBookings: recentBookings.map((b) => ({
        ...b,
        basePrice: parseFloat(b.basePrice.toString()),
        totalPrice: parseFloat(b.totalPrice.toString()),
        protectionPrice: parseFloat(b.protectionPrice.toString()),
        deliveryPrice: parseFloat(b.deliveryPrice.toString()),
        taxes: parseFloat(b.taxes.toString()),
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
