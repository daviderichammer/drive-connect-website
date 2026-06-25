import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const host = await getCurrentHost();
  if (!host) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { insuranceDocUrl, insuranceDocName, policyNumber, provider, expiryDate } = body;

    await prisma.hostAccount.update({
      where: { id: host.id },
      data: {
        insuranceDocUrl: insuranceDocUrl || null,
        insuranceDocName: insuranceDocName || policyNumber || null,
        onboardingStep: Math.max(host.onboardingStep, 4),
      },
    });

    return NextResponse.json({ success: true, message: "Insurance information saved." });
  } catch (error) {
    console.error("Insurance save error:", error);
    return NextResponse.json({ error: "Failed to save insurance information." }, { status: 500 });
  }
}
