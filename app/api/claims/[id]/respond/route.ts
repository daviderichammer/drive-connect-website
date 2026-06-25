import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";

// POST /api/claims/[id]/respond - Renter responds to claim
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const claimId = parseInt(id);

    const claim = await prisma.depositClaim.findUnique({
      where: { id: claimId },
    });
    if (!claim) {
      return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }

    // Verify renter is associated with this booking
    const booking = await prisma.booking.findFirst({
      where: { id: claim.bookingId, renterEmail: renter.email },
    });
    if (!booking) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const body = await request.json();
    const { response, message } = body; // response: 'acknowledge' | 'dispute'

    if (!response || !["acknowledge", "dispute"].includes(response)) {
      return NextResponse.json({ error: "response must be 'acknowledge' or 'dispute'." }, { status: 400 });
    }

    const newStatus = response === "acknowledge" ? "acknowledged" : "disputed";

    await prisma.depositClaim.update({
      where: { id: claimId },
      data: { status: newStatus },
    });

    if (message) {
      await prisma.claimMessage.create({
        data: {
          claimId,
          senderId: renter.id,
          senderRole: "renter",
          message,
          sentAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("Respond to claim error:", error);
    return NextResponse.json({ error: "Failed to respond to claim." }, { status: 500 });
  }
}
