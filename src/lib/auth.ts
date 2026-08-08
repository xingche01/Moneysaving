import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "ledgerly_session";
const sessionAge = 60 * 60 * 24 * 14;

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${sessionAge}s`)
    .sign(secretKey());
}

export async function setSession(userId: string) {
  const token = await createSessionToken(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionAge,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function currentUserId() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
