import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  isTwitterConfigured,
  generatePKCE,
  getTwitterAuthorizationUrl,
} from "@/lib/twitterAuth";

export async function GET(req: NextRequest) {
  const appUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    req.nextUrl.origin;

  const redirectUri = `${appUrl}/api/auth/twitter/callback`;

  // If Twitter is not configured or mock is requested, redirect to mock login selector
  const urlParams = req.nextUrl.searchParams;
  if (!isTwitterConfigured || urlParams.get("mock") === "true") {
    const mockHandle = urlParams.get("handle") || "iaadi8";
    return NextResponse.redirect(new URL(`/api/auth/mock-login?handle=${mockHandle}`, req.url));
  }

  // Production Twitter OAuth 2.0 PKCE
  const state = crypto.randomBytes(16).toString("hex");
  const { codeVerifier, codeChallenge } = generatePKCE();

  const authUrl = getTwitterAuthorizationUrl({
    redirectUri,
    state,
    codeChallenge,
  });

  const response = NextResponse.redirect(authUrl);

  // Set short-lived HTTP-only cookies for state and PKCE codeVerifier
  response.cookies.set("tb_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  response.cookies.set("tb_oauth_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
