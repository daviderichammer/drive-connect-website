import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { accountHolderName, bankName, accountType, routingNumber, accountNumber } = body;

    if (!accountHolderName || !bankName || !accountType || !routingNumber || !accountNumber) {
      return NextResponse.json({ error: "All banking fields are required." }, { status: 400 });
    }

    // Store only masked/reference data — no real payment processor integration yet
    const maskedAccount = accountNumber.slice(-4).padStart(accountNumber.length, "*");
    const bankingInfo = JSON.stringify({
      accountHolderName,
      bankName,
      accountType,
      routingNumber: routingNumber.slice(-4).padStart(routingNumber.length, "*"),
      accountNumberMasked: maskedAccount,
      submittedAt: new Date().toISOString(),
    });

    const existing = await prisma.businessProfile.findUnique({
      where: { hostId: session.host.id },
    });

    if (existing) {
      await prisma.businessProfile.update({
        where: { hostId: session.host.id },
        data: { bankingInfo, bankingComplete: true },
      });
    } else {
      await prisma.businessProfile.create({
        data: {
          hostId: session.host.id,
          businessName: session.host.name,
          bankingInfo,
          bankingComplete: true,
        },
      });
    }

    // Mark onboarding as complete
    await prisma.hostAccount.update({
      where: { id: session.host.id },
      data: {
        onboardingStep: 5,
        onboardingComplete: true,
      },
    });

    return NextResponse.json({ success: true, message: "Banking information saved." });
  } catch (error) {
    console.error("Banking save error:", error);
    return NextResponse.json({ error: "Failed to save banking information." }, { status: 500 });
  }
}
