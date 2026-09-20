import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getSessionSecret } from "@/lib/env";

export const SESSION_COOKIE_NAME = "tb_session";

interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  role: string;
  exp: number;
}

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(getSessionSecret());
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signPayload(dataB64: string): Promise<string> {
  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(dataB64)
  );
  return Buffer.from(signatureBuffer).toString("base64url");
}

export async function verifySignedPayload(token: string): Promise<string | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [dataB64, sigB64] = parts;
    const key = await getCryptoKey();
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(sigB64, "base64url"),
      new TextEncoder().encode(dataB64)
    );
    return isValid ? dataB64 : null;
  } catch {
    return null;
  }
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const data: SessionPayload = { ...payload, exp };
  const dataB64 = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sigB64 = await signPayload(dataB64);
  return `${dataB64}.${sigB64}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const dataB64 = await verifySignedPayload(token);
    if (!dataB64) return null;
    const payload: SessionPayload = JSON.parse(Buffer.from(dataB64, "base64url").toString("utf8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    return prisma.user.findUnique({
      where: { id: payload.userId },
    });
  } catch (err) {
    console.error("Error retrieving session user:", err);
    return null;
  }
}

export function sessionCookieOptions(maxAge = 30 * 24 * 60 * 60) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}
