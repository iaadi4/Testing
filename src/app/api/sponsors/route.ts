import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createCheckout } from "@/lib/dodopayments";
import { 
  checkRateLimit, 
  getClientIp, 
  isValidEmail, 
  isValidHttpUrl, 
  sanitizeString 
} from "@/lib/security";

import { getArenaData } from "@/lib/arena";

export async function GET(req: NextRequest) {
  try {
    const recordVisit = req.nextUrl.searchParams.get("record_visit") === "1";
    const data = await getArenaData(recordVisit);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Error fetching arena sponsors:", error);
    return NextResponse.json({ error: "Failed to fetch arena sponsors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 20 bid attempts per 10 minutes per IP
    const rateLimit = checkRateLimit(`sponsor_bid_${ip}`, 20, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many bid attempts. Cool down for a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      companyName,
      logoUrl,
      tagline,
      websiteUrl,
      twitterHandle,
      email,
      bannerImageUrl,
      bidAmount,
    } = body;

    // Strict validation
    if (!companyName || !websiteUrl || !email || !bannerImageUrl) {
      return NextResponse.json(
        { error: "Please provide Company Name, Website URL, Email, and Banner Image." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address for receipt and notifications." },
        { status: 400 }
      );
    }

    const cleanWebsite = websiteUrl.trim().startsWith("http") ? websiteUrl.trim() : `https://${websiteUrl.trim()}`;
    if (!isValidHttpUrl(cleanWebsite)) {
      return NextResponse.json(
        { error: "Please enter a valid destination URL (e.g. https://yourcompany.com)" },
        { status: 400 }
      );
    }

    // Determine required minimum bid
    const settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });

    let currentActive = null;
    if (settings?.activeSponsorId) {
      currentActive = await prisma.sponsor.findUnique({
        where: { id: settings.activeSponsorId },
      });
    }

    const currentPrice = currentActive ? currentActive.amountPaid : 0;
    const requiredMin = currentActive ? Math.max(1, currentPrice + 1) : 1;

    const parsedBid = typeof bidAmount === "number" ? bidAmount : parseFloat(bidAmount);
    if (isNaN(parsedBid) || parsedBid < requiredMin) {
      return NextResponse.json(
        { error: `Strike bid must be at least $${requiredMin.toFixed(2)} to overthrow the banner!` },
        { status: 400 }
      );
    }

    if (parsedBid > 100000) {
      return NextResponse.json(
        { error: "Bid exceeds maximum arena threshold ($100,000)." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const cleanCompanyName = sanitizeString(companyName, 80);
    const cleanTagline = tagline ? sanitizeString(tagline, 140) : null;
    const cleanTwitter = twitterHandle ? sanitizeString(twitterHandle.replace(/^@/, ""), 30) : null;
    const cleanBanner = sanitizeString(bannerImageUrl, 4000000); // 4MB data URL or external URL
    const cleanLogo = logoUrl ? sanitizeString(logoUrl, 2000000) : null;

    // Create pending sponsor record
    const sponsor = await prisma.sponsor.create({
      data: {
        companyName: cleanCompanyName,
        logoUrl: cleanLogo,
        tagline: cleanTagline,
        websiteUrl: cleanWebsite,
        twitterHandle: cleanTwitter,
        email: email.trim().toLowerCase(),
        bannerImageUrl: cleanBanner,
        durationType: "OUTBID",
        amountPaid: Math.round(parsedBid * 100) / 100,
        status: "PENDING",
      },
    });

    const rawOrigin = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || req.headers.get("origin") || req.headers.get("referer") || "https://twitterbanner.lol";
    let origin = "https://twitterbanner.lol";
    try {
      origin = new URL(rawOrigin).origin;
    } catch {
      origin = "https://twitterbanner.lol";
    }
    const returnUrl = `${origin}/sponsor/success?order_id=${sponsor.id}`;

    const { checkoutUrl, isMock } = await createCheckout({
      sponsorId: sponsor.id,
      companyName: sponsor.companyName,
      email: sponsor.email,
      amount: sponsor.amountPaid,
      durationType: "OUTBID",
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      sponsorId: sponsor.id,
      checkoutUrl,
      isMock,
      amount: sponsor.amountPaid,
    });
  } catch (error: any) {
    console.error("Error initiating banner takeover:", error);
    return NextResponse.json({ error: error.message || "Failed to process takeover bid" }, { status: 500 });
  }
}
