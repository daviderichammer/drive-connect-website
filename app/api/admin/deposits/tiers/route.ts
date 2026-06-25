import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function getAdminAuth(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_session")?.value;
  const authHeader = request.headers.get("x-admin-auth");
  if (!adminToken && authHeader !== "admin_authenticated") return null;
  return { id: 1, name: "Admin" };
}

// POST /api/admin/deposits/tiers - Admin: update deposit tier
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { vehicleClass, minAmount, maxAmount, defaultAmount } = body;

    if (!vehicleClass || minAmount == null || maxAmount == null || defaultAmount == null) {
      return NextResponse.json({ error: "All fields required." }, { status: 400 });
    }

    const validClasses = ["economy", "suv", "luxury", "exotic"];
    if (!validClasses.includes(vehicleClass)) {
      return NextResponse.json({ error: "Invalid vehicle class." }, { status: 400 });
    }

    if (parseFloat(minAmount) > parseFloat(defaultAmount) || parseFloat(defaultAmount) > parseFloat(maxAmount)) {
      return NextResponse.json({ error: "Default must be between min and max." }, { status: 400 });
    }

    const tier = await prisma.depositTier.upsert({
      where: { vehicleClass },
      update: {
        minAmount: parseFloat(minAmount),
        maxAmount: parseFloat(maxAmount),
        defaultAmount: parseFloat(defaultAmount),
      },
      create: {
        vehicleClass,
        minAmount: parseFloat(minAmount),
        maxAmount: parseFloat(maxAmount),
        defaultAmount: parseFloat(defaultAmount),
      },
    });

    return NextResponse.json({
      success: true,
      tier: {
        ...tier,
        minAmount: parseFloat(tier.minAmount.toString()),
        maxAmount: parseFloat(tier.maxAmount.toString()),
        defaultAmount: parseFloat(tier.defaultAmount.toString()),
      },
    });
  } catch (error) {
    console.error("Update deposit tier error:", error);
    return NextResponse.json({ error: "Failed to update deposit tier." }, { status: 500 });
  }
}
