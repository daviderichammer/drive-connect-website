import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

// POST /api/claims/[id]/resolve - Operator marks claim resolved
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const claimId = parseInt(id);

    const claim = await prisma.depositClaim.findFirst({
      where: { id: claimId, operatorId: host.id },
    });
    if (!claim) {
      return NextResponse.json({ error: "Claim not found." }, { status: 404 });
    }

    if (claim.status === "resolved") {
      return NextResponse.json({ error: "Claim already resolved." }, { status: 400 });
    }

    const body = await request.json();
    const { resolutionNotes } = body;

    const updated = await prisma.depositClaim.update({
      where: { id: claimId },
      data: {
        status: "resolved",
        resolutionNotes: resolutionNotes || null,
        resolvedAt: new Date(),
      },
    });

    // Add resolution message to thread
    if (resolutionNotes) {
      await prisma.claimMessage.create({
        data: {
          claimId,
          senderId: host.id,
          senderRole: "operator",
          message: `Claim resolved: ${resolutionNotes}`,
          sentAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      claim: {
        ...updated,
        amount: parseFloat(updated.amount.toString()),
      },
    });
  } catch (error) {
    console.error("Resolve claim error:", error);
    return NextResponse.json({ error: "Failed to resolve claim." }, { status: 500 });
  }
}
