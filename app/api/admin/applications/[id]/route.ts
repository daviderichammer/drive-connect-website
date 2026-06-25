import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";
import crypto from "crypto";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const application = await prisma.partnerApplication.findUnique({
    where: { id: parseInt(id) },
    include: {
      hostAccount: {
        select: { id: true, email: true, onboardingComplete: true, onboardingStep: true, createdAt: true },
      },
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  return NextResponse.json({ application });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const { action, notes } = await req.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const application = await prisma.partnerApplication.findUnique({
    where: { id: parseInt(id) },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  if (application.status !== "pending") {
    return NextResponse.json({ error: "Application has already been reviewed." }, { status: 400 });
  }

  if (action === "approve") {
    const approvalToken = crypto.randomBytes(32).toString("hex");
    const approvalTokenExpiry = new Date();
    approvalTokenExpiry.setHours(approvalTokenExpiry.getHours() + 72);

    await prisma.partnerApplication.update({
      where: { id: parseInt(id) },
      data: {
        status: "approved",
        reviewedBy: admin.email,
        reviewedAt: new Date(),
        reviewNotes: notes || null,
        approvalToken,
        approvalTokenExpiry,
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://5.161.189.93";
    const registrationLink = `${siteUrl}/host-login/register?token=${approvalToken}`;

    const emailResult = await sendApprovalEmail(
      application.email,
      application.ownerName,
      application.businessName,
      registrationLink
    );

    return NextResponse.json({
      success: true,
      action: "approved",
      registrationLink,
      emailSent: emailResult.success,
    });
  } else {
    await prisma.partnerApplication.update({
      where: { id: parseInt(id) },
      data: {
        status: "rejected",
        reviewedBy: admin.email,
        reviewedAt: new Date(),
        reviewNotes: notes || null,
      },
    });

    const emailResult = await sendRejectionEmail(
      application.email,
      application.ownerName,
      application.businessName,
      notes
    );

    return NextResponse.json({
      success: true,
      action: "rejected",
      emailSent: emailResult.success,
    });
  }
}
