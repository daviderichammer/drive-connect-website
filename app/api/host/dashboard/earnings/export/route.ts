import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function GET() {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: {
        hostId: host.id,
        status: { notIn: ["cancelled"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: { select: { year: true, make: true, model: true } },
      },
    });

    const PLATFORM_FEE_RATE = 0.15;

    const rows = [
      [
        "Booking Reference",
        "Vehicle",
        "Renter Name",
        "Start Date",
        "End Date",
        "Base Price",
        "Protection",
        "Delivery",
        "Taxes",
        "Total Revenue",
        "Platform Fee (15%)",
        "Operator Net",
        "Status",
        "Payment Status",
        "Created At",
      ].join(","),
      ...bookings.map((b) => {
        const total = parseFloat(b.totalPrice.toString());
        const platformFee = (total * PLATFORM_FEE_RATE).toFixed(2);
        const operatorNet = (total - total * PLATFORM_FEE_RATE).toFixed(2);

        return [
          b.bookingReference,
          `"${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}"`,
          `"${b.renterFirstName} ${b.renterLastName}"`,
          b.startDate.toISOString().split("T")[0],
          b.endDate.toISOString().split("T")[0],
          parseFloat(b.basePrice.toString()).toFixed(2),
          parseFloat(b.protectionPrice.toString()).toFixed(2),
          parseFloat(b.deliveryPrice.toString()).toFixed(2),
          parseFloat(b.taxes.toString()).toFixed(2),
          total.toFixed(2),
          platformFee,
          operatorNet,
          b.status,
          b.paymentStatus,
          b.createdAt.toISOString().split("T")[0],
        ].join(",");
      }),
    ].join("\n");

    return new NextResponse(rows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="earnings-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to export." }, { status: 500 });
  }
}
