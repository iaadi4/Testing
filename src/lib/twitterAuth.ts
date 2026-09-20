import crypto from "crypto";
import { prisma } from "@/lib/db";

function readTwitterClientId() {
  return process.env.TWITTER_CLIENT_ID?.trim() || "";
}

function readTwitterClientSecret() {
  return process.env.TWITTER_CLIENT_SECRET?.trim() || "";
}

export function isTwitterConfigured() {
  const id = readTwitterClientId();
  return Boolean(id && !id.includes("your_"));
}

function getTwitterClientId() {
  return readTwitterClientId();
}

function getTwitterClientSecret() {
  return readTwitterClientSecret();
}

// Base64-URL encode a buffer
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Generate PKCE code verifier and challenge
export function generatePKCE(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  const codeChallenge = base64URLEncode(hash);
  return { codeVerifier, codeChallenge };
}

// Construct Twitter OAuth 2.0 Authorization URL
export function getTwitterAuthorizationUrl(params: {
  redirectUri: string;
  state: string;
  codeChallenge: string;
}): string {
  const url = new URL("https://twitter.com/i/oauth2/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", getTwitterClientId());
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("scope", "users.read tweet.read offline.access");
  url.searchParams.set("state", params.state);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

// Exchange authorization code for tokens
export async function exchangeTwitterCode(params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<{ accessToken: string; refreshToken?: string }> {
  const body = new URLSearchParams({
    code: params.code,
    grant_type: "authorization_code",
    client_id: getTwitterClientId(),
    redirect_uri: params.redirectUri,
    code_verifier: params.codeVerifier,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const clientSecret = getTwitterClientSecret();
  if (clientSecret) {
    const basicAuth = Buffer.from(
      `${getTwitterClientId()}:${clientSecret}`
    ).toString("base64");
    headers["Authorization"] = `Basic ${basicAuth}`;
  }

  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers,
    body: body.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Twitter token exchange failed: ${errText}`);
  }

  const json = await response.json();
  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
  };
}

// Fetch verified Twitter user info
export async function fetchTwitterUser(accessToken: string) {
  const res = await fetch(
    "https://api.twitter.com/2/users/me?user.fields=profile_image_url,public_metrics,description,verified,location,entities",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch Twitter profile: ${errText}`);
  }

  const json = await res.json();
  return json.data;
}

// Upsert a Twitter creator in database
export async function upsertTwitterUser(twitterData: any) {
  const username = twitterData.username.toLowerCase();
  const avatarUrl = twitterData.profile_image_url
    ? twitterData.profile_image_url.replace("_normal.", "_400x400.")
    : "/avatar.png";

  const followersCount = twitterData.public_metrics?.followers_count ?? 0;
  const followingCount = twitterData.public_metrics?.following_count ?? 0;

  const profile = {
    name: twitterData.name,
    avatarUrl,
    bio: twitterData.description || null,
    location: twitterData.location || null,
    followersCount,
    followingCount,
    isVerified: Boolean(twitterData.verified),
  };

  // 1. Returning creator: match on the real Twitter ID.
  const byTwitterId = await prisma.user.findUnique({
    where: { twitterId: twitterData.id },
  });
  if (byTwitterId) {
    return prisma.user.update({
      where: { id: byTwitterId.id },
      data: {
        username,
        ...profile,
        ...(byTwitterId.removedAt ? { isListingActive: false } : {}),
      },
    });
  }

  // 2. Claim a pre-seeded listing that already owns this username but was
  //    created with a placeholder Twitter ID (e.g. prisma/seed.ts). Without
  //    this, the create() below hits the unique username constraint, throws,
  //    and the OAuth callback bounces the user back to the homepage.
  const byUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (byUsername) {
    return prisma.user.update({
      where: { id: byUsername.id },
      data: {
        twitterId: twitterData.id,
        ...profile,
        ...(byUsername.removedAt ? { isListingActive: false } : {}),
      },
    });
  }

  // 3. Brand-new creator.
  return prisma.user.create({
    data: {
      twitterId: twitterData.id,
      username,
      ...profile,
      weeklyPrice: followersCount > 10000 ? 99.0 : 39.0,
      isListingActive: true,
      category: "Tech & Dev",
      defaultBannerUrl: "/banner.png",
    },
  });
}
