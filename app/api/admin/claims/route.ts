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

// GET /api/admin/claims - Admin views all claims (monitoring only)
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const claimType = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status && status !== "all") where.status = status;
    if (claimType && claimType !== "all") where.claimType = claimType;

    const [claims, total] = await Promise.all([
      prisma.depositClaim.findMany({
        where,
        orderBy: { filedAt: "desc" },
        skip,
        take: limit,
        include: {
          messages: { orderBy: { sentAt: "asc" } },
        },
      }),
      prisma.depositClaim.count({ where }),
    ]);

    const enriched = await Promise.all(
      claims.map(async (c) => {
        const booking = await prisma.booking.findUnique({
          where: { id: c.bookingId },
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
          where: { id: c.operatorId },
          select: { businessName: true, ownerName: true, email: true },
        });
        return {
          ...c,
          amount: parseFloat(c.amount.toString()),
          evidenceUrls: (() => { try { return JSON.parse(c.evidenceUrls || "[]"); } catch { return []; } })(),
          booking,
          operator,
        };
      })
    );

    // Summary stats
    const stats = await prisma.depositClaim.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { amount: true },
    });

    const typeStats = await prisma.depositClaim.groupBy({
      by: ["claimType"],
      _count: { id: true },
      _sum: { amount: true },
      orderBy: { _count: { id: "desc" } },
    });

    return NextResponse.json({
      claims: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      stats: stats.map((s) => ({
        status: s.status,
        count: s._count.id,
        totalAmount: s._sum.amount ? parseFloat(s._sum.amount.toString()) : 0,
      })),
      typeStats: typeStats.map((s) => ({
        claimType: s.claimType,
        count: s._count.id,
        totalAmount: s._sum.amount ? parseFloat(s._sum.amount.toString()) : 0,
      })),
    });
  } catch (error) {
    console.error("Admin get claims error:", error);
    return NextResponse.json({ error: "Failed to fetch claims." }, { status: 500 });
  }
}
