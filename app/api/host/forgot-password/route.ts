import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const host = await prisma.hostAccount.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!host || !host.isActive) {
      return NextResponse.json({ success: true });
    }

    const resetToken = generateToken();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    await prisma.hostAccount.update({
      where: { id: host.id },
      data: { resetToken, resetTokenExpiry },
    });

    try {
      await sendPasswordResetEmail(host.email, host.ownerName, resetToken);
    } catch (emailError) {
      console.error("Failed to send reset email:", emailError);
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Request failed. Please try again." }, { status: 500 });
  }
}
