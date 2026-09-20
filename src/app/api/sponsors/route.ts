import { NextRequest, NextResponse } from "next/server";
import { getMarketplaceData } from "@/lib/marketplace";
import { checkRateLimit, getClientIp } from "@/lib/security";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`sponsors_${ip}`, 30, 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const category = req.nextUrl.searchParams.get("category") || undefined;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const sortBy = (req.nextUrl.searchParams.get("sort") as "followers" | "price_asc" | "price_desc") || undefined;
    const data = await getMarketplaceData({ category, search, sortBy });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching marketplace creators:", error);
    return NextResponse.json({ error: "Failed to fetch creators" }, { status: 500 });
  }
}
