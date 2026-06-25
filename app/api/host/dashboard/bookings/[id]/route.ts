import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(id), hostId: host.id },
      include: {
        vehicle: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({
      booking: {
        ...booking,
        basePrice: parseFloat(booking.basePrice.toString()),
        protectionPrice: parseFloat(booking.protectionPrice.toString()),
        deliveryPrice: parseFloat(booking.deliveryPrice.toString()),
        taxes: parseFloat(booking.taxes.toString()),
        totalPrice: parseFloat(booking.totalPrice.toString()),
        vehicle: {
          ...booking.vehicle,
          dailyRate: parseFloat(booking.vehicle.dailyRate.toString()),
          photos: (() => {
            try { return JSON.parse(booking.vehicle.photos || "[]"); } catch { return []; }
          })(),
        },
      },
    });
  } catch (error) {
    console.error("Get booking error:", error);
    return NextResponse.json({ error: "Failed to fetch booking." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(id), hostId: host.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const body = await req.json();
    const { action } = body;

    let newStatus = booking.status;

    switch (action) {
      case "confirm":
        if (booking.status === "pending") newStatus = "confirmed";
        break;
      case "activate":
        if (booking.status === "confirmed") newStatus = "active";
        break;
      case "complete":
        if (booking.status === "active") newStatus = "completed";
        break;
      case "cancel":
        if (["pending", "confirmed"].includes(booking.status)) newStatus = "cancelled";
        break;
      default:
        return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: newStatus },
    });

    return NextResponse.json({
      success: true,
      booking: {
        ...updated,
        basePrice: parseFloat(updated.basePrice.toString()),
        totalPrice: parseFloat(updated.totalPrice.toString()),
        protectionPrice: parseFloat(updated.protectionPrice.toString()),
        deliveryPrice: parseFloat(updated.deliveryPrice.toString()),
        taxes: parseFloat(updated.taxes.toString()),
      },
    });
  } catch (error) {
    console.error("Update booking error:", error);
    return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
  }
}
