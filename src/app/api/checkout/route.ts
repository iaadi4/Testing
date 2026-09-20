import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createCheckout } from "@/lib/dodopayments";
import { sanitizeString, isValidEmail, isValidHttpUrl, checkRateLimit, getClientIp, validateBannerImageUrl } from "@/lib/security";
import { getSiteUrl } from "@/lib/site";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`checkout_${ip}`, 8, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many checkout attempts. Try again in ${rate.resetInSec}s.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      creatorId,
      buyerName,
      buyerEmail,
      buyerTwitter,
      brandName,
      brandUrl,
      tagline,
      bannerImageUrl,
      durationWeeks = 1,
    } = body;

    if (!creatorId || typeof creatorId !== "string") {
      return NextResponse.json({ error: "Missing creator ID" }, { status: 400 });
    }

    if (!buyerName || !buyerEmail || !brandName || !brandUrl) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    if (!isValidEmail(buyerEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!isValidHttpUrl(brandUrl)) {
      return NextResponse.json({ error: "Invalid brand URL" }, { status: 400 });
    }

    const banner = validateBannerImageUrl(bannerImageUrl);
    if (!banner.ok) {
      return NextResponse.json({ error: banner.error }, { status: 400 });
    }

    const weeks = Math.max(1, Math.min(12, parseInt(String(durationWeeks), 10) || 1));

    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator || creator.removedAt) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    if (!creator.isListingActive) {
      return NextResponse.json({ error: "This creator is currently not accepting banner sponsorships" }, { status: 400 });
    }

    const totalAmount = creator.weeklyPrice * weeks;

    const sponsorship = await prisma.sponsorship.create({
      data: {
        creatorId: creator.id,
        buyerName: sanitizeString(buyerName, 100),
        buyerEmail: buyerEmail.trim().toLowerCase(),
        buyerTwitter: buyerTwitter ? sanitizeString(buyerTwitter, 50).replace("@", "") : null,
        brandName: sanitizeString(brandName, 100),
        brandUrl: brandUrl.trim(),
        tagline: tagline ? sanitizeString(tagline, 200) : null,
        bannerImageUrl: banner.value,
        durationWeeks: weeks,
        amountPaid: totalAmount,
        status: "PENDING",
      },
    });

    const appUrl = getSiteUrl() || req.nextUrl.origin;
    const returnUrl = `${appUrl}/sponsor/success?sponsorship_id=${sponsorship.id}`;

    const { checkoutUrl, isMock, sessionId } = await createCheckout({
      sponsorshipId: sponsorship.id,
      creatorId: creator.id,
      buyerName: sponsorship.buyerName,
      buyerEmail: sponsorship.buyerEmail,
      amount: totalAmount,
      durationWeeks: weeks,
      returnUrl,
    });

    if (sessionId) {
      await prisma.sponsorship.update({
        where: { id: sponsorship.id },
        data: { dodoSessionId: sessionId },
      });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl,
      sponsorshipId: sponsorship.id,
      isMock,
    });
  } catch (error: unknown) {
    console.error("Checkout creation error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
