import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";
import crypto from "crypto";

function generateClaimReference(): string {
  return "CLM-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function GET() {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const claims = await prisma.claim.findMany({
      where: { hostId: host.id },
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          select: {
            bookingReference: true,
            renterFirstName: true,
            renterLastName: true,
            renterEmail: true,
          },
        },
        vehicle: {
          select: { year: true, make: true, model: true },
        },
      },
    });

    return NextResponse.json({
      claims: claims.map((c) => ({
        ...c,
        estimatedCost: c.estimatedCost ? parseFloat(c.estimatedCost.toString()) : null,
        photos: (() => {
          try { return JSON.parse(c.photos || "[]"); } catch { return []; }
        })(),
      })),
    });
  } catch (error) {
    console.error("Get claims error:", error);
    return NextResponse.json({ error: "Failed to fetch claims." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, description, estimatedCost, photos } = body;

    if (!bookingId || !description) {
      return NextResponse.json({ error: "Booking ID and description required." }, { status: 400 });
    }

    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), hostId: host.id },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const claimReference = generateClaimReference();

    const claim = await prisma.claim.create({
      data: {
        claimReference,
        bookingId: parseInt(bookingId),
        hostId: host.id,
        vehicleId: booking.vehicleId,
        description,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
        photos: photos ? JSON.stringify(photos) : null,
        status: "open",
      },
    });

    return NextResponse.json({ success: true, claim }, { status: 201 });
  } catch (error) {
    console.error("Create claim error:", error);
    return NextResponse.json({ error: "Failed to create claim." }, { status: 500 });
  }
}
