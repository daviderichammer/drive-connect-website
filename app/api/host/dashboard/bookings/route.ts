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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { hostId: host.id };

    if (status && status !== "all") {
      if (status === "upcoming") {
        where.status = { in: ["confirmed", "pending"] };
        where.startDate = { gte: new Date() };
      } else if (status === "active") {
        where.status = "active";
      } else if (status === "completed") {
        where.status = "completed";
      } else if (status === "cancelled") {
        where.status = "cancelled";
      } else if (status === "pending") {
        where.status = "pending";
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          vehicle: {
            select: {
              id: true,
              year: true,
              make: true,
              model: true,
              trim: true,
              photos: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        ...b,
        basePrice: parseFloat(b.basePrice.toString()),
        protectionPrice: parseFloat(b.protectionPrice.toString()),
        deliveryPrice: parseFloat(b.deliveryPrice.toString()),
        taxes: parseFloat(b.taxes.toString()),
        totalPrice: parseFloat(b.totalPrice.toString()),
        vehicle: {
          ...b.vehicle,
          photos: (() => {
            try { return JSON.parse(b.vehicle.photos || "[]"); } catch { return []; }
          })(),
        },
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
  }
}
