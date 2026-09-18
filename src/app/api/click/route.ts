import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidHttpUrl, checkRateLimit, getClientIp } from "@/lib/security";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sponsorId = searchParams.get("id");

  if (!sponsorId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id: sponsorId },
    });

    if (!sponsor || !isValidHttpUrl(sponsor.websiteUrl)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Rate-limit click counting: only count 1 click per IP per sponsor every 30 seconds
    const ip = getClientIp(req);
    const clickLimit = checkRateLimit(`click_${sponsorId}_${ip}`, 1, 30 * 1000);

    if (clickLimit.allowed) {
      await prisma.sponsor.update({
        where: { id: sponsorId },
        data: { clicksCount: { increment: 1 } },
      });
    }

    return NextResponse.redirect(sponsor.websiteUrl);
  } catch (error) {
    console.error("Click redirect error:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
