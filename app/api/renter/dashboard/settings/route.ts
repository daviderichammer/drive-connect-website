import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentRenter } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({
      renter: {
        id: renter.id,
        email: renter.email,
        firstName: renter.firstName,
        lastName: renter.lastName,
        phone: renter.phone,
        profileImageUrl: renter.profileImageUrl,
        licenseNumber: renter.licenseNumber,
        licenseState: renter.licenseState,
        licenseVerified: renter.licenseVerified,
        createdAt: renter.createdAt,
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    if (!renter) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "updateProfile") {
      const { firstName, lastName, phone } = body;

      if (!firstName || !lastName) {
        return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
      }

      await prisma.renterAccount.update({
        where: { id: renter.id },
        data: { firstName, lastName, phone },
      });

      return NextResponse.json({ success: true, message: "Profile updated successfully." });
    }

    if (action === "updateLicense") {
      const { licenseNumber, licenseState } = body;

      if (!licenseNumber || !licenseState) {
        return NextResponse.json({ error: "License number and state are required." }, { status: 400 });
      }

      await prisma.renterAccount.update({
        where: { id: renter.id },
        data: { licenseNumber, licenseState, licenseVerified: false },
      });

      return NextResponse.json({ success: true, message: "Driver's license updated." });
    }

    if (action === "changePassword") {
      const { currentPassword, newPassword, confirmPassword } = body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json({ error: "All password fields are required." }, { status: 400 });
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: "New passwords do not match." }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }

      const isValid = await bcrypt.compare(currentPassword, renter.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.renterAccount.update({
        where: { id: renter.id },
        data: { passwordHash },
      });

      return NextResponse.json({ success: true, message: "Password changed successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
