import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeTwitterCode,
  fetchTwitterUser,
  upsertTwitterUser,
} from "@/lib/twitterAuth";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    console.error("Twitter OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=twitter_auth_cancelled", req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/?error=missing_auth_params", req.url));
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("tb_oauth_state")?.value;
  const codeVerifier = cookieStore.get("tb_oauth_verifier")?.value;

  if (!savedState || savedState !== state || !codeVerifier) {
    console.error("State or PKCE verifier mismatch");
    return NextResponse.redirect(new URL("/?error=invalid_oauth_state", req.url));
  }

  try {
    const appUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin;

    const redirectUri = `${appUrl}/api/auth/twitter/callback`;

    // 1. Exchange code for tokens
    const { accessToken } = await exchangeTwitterCode({
      code,
      codeVerifier,
      redirectUri,
    });

    // 2. Fetch user profile from Twitter API v2
    const twitterProfile = await fetchTwitterUser(accessToken);

    // 3. Upsert user in database
    const user = await upsertTwitterUser(twitterProfile);

    // 4. Create session token
    const token = await createSessionToken({
      userId: user.id,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
    });

    // 5. Redirect to creator dashboard with session cookie
    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    // Clean up temporary OAuth cookies
    response.cookies.delete("tb_oauth_state");
    response.cookies.delete("tb_oauth_verifier");

    return response;
  } catch (err: any) {
    console.error("Twitter OAuth processing failure:", err);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(err.message || "auth_failed")}`, req.url)
    );
  }
}
