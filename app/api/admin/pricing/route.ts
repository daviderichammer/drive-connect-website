import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminFromSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSippCodes, getMarkets, getPricingRules } from "@/lib/pricing-engine";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

// GET /api/admin/pricing — Get all pricing data
export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";

    if (type === "sipp") {
      const sippCodes = await prisma.sippCode.findMany({ orderBy: { code: "asc" } });
      return NextResponse.json({ success: true, sippCodes });
    }

    if (type === "markets") {
      const markets = await prisma.marketPricing.findMany({ orderBy: { marketName: "asc" } });
      return NextResponse.json({ success: true, markets });
    }

    if (type === "rules") {
      const rules = await getPricingRules();
      return NextResponse.json({ success: true, rules });
    }

    const [sippCodes, markets, rules] = await Promise.all([
      prisma.sippCode.findMany({ orderBy: { code: "asc" } }),
      prisma.marketPricing.findMany({ orderBy: { marketName: "asc" } }),
      getPricingRules(),
    ]);

    return NextResponse.json({ success: true, sippCodes, markets, rules });
  } catch (error) {
    console.error("Admin pricing GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pricing data." }, { status: 500 });
  }
}

// POST /api/admin/pricing/rules — Create or update pricing rules/SIPP/markets
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { action, type, data } = body;

    if (type === "sipp") {
      if (action === "create") {
        const sipp = await prisma.sippCode.create({ data });
        return NextResponse.json({ success: true, sipp });
      }
      if (action === "update" && data.id) {
        const { id, ...updateData } = data;
        const sipp = await prisma.sippCode.update({ where: { id }, data: updateData });
        return NextResponse.json({ success: true, sipp });
      }
      if (action === "delete" && data.id) {
        await prisma.sippCode.update({ where: { id: data.id }, data: { isActive: false } });
        return NextResponse.json({ success: true, message: "SIPP code deactivated." });
      }
    }

    if (type === "market") {
      if (action === "create") {
        const market = await prisma.marketPricing.create({ data });
        return NextResponse.json({ success: true, market });
      }
      if (action === "update" && data.id) {
        const { id, ...updateData } = data;
        const market = await prisma.marketPricing.update({ where: { id }, data: updateData });
        return NextResponse.json({ success: true, market });
      }
      if (action === "delete" && data.id) {
        await prisma.marketPricing.update({ where: { id: data.id }, data: { isActive: false } });
        return NextResponse.json({ success: true, message: "Market deactivated." });
      }
    }

    if (type === "rule") {
      if (action === "create") {
        const rule = await prisma.pricingRule.create({ data });
        return NextResponse.json({ success: true, rule });
      }
      if (action === "update" && data.id) {
        const { id, ...updateData } = data;
        const rule = await prisma.pricingRule.update({ where: { id }, data: updateData });
        return NextResponse.json({ success: true, rule });
      }
      if (action === "delete" && data.id) {
        await prisma.pricingRule.update({ where: { id: data.id }, data: { isActive: false } });
        return NextResponse.json({ success: true, message: "Pricing rule deactivated." });
      }
    }

    return NextResponse.json({ error: "Invalid action or type." }, { status: 400 });
  } catch (error) {
    console.error("Admin pricing POST error:", error);
    return NextResponse.json({ error: "Failed to update pricing data." }, { status: 500 });
  }
}
