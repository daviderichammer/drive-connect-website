import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminFromSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettlements } from "@/lib/bid-engine";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

// GET /api/admin/settlements — View all settlements
export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;

    const settlements = await getSettlements({ status });

    const formatted = settlements.map((s) => ({
      id: s.id,
      settlementReference: s.settlementReference,
      opportunityReference: s.opportunity.opportunityReference,
      sippCode: s.opportunity.sippCode.code,
      sippName: s.opportunity.sippCode.name,
      marketName: s.opportunity.market.marketName,
      pickupDate: s.opportunity.pickupDate,
      dropoffDate: s.opportunity.dropoffDate,
      rentalDays: s.opportunity.rentalDays,
      operatorId: s.operatorId,
      operatorName: s.operator.businessName,
      operatorEmail: s.operator.email,
      retailPriceTotal: Number(s.retailPriceTotal),
      winningBidTotal: Number(s.winningBidTotal),
      operatorMarginTotal: Number(s.operatorMarginTotal),
      platformRevenue: Number(s.platformRevenue),
      paymentProcessingFee: Number(s.paymentProcessingFee),
      acquisitionCost: Number(s.acquisitionCost),
      status: s.status,
      operatorNotifiedAt: s.operatorNotifiedAt,
      chargedAt: s.chargedAt,
      completedAt: s.completedAt,
      adminNotes: s.adminNotes,
      createdAt: s.createdAt,
    }));

    // Summary stats
    const totalRevenue = formatted.reduce((sum, s) => sum + s.platformRevenue, 0);
    const totalSettled = formatted.filter((s) => s.status === "completed").length;
    const totalPending = formatted.filter((s) => s.status === "pending").length;

    return NextResponse.json({
      success: true,
      settlements: formatted,
      stats: {
        total: formatted.length,
        totalPending,
        totalSettled,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Admin settlements GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settlements." }, { status: 500 });
  }
}

// POST /api/admin/settlements — Update settlement status
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { settlementId, action, adminNotes } = body;

    if (!settlementId || !action) {
      return NextResponse.json({ error: "settlementId and action are required." }, { status: 400 });
    }

    const settlement = await prisma.bidSettlement.findUnique({
      where: { id: parseInt(settlementId) },
    });

    if (!settlement) {
      return NextResponse.json({ error: "Settlement not found." }, { status: 404 });
    }

    let updateData: Record<string, unknown> = {};

    if (action === "charge") {
      updateData = {
        status: "charged",
        chargedAt: new Date(),
        adminNotes: adminNotes || settlement.adminNotes,
      };
    } else if (action === "complete") {
      updateData = {
        status: "completed",
        completedAt: new Date(),
        adminNotes: adminNotes || settlement.adminNotes,
      };
    } else if (action === "dispute") {
      updateData = {
        status: "disputed",
        adminNotes: adminNotes || settlement.adminNotes,
      };
    } else if (action === "refund") {
      updateData = {
        status: "refunded",
        adminNotes: adminNotes || settlement.adminNotes,
      };
    } else if (action === "notes") {
      updateData = { adminNotes };
    } else {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const updated = await prisma.bidSettlement.update({
      where: { id: parseInt(settlementId) },
      data: updateData,
    });

    return NextResponse.json({ success: true, settlement: updated });
  } catch (error) {
    console.error("Admin settlements POST error:", error);
    return NextResponse.json({ error: "Failed to update settlement." }, { status: 500 });
  }
}
