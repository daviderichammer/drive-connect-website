import { NextRequest, NextResponse } from "next/server";
import { calculateRetailPrice } from "@/lib/pricing-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sippCode, marketCode, pickupDate, dropoffDate, demandLevel } = body;

    if (!sippCode || !marketCode || !pickupDate || !dropoffDate) {
      return NextResponse.json(
        { error: "sippCode, marketCode, pickupDate, and dropoffDate are required." },
        { status: 400 }
      );
    }

    const pricing = await calculateRetailPrice({
      sippCode,
      marketCode,
      pickupDate: new Date(pickupDate),
      dropoffDate: new Date(dropoffDate),
      demandLevel: demandLevel || "normal",
    });

    return NextResponse.json({ success: true, pricing });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to calculate pricing.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { getSippCodes, getMarkets, getPricingRules } = await import("@/lib/pricing-engine");
    const [sippCodes, markets, rules] = await Promise.all([
      getSippCodes(),
      getMarkets(),
      getPricingRules(),
    ]);
    return NextResponse.json({ sippCodes, markets, rules });
  } catch (error) {
    console.error("Pricing GET error:", error);
    return NextResponse.json({ error: "Failed to fetch pricing data." }, { status: 500 });
  }
}
