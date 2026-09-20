import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signPayload, verifySignedPayload, sessionCookieOptions } from "@/lib/auth";
import { assertAdminPasswordConfigured } from "@/lib/env";
import { timingSafeCompare } from "@/lib/security";

export const ADMIN_COOKIE_NAME = "tb_admin";
const ADMIN_TTL_SEC = 8 * 60 * 60;

interface AdminPayload {
  role: "admin";
  exp: number;
}

export async function createAdminToken(): Promise<string> {
  const payload: AdminPayload = {
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + ADMIN_TTL_SEC,
  };
  const dataB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sigB64 = await signPayload(dataB64);
  return `${dataB64}.${sigB64}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const dataB64 = await verifySignedPayload(token);
  if (!dataB64) return false;
  try {
    const payload: AdminPayload = JSON.parse(Buffer.from(dataB64, "base64url").toString("utf8"));
    return payload.role === "admin" && payload.exp >= Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = assertAdminPasswordConfigured();
  return timingSafeCompare(password, expected);
}

export function attachAdminCookie(res: NextResponse, token: string) {
  res.cookies.set(ADMIN_COOKIE_NAME, token, sessionCookieOptions(ADMIN_TTL_SEC));
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.delete(ADMIN_COOKIE_NAME);
}
