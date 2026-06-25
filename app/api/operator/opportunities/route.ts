import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getHostFromSession, SESSION_COOKIE } from "@/lib/auth";
import { getAvailableOpportunities } from "@/lib/bid-engine";

async function requireOperator() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getHostFromSession(token);
}

export async function GET(req: NextRequest) {
  try {
    const operator = await requireOperator();
    if (!operator) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const opportunities = await getAvailableOpportunities(operator.id);
    return NextResponse.json({ success: true, opportunities });
  } catch (error) {
    console.error("Get opportunities error:", error);
    return NextResponse.json({ error: "Failed to fetch opportunities." }, { status: 500 });
  }
}
