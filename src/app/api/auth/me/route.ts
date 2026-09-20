import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null });
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
