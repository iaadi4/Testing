import { NextRequest, NextResponse } from "next/server";
import { getMarketplaceData } from "@/lib/marketplace";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") || undefined;
    const search = req.nextUrl.searchParams.get("search") || undefined;
    const data = await getMarketplaceData({ category, search });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Error fetching marketplace creators:", error);
    return NextResponse.json({ error: "Failed to fetch creators" }, { status: 500 });
  }
}
