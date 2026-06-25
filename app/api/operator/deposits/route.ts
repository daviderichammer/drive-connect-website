import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

// GET /api/operator/deposits - Operator views deposit history
export async function GET() {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const deposits = await prisma.depositRecord.findMany({
      where: { operatorId: host.id },
      orderBy: { createdAt: "desc" },
    });

    // Enrich with booking data
    const enriched = await Promise.all(
      deposits.map(async (d) => {
        const booking = await prisma.booking.findUnique({
          where: { id: d.bookingId },
          select: {
            bookingReference: true,
            renterFirstName: true,
            renterLastName: true,
            renterEmail: true,
            startDate: true,
            endDate: true,
            vehicle: { select: { year: true, make: true, model: true } },
          },
        });
        return {
          ...d,
          amountRequired: parseFloat(d.amountRequired.toString()),
          amountCollected: d.amountCollected ? parseFloat(d.amountCollected.toString()) : null,
          booking,
        };
      })
    );

    return NextResponse.json({ deposits: enriched });
  } catch (error) {
    console.error("Get operator deposits error:", error);
    return NextResponse.json({ error: "Failed to fetch deposits." }, { status: 500 });
  }
}
