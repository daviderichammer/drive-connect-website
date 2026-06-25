import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

// POST /api/operator/deposits/return - Operator marks deposit returned
export async function POST(request: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { depositId, amountReturned, notes } = body;

    if (!depositId) {
      return NextResponse.json({ error: "depositId is required." }, { status: 400 });
    }

    const deposit = await prisma.depositRecord.findFirst({
      where: { id: parseInt(depositId), operatorId: host.id },
    });

    if (!deposit) {
      return NextResponse.json({ error: "Deposit record not found." }, { status: 404 });
    }

    if (deposit.status === "returned") {
      return NextResponse.json({ error: "Deposit already marked as returned." }, { status: 400 });
    }

    const collected = deposit.amountCollected ? parseFloat(deposit.amountCollected.toString()) : 0;
    const returned = amountReturned != null ? parseFloat(amountReturned) : collected;
    const isPartial = returned < collected;

    const updated = await prisma.depositRecord.update({
      where: { id: parseInt(depositId) },
      data: {
        status: isPartial ? "partial_return" : "returned",
        returnedAt: new Date(),
        notes: notes || deposit.notes,
      },
    });

    return NextResponse.json({
      success: true,
      deposit: {
        ...updated,
        amountRequired: parseFloat(updated.amountRequired.toString()),
        amountCollected: updated.amountCollected ? parseFloat(updated.amountCollected.toString()) : null,
      },
    });
  } catch (error) {
    console.error("Return deposit error:", error);
    return NextResponse.json({ error: "Failed to mark deposit returned." }, { status: 500 });
  }
}
