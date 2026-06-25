with open('lib/auth.ts', 'r') as f:
    content = f.read()

renter_auth = """
export const RENTER_SESSION_COOKIE = "dc_renter_session";

export async function createRenterSession(renterId: number): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);
  
  await prisma.renterSession.create({
    data: {
      renterId,
      sessionToken: token,
      expiresAt,
    },
  });
  
  return token;
}

export async function getRenterFromSession(token: string) {
  if (!token) return null;
  
  const session = await prisma.renterSession.findUnique({
    where: { sessionToken: token },
    include: { renter: true },
  });
  
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.renterSession.delete({ where: { id: session.id } });
    }
    return null;
  }
  
  return session.renter;
}

export async function deleteRenterSession(token: string) {
  await prisma.renterSession.deleteMany({ where: { sessionToken: token } });
}

export async function getCurrentRenter() {
  const cookieStore = await cookies();
  const token = cookieStore.get(RENTER_SESSION_COOKIE)?.value;
  
  if (!token) return null;
  
  return getRenterFromSession(token);
}
"""

if "RENTER_SESSION_COOKIE" not in content:
    content += "\n" + renter_auth

with open('lib/auth.ts', 'w') as f:
    f.write(content)

print("Auth updated")
