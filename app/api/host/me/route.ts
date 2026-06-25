import { NextRequest, NextResponse } from "next/server";
import { getCurrentHost } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const host = await getCurrentHost();

    if (!host) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      host: {
        id: host.id,
        email: host.email,
        businessName: host.businessName,
        ownerName: host.ownerName,
        phone: host.phone,
        logoUrl: host.logoUrl,
        description: host.description,
        serviceAreas: host.serviceAreas,
        profileCompleted: host.profileCompleted,
        onboardingStep: host.onboardingStep,
        onboardingCompleted: host.onboardingCompleted,
        insuranceVerified: host.insuranceVerified,
        bankingInfoCompleted: host.bankingInfoCompleted,
        isActive: host.isActive,
      },
    });
  } catch (error) {
    console.error("Get current host error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
