import { NextRequest, NextResponse } from "next/server";
import { deleteAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (token) {
      deleteAdminSession(token);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete(ADMIN_SESSION_COOKIE);
    return response;
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
