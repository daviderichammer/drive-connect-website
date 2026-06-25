import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where = status !== "all" ? { status } : {};

  const [applications, total] = await Promise.all([
    prisma.partnerApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        hostAccount: {
          select: { id: true, email: true, onboardingComplete: true, onboardingStep: true },
        },
      },
    }),
    prisma.partnerApplication.count({ where }),
  ]);

  return NextResponse.json({
    applications,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
