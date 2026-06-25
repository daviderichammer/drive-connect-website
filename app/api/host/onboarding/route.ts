import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { step, data } = body;

    let updateData: Record<string, unknown> = {};

    switch (step) {
      case 1: {
        // Business profile
        const { description, serviceAreas } = data;
        updateData = {
          description: description || null,
          serviceAreas: serviceAreas || null,
          profileCompleted: true,
          onboardingStep: Math.max(host.onboardingStep, 2),
        };
        break;
      }

      case 3: {
        // Insurance documentation (URL stored after upload)
        const { insuranceDocUrl, insuranceDocName } = data;
        updateData = {
          insuranceDocUrl: insuranceDocUrl || null,
          insuranceDocName: insuranceDocName || null,
          onboardingStep: Math.max(host.onboardingStep, 4),
        };
        break;
      }

      case 4: {
        // Banking/payout info
        const { bankAccountName, bankAccountNumber, bankRoutingNumber, bankAccountType, payoutEmail } = data;
        updateData = {
          bankAccountName: bankAccountName || null,
          bankAccountNumber: bankAccountNumber || null,
          bankRoutingNumber: bankRoutingNumber || null,
          bankAccountType: bankAccountType || null,
          payoutEmail: payoutEmail || null,
          bankingInfoCompleted: true,
          onboardingStep: Math.max(host.onboardingStep, 5),
          onboardingCompleted: true,
        };
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid step." }, { status: 400 });
    }

    const updated = await prisma.hostAccount.update({
      where: { id: host.id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      onboardingStep: updated.onboardingStep,
      onboardingCompleted: updated.onboardingCompleted,
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Update failed. Please try again." }, { status: 500 });
  }
}
