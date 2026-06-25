import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";
import crypto from "crypto";

function generateClaimRef(): string {
  return "CLM-" + crypto.randomBytes(4).toString("hex").toUpperCase();
}

const VALID_CLAIM_TYPES = [
  "smoking", "tire", "interior", "exterior", "fuel",
  "cleaning", "missing_accessory", "late_return",
];

// GET /api/operator/claims - Operator views their claims
export async function GET() {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const claims = await prisma.depositClaim.findMany({
      where: { operatorId: host.id },
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
            renterFirstName: true,
            renterLastName: true,
            renterEmail: true,
            startDate: true,
            endDate: true,
            vehicle: { select: { year: true, make: true, model: true } },
          },
        });
        return {
          ...c,
          amount: parseFloat(c.amount.toString()),
          evidenceUrls: (() => { try { return JSON.parse(c.evidenceUrls || "[]"); } catch { return []; } })(),
          booking,
        };
      })
    );

    return NextResponse.json({ claims: enriched });
  } catch (error) {
    console.error("Get operator claims error:", error);
    return NextResponse.json({ error: "Failed to fetch claims." }, { status: 500 });
  }
}

// POST /api/operator/claims - Operator files a new claim
export async function POST(request: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, claimType, amount, description, evidenceUrls } = body;

    if (!bookingId || !claimType || amount == null || !description) {
      return NextResponse.json({ error: "bookingId, claimType, amount, and description are required." }, { status: 400 });
    }

    if (!VALID_CLAIM_TYPES.includes(claimType)) {
      return NextResponse.json({ error: "Invalid claim type." }, { status: 400 });
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: "Amount must be greater than 0." }, { status: 400 });
    }

    // Verify booking belongs to this operator
    const booking = await prisma.booking.findFirst({
      where: { id: parseInt(bookingId), hostId: host.id },
      select: { id: true, renterEmail: true },
    });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    const claimReference = generateClaimRef();
    const claim = await prisma.depositClaim.create({
      data: {
        claimReference,
        bookingId: parseInt(bookingId),
        operatorId: host.id,
        renterId: 0,
        claimType,
        amount: parseFloat(amount),
        description,
        evidenceUrls: evidenceUrls ? JSON.stringify(evidenceUrls) : "[]",
        status: "filed",
        filedAt: new Date(),
      },
    });

    // Auto-add initial message from operator
    await prisma.claimMessage.create({
      data: {
        claimId: claim.id,
        senderId: host.id,
        senderRole: "operator",
        message: `Claim filed: ${description}`,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, claim: { ...claim, amount: parseFloat(claim.amount.toString()) } }, { status: 201 });
  } catch (error) {
    console.error("File claim error:", error);
    return NextResponse.json({ error: "Failed to file claim." }, { status: 500 });
  }
}
