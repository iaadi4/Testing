import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let handle = (body.handle || "").trim().toLowerCase().replace(/^@/, "");

    if (!handle) {
      return NextResponse.json({ error: "Please enter your Twitter handle" }, { status: 400 });
    }

    // Twitter handles are 1-15 characters, letters, numbers, and underscores
    if (!/^[a-z0-9_]{1,15}$/.test(handle)) {
      return NextResponse.json(
        { error: "Invalid Twitter handle. Must be 1-15 characters (letters, numbers, underscores)." },
        { status: 400 }
      );
    }

    // Find existing creator or create a new verified listing
    let user = await prisma.user.findUnique({
      where: { username: handle },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          twitterId: `tw_${handle}_${Date.now()}`,
          username: handle,
          name: handle.charAt(0).toUpperCase() + handle.slice(1),
          avatarUrl: `https://unavatar.io/x/${handle}`,
          bio: `Creator on twitterbanner.lol (@${handle})`,
          followersCount: 150,
          followingCount: 80,
          isVerified: true,
          weeklyPrice: 29.0,
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

    const response = NextResponse.json({
      success: true,
      redirect: "/dashboard",
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Handle login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log in" },
      { status: 500 }
    );
  }
}
