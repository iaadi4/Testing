import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeString, isValidDefaultBannerUrl } from "@/lib/security";
import { CATEGORIES } from "@/lib/site";
import { revalidateMarketplace } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.removedAt) {
    return NextResponse.json({ error: "This creator account has been removed from the marketplace." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { weeklyPrice, isListingActive, category, payoutNotes, defaultBannerUrl } = body;
    const data: Record<string, unknown> = {};

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
      const next = sanitizeString(category, 50);
      if (!CATEGORIES.includes(next as never)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      data.category = next;
    }

    if (payoutNotes !== undefined) {
      data.payoutNotes = sanitizeString(payoutNotes, 500);
    }

    if (defaultBannerUrl !== undefined && typeof defaultBannerUrl === "string") {
      if (!isValidDefaultBannerUrl(defaultBannerUrl)) {
        return NextResponse.json({ error: "Invalid default banner URL" }, { status: 400 });
      }
      data.defaultBannerUrl = defaultBannerUrl;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    await revalidateMarketplace(updated.username);

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
  } catch (error) {
    console.error("Failed to update creator settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
