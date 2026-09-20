import { NextResponse } from "next/server";
import { getSessionUser, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    const res = NextResponse.json({ user: null });
    res.cookies.delete(SESSION_COOKIE_NAME);
    return res;
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      website: user.website,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      weeklyPrice: user.weeklyPrice,
      isListingActive: user.isListingActive,
      category: user.category,
      role: user.role,
    },
  });
}
