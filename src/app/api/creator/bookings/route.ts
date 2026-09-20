import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { approveSponsorship, rejectSponsorship } from "@/lib/sponsorships";
import { revalidateMarketplace } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.removedAt) {
    return NextResponse.json(
      { error: "This creator account has been removed from the marketplace." },
      { status: 403 }
    );
  }

  try {
    const { sponsorshipId, action } = await req.json();

    if (!sponsorshipId || typeof sponsorshipId !== "string") {
      return NextResponse.json({ error: "Missing sponsorshipId" }, { status: 400 });
    }
    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result =
      action === "approve"
        ? await approveSponsorship(sponsorshipId, user.id)
        : await rejectSponsorship(sponsorshipId, user.id);

    if (!result) {
      return NextResponse.json(
        { error: "Booking not found or not yours to review" },
        { status: 404 }
      );
    }

    await revalidateMarketplace(user.username);

    return NextResponse.json({ success: true, status: result.status });
  } catch (error) {
    console.error("Creator bookings error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
