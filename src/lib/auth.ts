import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

const SESSION_COOKIE_NAME = "tb_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "twitterbanner_secret_key_change_in_prod_123456789";

interface SessionPayload {
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  role: string;
  exp: number;
}

// Convert string to Uint8Array key for Web Crypto
async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SESSION_SECRET);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Sign a session payload into a signed base64 token
export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
  const data: SessionPayload = { ...payload, exp };
  const jsonStr = JSON.stringify(data);
  const dataB64 = Buffer.from(jsonStr).toString("base64url");

  const key = await getCryptoKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(dataB64)
  );
  const sigB64 = Buffer.from(signatureBuffer).toString("base64url");

  return `${dataB64}.${sigB64}`;
}

// Verify and decode a session token
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [dataB64, sigB64] = parts;
    const key = await getCryptoKey();
    const sigBuffer = Buffer.from(sigB64, "base64url");

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuffer,
      new TextEncoder().encode(dataB64)
    );

    if (!isValid) return null;

    const payload: SessionPayload = JSON.parse(Buffer.from(dataB64, "base64url").toString("utf8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // expired
    }

    return payload;
  } catch {
    return null;
  }
}

// Get the currently authenticated creator from cookies in a Server Component or Route Handler
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    return user;
  } catch (err) {
    console.error("Error retrieving session user:", err);
    return null;
  }
}

export { SESSION_COOKIE_NAME };
