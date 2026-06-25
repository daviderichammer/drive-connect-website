import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("insuranceDoc") as File | null;
    const insuranceExpiry = formData.get("insuranceExpiry") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Insurance document is required." }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PDF, JPG, and PNG files are allowed." }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be under 10MB." }, { status: 400 });
    }

    // Save file to public/uploads/insurance
    const uploadDir = path.join(process.cwd(), "public", "uploads", "insurance");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = file.name.split(".").pop();
    const filename = `insurance_${session.host.id}_${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(bytes));

    const insuranceDocUrl = `/uploads/insurance/${filename}`;

    // Update business profile
    const existing = await prisma.businessProfile.findUnique({
      where: { hostId: session.host.id },
    });

    if (existing) {
      await prisma.businessProfile.update({
        where: { hostId: session.host.id },
        data: {
          insuranceDoc: insuranceDocUrl,
          insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        },
      });
    } else {
      await prisma.businessProfile.create({
        data: {
          hostId: session.host.id,
          businessName: session.host.name,
          insuranceDoc: insuranceDocUrl,
          insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        },
      });
    }

    await prisma.hostAccount.update({
      where: { id: session.host.id },
      data: { onboardingStep: Math.max(session.host.onboardingStep, 4) },
    });

    return NextResponse.json({ success: true, insuranceDocUrl });
  } catch (error) {
    console.error("Insurance upload error:", error);
    return NextResponse.json({ error: "Failed to upload insurance document." }, { status: 500 });
  }
}
