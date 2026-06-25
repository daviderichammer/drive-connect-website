import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "monthly"; // daily, weekly, monthly

    const now = new Date();
    let startDate: Date;

    if (period === "daily") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 30);
    } else if (period === "weekly") {
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 84); // 12 weeks
    } else {
      startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    // Get all non-cancelled bookings in the period
    const bookings = await prisma.booking.findMany({
      where: {
        hostId: host.id,
        status: { notIn: ["cancelled"] },
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "asc" },
      include: {
        vehicle: { select: { id: true, year: true, make: true, model: true } },
      },
    });

    // Build chart data
    const chartData: Record<string, number> = {};

    bookings.forEach((b) => {
      const date = new Date(b.createdAt);
      let key: string;

      if (period === "daily") {
        key = date.toISOString().split("T")[0];
      } else if (period === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      chartData[key] = (chartData[key] || 0) + parseFloat(b.totalPrice.toString());
    });

    const chartArray = Object.entries(chartData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }));

    // Revenue by vehicle
    const vehicleRevenue: Record<number, { vehicle: string; revenue: number; bookings: number }> = {};
    bookings.forEach((b) => {
      const vid = b.vehicleId;
      if (!vehicleRevenue[vid]) {
        vehicleRevenue[vid] = {
          vehicle: `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`,
          revenue: 0,
          bookings: 0,
        };
      }
      vehicleRevenue[vid].revenue += parseFloat(b.totalPrice.toString());
      vehicleRevenue[vid].bookings += 1;
    });

    const vehicleBreakdown = Object.entries(vehicleRevenue)
      .map(([id, data]) => ({ vehicleId: parseInt(id), ...data, revenue: Math.round(data.revenue * 100) / 100 }))
      .sort((a, b) => b.revenue - a.revenue);

    // Transaction history (payout table)
    const allBookings = await prisma.booking.findMany({
      where: {
        hostId: host.id,
        status: { notIn: ["cancelled"] },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        vehicle: { select: { year: true, make: true, model: true } },
      },
    });

    const PLATFORM_FEE_RATE = 0.15; // 15% platform fee

    const transactions = allBookings.map((b) => {
      const total = parseFloat(b.totalPrice.toString());
      const platformFee = Math.round(total * PLATFORM_FEE_RATE * 100) / 100;
      const operatorNet = Math.round((total - platformFee) * 100) / 100;

      return {
        id: b.id,
        bookingReference: b.bookingReference,
        vehicle: `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`,
        renterName: `${b.renterFirstName} ${b.renterLastName}`,
        startDate: b.startDate,
        endDate: b.endDate,
        totalRevenue: total,
        platformFee,
        operatorNet,
        status: b.status,
        paymentStatus: b.paymentStatus,
        payoutStatus: (b as Record<string, unknown>).payoutStatus || "pending",
        createdAt: b.createdAt,
      };
    });

    // Summary totals
    const totalRevenue = allBookings.reduce(
      (sum, b) => sum + parseFloat(b.totalPrice.toString()),
      0
    );
    const totalPlatformFees = Math.round(totalRevenue * PLATFORM_FEE_RATE * 100) / 100;
    const totalOperatorNet = Math.round((totalRevenue - totalPlatformFees) * 100) / 100;

    const pendingPayout = allBookings
      .filter((b) => {
        const ps = (b as Record<string, unknown>).payoutStatus;
        return ps === "pending" && b.status === "completed";
      })
      .reduce((sum, b) => {
        const total = parseFloat(b.totalPrice.toString());
        return sum + (total - total * PLATFORM_FEE_RATE);
      }, 0);

    return NextResponse.json({
      chartData: chartArray,
      vehicleBreakdown,
      transactions,
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalPlatformFees,
        totalOperatorNet,
        pendingPayout: Math.round(pendingPayout * 100) / 100,
        totalBookings: allBookings.length,
      },
    });
  } catch (error) {
    console.error("Earnings error:", error);
    return NextResponse.json({ error: "Failed to fetch earnings." }, { status: 500 });
  }
}
