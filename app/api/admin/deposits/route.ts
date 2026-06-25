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

// GET /api/admin/deposits - Admin overview of all deposits
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;

    const [deposits, total] = await Promise.all([
      prisma.depositRecord.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.depositRecord.count({ where }),
    ]);

    const enriched = await Promise.all(
      deposits.map(async (d) => {
        const booking = await prisma.booking.findUnique({
          where: { id: d.bookingId },
          select: {
            bookingReference: true,
            renterFirstName: true,
            renterLastName: true,
            renterEmail: true,
            startDate: true,
            endDate: true,
            vehicle: { select: { year: true, make: true, model: true } },
          },
        });
        const operator = await prisma.hostAccount.findUnique({
          where: { id: d.operatorId },
          select: { businessName: true, ownerName: true },
        });
        return {
          ...d,
          amountRequired: parseFloat(d.amountRequired.toString()),
          amountCollected: d.amountCollected ? parseFloat(d.amountCollected.toString()) : null,
          booking,
          operator,
        };
      })
    );

    // Summary stats
    const stats = await prisma.depositRecord.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { amountCollected: true },
    });

    const tiers = await prisma.depositTier.findMany({
      orderBy: { vehicleClass: "asc" },
    });

    return NextResponse.json({
      deposits: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats: stats.map((s) => ({
        status: s.status,
        count: s._count.id,
        totalCollected: s._sum.amountCollected ? parseFloat(s._sum.amountCollected.toString()) : 0,
      })),
      tiers: tiers.map((t) => ({
        ...t,
        minAmount: parseFloat(t.minAmount.toString()),
        maxAmount: parseFloat(t.maxAmount.toString()),
        defaultAmount: parseFloat(t.defaultAmount.toString()),
      })),
    });
  } catch (error) {
    console.error("Admin get deposits error:", error);
    return NextResponse.json({ error: "Failed to fetch deposits." }, { status: 500 });
  }
}
