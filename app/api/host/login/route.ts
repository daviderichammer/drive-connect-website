import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHostSession, SESSION_COOKIE, SESSION_DURATION_DAYS } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const host = await prisma.hostAccount.findUnique({ where: { email: email.toLowerCase() } });

    if (!host || !host.isActive) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, host.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Update last login
    await prisma.hostAccount.update({
      where: { id: host.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await createHostSession(host.id);

    const response = NextResponse.json({
      success: true,
      host: {
        id: host.id,
        email: host.email,
        businessName: host.businessName,
        ownerName: host.ownerName,
        onboardingCompleted: host.onboardingCompleted,
        onboardingStep: host.onboardingStep,
      },
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Host login error:", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
