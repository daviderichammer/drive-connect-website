import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const host = await prisma.hostAccount.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!host || !host.isActive) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, host.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Update last login
    await prisma.hostAccount.update({
      where: { id: host.id },
      data: { lastLoginAt: new Date() },
    });

    const sessionToken = await createSession(host.id);

    const response = NextResponse.json({
      success: true,
      host: {
        id: host.id,
        email: host.email,
        name: host.name,
        onboardingComplete: host.onboardingComplete,
        onboardingStep: host.onboardingStep,
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
