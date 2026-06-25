import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const [pending, approved, rejected, totalHosts, onboardingCompleted] = await Promise.all([
      prisma.partnerApplication.count({ where: { status: "pending" } }),
      prisma.partnerApplication.count({ where: { status: "approved" } }),
      prisma.partnerApplication.count({ where: { status: "rejected" } }),
      prisma.hostAccount.count(),
      prisma.hostAccount.count({ where: { onboardingCompleted: true } }),
    ]);

    return NextResponse.json({
      stats: {
        pending,
        approved,
        rejected,
        total: pending + approved + rejected,
        totalHosts,
        onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
