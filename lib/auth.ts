import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const SESSION_COOKIE = "dc_host_session";
export const ADMIN_SESSION_COOKIE = "dc_admin_session";
export const SESSION_DURATION_DAYS = 7;

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createHostSession(hostId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  await prisma.hostSession.create({
    data: {
      hostId,
      sessionToken: token,
      expiresAt,
    },
  });

  return token;
}

export async function getHostFromSession(token: string) {
  if (!token) return null;

  const session = await prisma.hostSession.findUnique({
    where: { sessionToken: token },
    include: { host: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.hostSession.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.host;
}

export async function deleteHostSession(token: string) {
  await prisma.hostSession.deleteMany({ where: { sessionToken: token } });
}

export async function getCurrentHost() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return getHostFromSession(token);
}

// Simple admin session store (in-memory for simplicity, backed by env)
const ADMIN_SESSION_MAP = new Map<string, { email: string; expiresAt: Date }>();

export function createAdminSession(email: string): string {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 8);
  ADMIN_SESSION_MAP.set(token, { email, expiresAt });
  return token;
}

export function getAdminFromSession(token: string): string | null {
  if (!token) return null;
  const session = ADMIN_SESSION_MAP.get(token);
  if (!session || session.expiresAt < new Date()) {
    ADMIN_SESSION_MAP.delete(token);
    return null;
  }
  return session.email;
}

export function deleteAdminSession(token: string) {
  ADMIN_SESSION_MAP.delete(token);
}
