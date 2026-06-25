import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getHostFromSession, SESSION_COOKIE } from "@/lib/auth";
import { submitBid, withdrawBid } from "@/lib/bid-engine";

async function requireOperator() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getHostFromSession(token);
}

// POST /api/operator/bid — Submit a bid
export async function POST(req: NextRequest) {
  try {
    const operator = await requireOperator();
    if (!operator) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const { opportunityId, bidPerDay, notes } = body;

    if (!opportunityId || !bidPerDay) {
      return NextResponse.json(
        { error: "opportunityId and bidPerDay are required." },
        { status: 400 }
      );
    }

    const bidAmount = parseFloat(bidPerDay);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      return NextResponse.json({ error: "Invalid bid amount." }, { status: 400 });
    }

    const result = await submitBid({
      opportunityId: parseInt(opportunityId),
      operatorId: operator.id,
      bidPerDay: bidAmount,
      notes,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, bid: result.bid });
  } catch (error) {
    console.error("Submit bid error:", error);
    return NextResponse.json({ error: "Failed to submit bid." }, { status: 500 });
  }
}

// DELETE /api/operator/bid — Withdraw a bid
export async function DELETE(req: NextRequest) {
  try {
    const operator = await requireOperator();
    if (!operator) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bidId = searchParams.get("bidId");

    if (!bidId) {
      return NextResponse.json({ error: "bidId is required." }, { status: 400 });
    }

    const result = await withdrawBid(parseInt(bidId), operator.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Bid withdrawn successfully." });
  } catch (error) {
    console.error("Withdraw bid error:", error);
    return NextResponse.json({ error: "Failed to withdraw bid." }, { status: 500 });
  }
}
