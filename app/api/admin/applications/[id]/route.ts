import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromSession, ADMIN_SESSION_COOKIE, generateToken } from "@/lib/auth";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return getAdminFromSession(token);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const application = await prisma.partnerApplication.findUnique({
      where: { id: parseInt(id) },
      include: {
        hostAccount: {
          select: {
            id: true,
            onboardingStep: true,
            onboardingCompleted: true,
            profileCompleted: true,
            insuranceVerified: true,
            bankingInfoCompleted: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Get application error:", error);
    return NextResponse.json({ error: "Failed to fetch application." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const { action, adminNotes } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
    }

    const application = await prisma.partnerApplication.findUnique({
      where: { id: parseInt(id) },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        { error: `Application has already been ${application.status}.` },
        { status: 400 }
      );
    }

    let updateData: Record<string, unknown> = {
      status: action === "approve" ? "approved" : "rejected",
      reviewedAt: new Date(),
      reviewedBy: admin,
      adminNotes: adminNotes || null,
    };

    if (action === "approve") {
      const approvalToken = generateToken();
      updateData.approvalToken = approvalToken;
      updateData.approvalTokenUsed = false;
    }

    const updated = await prisma.partnerApplication.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // Send email notification
    try {
      if (action === "approve") {
        await sendApprovalEmail(
          updated.email,
          updated.ownerName,
          updated.businessName,
          updated.approvalToken!
        );
      } else {
        await sendRejectionEmail(updated.email, updated.ownerName, updated.businessName);
      }
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      application: updated,
      message: `Application ${action === "approve" ? "approved" : "rejected"} successfully.`,
    });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Failed to update application." }, { status: 500 });
  }
}
