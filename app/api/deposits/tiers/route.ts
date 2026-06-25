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

// GET /api/deposits/tiers - Public: get all deposit tiers
export async function GET() {
  try {
    const tiers = await prisma.depositTier.findMany({
      orderBy: { vehicleClass: "asc" },
    });
    return NextResponse.json({
      tiers: tiers.map((t) => ({
        ...t,
        minAmount: parseFloat(t.minAmount.toString()),
        maxAmount: parseFloat(t.maxAmount.toString()),
        defaultAmount: parseFloat(t.defaultAmount.toString()),
      })),
    });
  } catch (error) {
    console.error("Get deposit tiers error:", error);
    return NextResponse.json({ error: "Failed to fetch deposit tiers." }, { status: 500 });
  }
}
