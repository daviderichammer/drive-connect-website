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
    const { accountHolderName, bankName, accountType, routingNumber, accountNumber } = body;

    if (!accountHolderName || !bankName || !accountType || !routingNumber || !accountNumber) {
      return NextResponse.json({ error: "All banking fields are required." }, { status: 400 });
    }

    const maskedAccount = accountNumber.slice(-4).padStart(accountNumber.length, "*");
    const maskedRouting = routingNumber.slice(-4).padStart(routingNumber.length, "*");

    await prisma.hostAccount.update({
      where: { id: host.id },
      data: {
        bankAccountName: accountHolderName,
        bankAccountNumber: maskedAccount,
        bankRoutingNumber: maskedRouting,
        bankAccountType: accountType,
        bankingInfoCompleted: true,
        onboardingStep: Math.max(host.onboardingStep, 5),
        onboardingCompleted: true,
      },
    });

    return NextResponse.json({ success: true, message: "Banking information saved." });
  } catch (error) {
    console.error("Banking save error:", error);
    return NextResponse.json({ error: "Failed to save banking information." }, { status: 500 });
  }
}
