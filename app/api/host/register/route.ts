import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from "@/lib/auth";
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

    // Find the application with this approval token
    const application = await prisma.partnerApplication.findFirst({
      where: {
        approvalToken: token,
        status: "approved",
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Invalid or expired registration link." }, { status: 400 });
    }

    if (application.approvalTokenExpiry && application.approvalTokenExpiry < new Date()) {
      return NextResponse.json({ error: "This registration link has expired. Please contact support." }, { status: 400 });
    }

    // Check if account already exists
    const existingAccount = await prisma.hostAccount.findUnique({
      where: { applicationId: application.id },
    });

    if (existingAccount) {
      return NextResponse.json({ error: "An account already exists for this application. Please log in." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const host = await prisma.hostAccount.create({
      data: {
        email: application.email.toLowerCase().trim(),
        passwordHash,
        name: application.ownerName,
        applicationId: application.id,
        onboardingStep: 1,
      },
    });

    // Clear the approval token after use
    await prisma.partnerApplication.update({
      where: { id: application.id },
      data: { approvalToken: null, approvalTokenExpiry: null },
    });

    const sessionToken = await createSession(host.id);

    const response = NextResponse.json({
      success: true,
      host: {
        id: host.id,
        email: host.email,
        name: host.name,
        onboardingComplete: false,
        onboardingStep: 1,
      },
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
