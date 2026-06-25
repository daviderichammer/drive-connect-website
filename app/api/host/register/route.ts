import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHostSession, SESSION_COOKIE, SESSION_DURATION_DAYS } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password, confirmPassword } = await req.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Find application by approval token
    const application = await prisma.partnerApplication.findFirst({
      where: {
        approvalToken: token,
        status: "approved",
        approvalTokenUsed: false,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Invalid or expired registration link. Please contact support." },
        { status: 400 }
      );
    }

    // Check if host account already exists
    const existingHost = await prisma.hostAccount.findUnique({
      where: { applicationId: application.id },
    });

    if (existingHost) {
      return NextResponse.json(
        { error: "An account already exists for this application. Please log in." },
        { status: 400 }
      );
    }

    // Check if email is already taken
    const existingEmail = await prisma.hostAccount.findUnique({
      where: { email: application.email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create host account
    const host = await prisma.hostAccount.create({
      data: {
        applicationId: application.id,
        email: application.email.toLowerCase(),
        passwordHash,
        businessName: application.businessName,
        ownerName: application.ownerName,
        phone: application.phone,
        onboardingStep: 1,
      },
    });

    // Mark token as used
    await prisma.partnerApplication.update({
      where: { id: application.id },
      data: { approvalTokenUsed: true },
    });

    // Create session
    const sessionToken = await createHostSession(host.id);

    const response = NextResponse.json({
      success: true,
      host: {
        id: host.id,
        email: host.email,
        businessName: host.businessName,
        ownerName: host.ownerName,
        onboardingStep: host.onboardingStep,
        onboardingCompleted: host.onboardingCompleted,
      },
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Host registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

// GET: Validate registration token
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token required." }, { status: 400 });
    }

    const application = await prisma.partnerApplication.findFirst({
      where: {
        approvalToken: token,
        status: "approved",
        approvalTokenUsed: false,
      },
    });

    if (!application) {
      return NextResponse.json({ valid: false, error: "Invalid or expired token." });
    }

    return NextResponse.json({
      valid: true,
      businessName: application.businessName,
      ownerName: application.ownerName,
      email: application.email,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json({ valid: false, error: "Validation failed." }, { status: 500 });
  }
}
