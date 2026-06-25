import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const SESSION_COOKIE_NAME = "dc_host_session";
export const SESSION_DURATION_DAYS = 30;

export async function createSession(hostId: number): Promise<string> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.hostSession.create({
    data: {
      sessionToken,
      hostId,
      expiresAt,
    },
  });

  return sessionToken;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.hostSession.findUnique({
    where: { sessionToken: token },
    include: {
      host: {
        include: {
          businessProfile: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.hostSession.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session;
}

export async function deleteSession(token: string) {
  await prisma.hostSession.deleteMany({
    where: { sessionToken: token },
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("dc_admin_session")?.value;
  if (!token) return null;

  // Simple JWT-based admin session check
  try {
    const jwt = require("jsonwebtoken");
    const secret = process.env.ADMIN_JWT_SECRET || "drive-connect-admin-secret-2024";
    const payload = jwt.verify(token, secret) as { adminId: number; email: string; role: string };
    return payload;
  } catch {
    return null;
  }
}
