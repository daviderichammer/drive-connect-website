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
    const { businessName, description, serviceAreas, phone, website, logoUrl } = body;

    if (!businessName) {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }

    const existing = await prisma.businessProfile.findUnique({
      where: { hostId: session.host.id },
    });

    let profile;
    if (existing) {
      profile = await prisma.businessProfile.update({
        where: { hostId: session.host.id },
        data: { businessName, description, serviceAreas, phone, website, logoUrl },
      });
    } else {
      profile = await prisma.businessProfile.create({
        data: {
          hostId: session.host.id,
          businessName,
          description,
          serviceAreas,
          phone,
          website,
          logoUrl,
        },
      });
    }

    await prisma.hostAccount.update({
      where: { id: session.host.id },
      data: { onboardingStep: Math.max(session.host.onboardingStep, 2) },
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Profile save error:", error);
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }
}
