import { NextRequest, NextResponse } from "next/server";
import { deleteRenterSession, RENTER_SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(RENTER_SESSION_COOKIE)?.value;
    
    if (token) {
      await deleteRenterSession(token);
    }
    
    const response = NextResponse.json({ success: true });
    response.cookies.delete(RENTER_SESSION_COOKIE);
    
    return response;
  } catch (error) {
    console.error("Renter logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
