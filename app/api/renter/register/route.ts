import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRenterSession, RENTER_SESSION_COOKIE, SESSION_DURATION_DAYS } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password, licenseNumber, licenseState } = await req.json();

    if (!firstName || !lastName || !email || !password || !licenseNumber || !licenseState) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // Check if email is already taken
    const existingEmail = await prisma.renterAccount.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create renter account
    const renter = await prisma.renterAccount.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone,
        licenseNumber,
        licenseState,
      },
    });

    // Create session
    const sessionToken = await createRenterSession(renter.id);

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

    response.cookies.set(RENTER_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Renter registration error:", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
