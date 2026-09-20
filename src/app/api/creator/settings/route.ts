import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeString } from "@/lib/security";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { weeklyPrice, isListingActive, category, payoutNotes, defaultBannerUrl } = body;

    const data: any = {};

    if (weeklyPrice !== undefined) {
      const price = parseFloat(String(weeklyPrice));
      if (isNaN(price) || price < 1) {
        return NextResponse.json({ error: "Weekly price must be at least $1" }, { status: 400 });
      }
      data.weeklyPrice = Math.round(price * 100) / 100;
    }

    if (isListingActive !== undefined) {
      data.isListingActive = Boolean(isListingActive);
    }

    if (category !== undefined) {
      data.category = sanitizeString(category, 50);
    }

    if (payoutNotes !== undefined) {
      data.payoutNotes = sanitizeString(payoutNotes, 500);
    }

    if (defaultBannerUrl !== undefined && typeof defaultBannerUrl === "string") {
      data.defaultBannerUrl = defaultBannerUrl;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        username: updated.username,
        weeklyPrice: updated.weeklyPrice,
        isListingActive: updated.isListingActive,
        category: updated.category,
        payoutNotes: updated.payoutNotes,
        defaultBannerUrl: updated.defaultBannerUrl,
      },
    });
  } catch (error: any) {
    console.error("Failed to update creator settings:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
