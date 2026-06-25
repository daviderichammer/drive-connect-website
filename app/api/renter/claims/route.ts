import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

// GET /api/renter/claims - Renter views claims against them
export async function GET() {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Find all bookings for this renter
    const bookings = await prisma.booking.findMany({
      where: { renterEmail: renter.email },
      select: { id: true },
    });
    const bookingIds = bookings.map((b) => b.id);

    const claims = await prisma.depositClaim.findMany({
      where: { bookingId: { in: bookingIds } },
      orderBy: { filedAt: "desc" },
      include: {
        messages: {
          orderBy: { sentAt: "asc" },
        },
      },
    });

    const enriched = await Promise.all(
      claims.map(async (c) => {
        const booking = await prisma.booking.findUnique({
          where: { id: c.bookingId },
          select: {
            bookingReference: true,
            startDate: true,
            endDate: true,
            vehicle: { select: { year: true, make: true, model: true } },
          },
        });
        const operator = await prisma.hostAccount.findUnique({
          where: { id: c.operatorId },
          select: { businessName: true, ownerName: true },
        });
        return {
          ...c,
          amount: parseFloat(c.amount.toString()),
          evidenceUrls: (() => { try { return JSON.parse(c.evidenceUrls || "[]"); } catch { return []; } })(),
          booking,
          operator,
        };
      })
    );

    return NextResponse.json({ claims: enriched });
  } catch (error) {
    console.error("Get renter claims error:", error);
    return NextResponse.json({ error: "Failed to fetch claims." }, { status: 500 });
  }
}
