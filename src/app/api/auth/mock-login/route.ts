import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const handle = (req.nextUrl.searchParams.get("handle") || "iaadi8").toLowerCase().replace("@", "");

  // Find existing creator or create demo creator
  let user = await prisma.user.findUnique({
    where: { username: handle },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        twitterId: `mock_${Date.now()}`,
        username: handle,
        name: handle.charAt(0).toUpperCase() + handle.slice(1),
        avatarUrl: "/avatar.png",
        bio: `Verified creator on twitterbanner.lol (@${handle})`,
        followersCount: 111,
        followingCount: 85,
        isVerified: true,
        weeklyPrice: 39.0,
        isListingActive: true,
        category: "Tech & Dev",
        defaultBannerUrl: "/banner.png",
      },
    });
  }

  const token = await createSessionToken({
    userId: user.id,
    username: user.username,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
  });

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
