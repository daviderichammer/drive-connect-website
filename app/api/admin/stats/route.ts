import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const [pending, approved, rejected, totalHosts, onboardingComplete] = await Promise.all([
    prisma.partnerApplication.count({ where: { status: "pending" } }),
    prisma.partnerApplication.count({ where: { status: "approved" } }),
    prisma.partnerApplication.count({ where: { status: "rejected" } }),
    prisma.hostAccount.count(),
    prisma.hostAccount.count({ where: { onboardingComplete: true } }),
  ]);

  return NextResponse.json({
    stats: {
      pending,
      approved,
      rejected,
      total: pending + approved + rejected,
      totalHosts,
      onboardingComplete,
    },
  });
}
