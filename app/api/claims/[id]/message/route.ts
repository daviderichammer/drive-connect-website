import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost, getCurrentRenter } from "@/lib/auth";

// POST /api/claims/[id]/message - Add message to claim thread
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const claimId = parseInt(id);

    // Try host auth first, then renter
    let senderId: number;
    let senderRole: string;

    const host = await getCurrentHost();
    const renter = await getCurrentRenter();

    if (!host && !renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const claim = await prisma.depositClaim.findUnique({
      where: { id: claimId },
    });
    if (!claim) {
      return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }

    if (host && claim.operatorId === host.id) {
      senderId = host.id;
      senderRole = "operator";
    } else if (renter) {
      // Verify renter is associated with this booking
      const booking = await prisma.booking.findFirst({
        where: { id: claim.bookingId, renterEmail: renter.email },
      });
      if (!booking) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }
      senderId = renter.id;
      senderRole = "renter";
    } else {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const body = await request.json();
    const { message, attachmentUrl } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const msg = await prisma.claimMessage.create({
      data: {
        claimId,
        senderId,
        senderRole,
        message: message.trim(),
        attachmentUrl: attachmentUrl || null,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: msg }, { status: 201 });
  } catch (error) {
    console.error("Add claim message error:", error);
    return NextResponse.json({ error: "Failed to add message." }, { status: 500 });
  }
}

// GET /api/claims/[id]/message - Get claim with messages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const claimId = parseInt(id);

    const host = await getCurrentHost();
    const renter = await getCurrentRenter();

    if (!host && !renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const claim = await prisma.depositClaim.findUnique({
      where: { id: claimId },
      include: {
        messages: { orderBy: { sentAt: "asc" } },
      },
    });

    if (!claim) {
      return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }

    // Verify access
    if (host && claim.operatorId !== host.id) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    if (renter) {
      const booking = await prisma.booking.findFirst({
        where: { id: claim.bookingId, renterEmail: renter.email },
      });
      if (!booking) {
        return NextResponse.json({ error: "Access denied." }, { status: 403 });
      }
    }

    const booking = await prisma.booking.findUnique({
      where: { id: claim.bookingId },
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

    return NextResponse.json({
      claim: {
        ...claim,
        amount: parseFloat(claim.amount.toString()),
        evidenceUrls: (() => { try { return JSON.parse(claim.evidenceUrls || "[]"); } catch { return []; } })(),
        booking,
      },
    });
  } catch (error) {
    console.error("Get claim error:", error);
    return NextResponse.json({ error: "Failed to fetch claim." }, { status: 500 });
  }
}
