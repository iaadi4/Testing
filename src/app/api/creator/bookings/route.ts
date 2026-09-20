import { after, NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { approveSponsorship, rejectSponsorship } from "@/lib/sponsorships";
import { emailAdvertiserDecision } from "@/lib/mailer";
import { revalidateMarketplace } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, sponsorshipId } = await req.json();
  if (!sponsorshipId || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const updated =
    action === "approve"
      ? await approveSponsorship(sponsorshipId, user.id)
      : await rejectSponsorship(sponsorshipId, user.id);

  if (!updated) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  after(async () => {
    await emailAdvertiserDecision({
      to: updated.buyerEmail,
      buyerName: updated.buyerName,
      brandName: updated.brandName,
      creatorUsername: user.username,
      approved: action === "approve",
    });
    await revalidateMarketplace(user.username);
  });

  return NextResponse.json({
    success: true,
    sponsorship: {
      id: updated.id,
      status: updated.status,
      refundDue: updated.refundDue,
    },
  });
}
