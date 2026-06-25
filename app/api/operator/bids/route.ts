import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getHostFromSession, SESSION_COOKIE } from "@/lib/auth";
import { getOperatorBids } from "@/lib/bid-engine";

async function requireOperator() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getHostFromSession(token);
}

export async function GET(req: NextRequest) {
  try {
    const operator = await requireOperator();
    if (!operator) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const bids = await getOperatorBids(operator.id);

    const formatted = bids.map((bid) => ({
      id: bid.id,
      opportunityId: bid.opportunityId,
      opportunityReference: bid.opportunity.opportunityReference,
      sippCode: bid.opportunity.sippCode.code,
      sippName: bid.opportunity.sippCode.name,
      marketName: bid.opportunity.market.marketName,
      pickupLocation: bid.opportunity.pickupLocation,
      pickupDate: bid.opportunity.pickupDate,
      dropoffDate: bid.opportunity.dropoffDate,
      rentalDays: bid.opportunity.rentalDays,
      retailPricePerDay: Number(bid.opportunity.retailPricePerDay),
      retailPriceTotal: Number(bid.opportunity.retailPriceTotal),
      bidPerDay: Number(bid.bidPerDay),
      bidTotal: Number(bid.bidTotal),
      estimatedMarginPerDay: Number(bid.estimatedMarginPerDay),
      estimatedMarginTotal: Number(bid.estimatedMarginTotal),
      status: bid.status,
      opportunityStatus: bid.opportunity.status,
      biddingClosesAt: bid.opportunity.biddingClosesAt,
      submittedAt: bid.submittedAt,
      withdrawnAt: bid.withdrawnAt,
      notes: bid.notes,
    }));

    return NextResponse.json({ success: true, bids: formatted });
  } catch (error) {
    console.error("Get operator bids error:", error);
    return NextResponse.json({ error: "Failed to fetch bids." }, { status: 500 });
  }
}
