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
    const { businessName, description, serviceAreas, phone, website, logoUrl } = body;

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }

    await prisma.hostAccount.update({
      where: { id: host.id },
      data: {
        businessName,
        description: description || null,
        serviceAreas: serviceAreas || null,
        phone: phone || host.phone,
        logoUrl: logoUrl || null,
        profileCompleted: true,
        onboardingStep: Math.max(host.onboardingStep, 2),
      },
    });

    return NextResponse.json({ success: true, message: "Profile saved." });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }
}
