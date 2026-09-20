import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidHttpUrl, checkRateLimit, getClientIp } from "@/lib/security";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sponsorshipId = searchParams.get("id");

  if (!sponsorshipId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id: sponsorshipId },
    });

    if (!sponsorship || !isValidHttpUrl(sponsorship.brandUrl)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Rate-limit click counting: only count 1 click per IP per sponsorship every 30 seconds
    const ip = getClientIp(req);
    const clickLimit = checkRateLimit(`click_${sponsorshipId}_${ip}`, 1, 30 * 1000);

    if (clickLimit.allowed) {
      await prisma.sponsorship.update({
        where: { id: sponsorshipId },
        data: { clicksCount: { increment: 1 } },
      });
    }

    return NextResponse.redirect(sponsorship.brandUrl);
  } catch (error) {
    console.error("Click redirect error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
