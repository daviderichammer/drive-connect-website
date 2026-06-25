import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const renter = await prisma.renterAccount.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!renter) {
      return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }

    const resetToken = generateToken();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await prisma.renterAccount.update({
      where: { id: renter.id },
      data: { resetToken, resetTokenExpiry },
    });

    // In production, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Request failed. Please try again." }, { status: 500 });
  }
}
