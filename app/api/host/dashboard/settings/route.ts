import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentHost } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    return NextResponse.json({
      host: {
        id: host.id,
        email: host.email,
        businessName: host.businessName,
        ownerName: host.ownerName,
        phone: host.phone,
        logoUrl: host.logoUrl,
        description: host.description,
        serviceAreas: host.serviceAreas,
        bankAccountName: host.bankAccountName,
        bankAccountType: host.bankAccountType,
        payoutEmail: host.payoutEmail,
        bankingInfoCompleted: host.bankingInfoCompleted,
        profileCompleted: host.profileCompleted,
        insuranceVerified: host.insuranceVerified,
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const host = await getCurrentHost();
    if (!host) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { section } = body;

    if (section === "profile") {
      const { businessName, ownerName, phone, description, serviceAreas } = body;

      const updated = await prisma.hostAccount.update({
        where: { id: host.id },
        data: {
          businessName: businessName || host.businessName,
          ownerName: ownerName || host.ownerName,
          phone: phone !== undefined ? phone : host.phone,
          description: description !== undefined ? description : host.description,
          serviceAreas: serviceAreas !== undefined ? serviceAreas : host.serviceAreas,
          profileCompleted: true,
        },
      });

      return NextResponse.json({
        success: true,
        host: {
          businessName: updated.businessName,
          ownerName: updated.ownerName,
          phone: updated.phone,
          description: updated.description,
          serviceAreas: updated.serviceAreas,
        },
      });
    }

    if (section === "banking") {
      const { bankAccountName, bankAccountNumber, bankRoutingNumber, bankAccountType, payoutEmail } = body;

      const updated = await prisma.hostAccount.update({
        where: { id: host.id },
        data: {
          bankAccountName: bankAccountName !== undefined ? bankAccountName : host.bankAccountName,
          bankAccountNumber: bankAccountNumber !== undefined ? bankAccountNumber : host.bankAccountNumber,
          bankRoutingNumber: bankRoutingNumber !== undefined ? bankRoutingNumber : host.bankRoutingNumber,
          bankAccountType: bankAccountType !== undefined ? bankAccountType : host.bankAccountType,
          payoutEmail: payoutEmail !== undefined ? payoutEmail : host.payoutEmail,
          bankingInfoCompleted: true,
        },
      });

      return NextResponse.json({
        success: true,
        host: {
          bankAccountName: updated.bankAccountName,
          bankAccountType: updated.bankAccountType,
          payoutEmail: updated.payoutEmail,
          bankingInfoCompleted: updated.bankingInfoCompleted,
        },
      });
    }

    if (section === "password") {
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Current and new password required." }, { status: 400 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
      }

      const valid = await bcrypt.compare(currentPassword, host.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
      }

      const newHash = await bcrypt.hash(newPassword, 12);
      await prisma.hostAccount.update({
        where: { id: host.id },
        data: { passwordHash: newHash },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid section." }, { status: 400 });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
