import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRenterSession, RENTER_SESSION_COOKIE, SESSION_DURATION_DAYS } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const renter = await prisma.renterAccount.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!renter) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, renter.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!renter.isActive) {
      return NextResponse.json({ error: "Account is inactive. Please contact support." }, { status: 403 });
    }

    await prisma.renterAccount.update({
      where: { id: renter.id },
      data: { lastLoginAt: new Date() },
    });

    const token = await createRenterSession(renter.id);

    const response = NextResponse.json({
      success: true,
      renter: {
        id: renter.id,
        email: renter.email,
        firstName: renter.firstName,
        lastName: renter.lastName,
      },
    });

    const expires = new Date();
    expires.setDate(expires.getDate() + SESSION_DURATION_DAYS);

    response.cookies.set(RENTER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Renter login error:", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
