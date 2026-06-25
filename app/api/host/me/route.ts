import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  return NextResponse.json({
    host: {
      id: session.host.id,
      email: session.host.email,
      name: session.host.name,
      onboardingComplete: session.host.onboardingComplete,
      onboardingStep: session.host.onboardingStep,
      businessProfile: session.host.businessProfile,
    },
  });
}
