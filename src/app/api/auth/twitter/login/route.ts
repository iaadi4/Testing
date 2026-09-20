import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  isTwitterConfigured,
  generatePKCE,
  getTwitterAuthorizationUrl,
} from "@/lib/twitterAuth";
import { getSiteUrl } from "@/lib/site";

export async function GET(req: NextRequest) {
  const appUrl = getSiteUrl() || req.nextUrl.origin;

  const redirectUri = `${appUrl}/api/auth/twitter/callback`;

  if (!isTwitterConfigured()) {
    return NextResponse.redirect(
      new URL("/?error=twitter_oauth_not_configured", req.url)
    );
  }

  // Real Twitter OAuth 2.0 PKCE flow
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
