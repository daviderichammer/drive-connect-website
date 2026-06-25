import { NextRequest, NextResponse } from "next/server";
import { getCurrentRenter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const renter = await getCurrentRenter();
    
    if (!renter) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    return NextResponse.json({
      authenticated: true,
      renter: {
        id: renter.id,
        email: renter.email,
        firstName: renter.firstName,
        lastName: renter.lastName,
        phone: renter.phone,
        profileImageUrl: renter.profileImageUrl,
        licenseVerified: renter.licenseVerified,
      }
    });
  } catch (error) {
    console.error("Get renter me error:", error);
    return NextResponse.json({ error: "Failed to authenticate" }, { status: 500 });
  }
}
