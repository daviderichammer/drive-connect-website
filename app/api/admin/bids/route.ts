import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminFromSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllBidsForOpportunity, acceptWinningBid, autoAcceptLowestBid } from "@/lib/bid-engine";
import { calculateRetailPrice } from "@/lib/pricing-engine";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

// GET /api/admin/bids — View all bids for a booking, or list all opportunities
export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get("opportunityId");
    const status = searchParams.get("status") || "all";

    if (opportunityId) {
      const bids = await getAllBidsForOpportunity(parseInt(opportunityId));
      const opportunity = await prisma.bookingOpportunity.findUnique({
        where: { id: parseInt(opportunityId) },
        include: {
          sippCode: true,
          market: true,
          settlement: true,
        },
      });
      return NextResponse.json({ success: true, opportunity, bids });
    }

    // List all opportunities with bid counts
    const where = status !== "all" ? { status } : {};
    const opportunities = await prisma.bookingOpportunity.findMany({
      where,
      include: {
        sippCode: { select: { code: true, name: true } },
        market: { select: { marketName: true } },
        _count: { select: { bids: true } },
        settlement: { select: { id: true, status: true, winningBidTotal: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, opportunities });
  } catch (error) {
    console.error("Admin bids GET error:", error);
    return NextResponse.json({ error: "Failed to fetch bids." }, { status: 500 });
  }
}

// POST /api/admin/bids/accept — Accept winning bid or create opportunity
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "accept") {
      const { opportunityId, bidId } = body;
      if (!opportunityId || !bidId) {
        return NextResponse.json({ error: "opportunityId and bidId are required." }, { status: 400 });
      }
      const result = await acceptWinningBid(parseInt(opportunityId), parseInt(bidId));
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, settlementId: result.settlementId });
    }

    if (action === "auto_accept") {
      const { opportunityId } = body;
      if (!opportunityId) {
        return NextResponse.json({ error: "opportunityId is required." }, { status: 400 });
      }
      const result = await autoAcceptLowestBid(parseInt(opportunityId));
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "Lowest bid accepted." });
    }

    if (action === "create_opportunity") {
      const { sippCode, marketCode, pickupDate, dropoffDate, pickupLocation, dropoffLocation, renterName, renterEmail, biddingWindowHours, demandLevel } = body;

      if (!sippCode || !marketCode || !pickupDate || !dropoffDate || !pickupLocation) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
      }

      const pricing = await calculateRetailPrice({
        sippCode,
        marketCode,
        pickupDate: new Date(pickupDate),
        dropoffDate: new Date(dropoffDate),
        demandLevel: demandLevel || "normal",
      });

      const sipp = await prisma.sippCode.findUnique({ where: { code: sippCode } });
      const market = await prisma.marketPricing.findUnique({ where: { marketCode } });

      if (!sipp || !market) {
        return NextResponse.json({ error: "Invalid SIPP code or market." }, { status: 400 });
      }

      const windowHours = biddingWindowHours || 4;
      const closesAt = new Date(Date.now() + windowHours * 60 * 60 * 1000);

      const { generateOpportunityReference } = await import("@/lib/bid-engine");
      const opportunity = await prisma.bookingOpportunity.create({
        data: {
          opportunityReference: generateOpportunityReference(),
          sippCodeId: sipp.id,
          marketId: market.id,
          pickupLocation,
          dropoffLocation: dropoffLocation || pickupLocation,
          pickupDate: new Date(pickupDate),
          dropoffDate: new Date(dropoffDate),
          rentalDays: pricing.rentalDays,
          renterName: renterName || null,
          renterEmail: renterEmail || null,
          retailPricePerDay: pricing.finalRatePerDay,
          retailPriceTotal: pricing.retailPriceTotal,
          minimumBidPerDay: pricing.minimumBidPerDay,
          minimumBidTotal: pricing.minimumBidTotal,
          biddingWindowHours: windowHours,
          biddingClosesAt: closesAt,
          status: "open",
          autoAcceptLowest: true,
          priceBreakdown: JSON.stringify(pricing),
        },
      });

      return NextResponse.json({ success: true, opportunity });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Admin bids POST error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
