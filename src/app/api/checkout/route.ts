import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createCheckout } from "@/lib/dodopayments";
import { sanitizeString, isValidEmail, isValidHttpUrl } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
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

    // Validation
    if (!creatorId || typeof creatorId !== "string") {
      return NextResponse.json({ error: "Missing creator ID" }, { status: 400 });
    }

    if (!buyerName || !buyerEmail || !brandName || !brandUrl || !bannerImageUrl) {
      return NextResponse.json({ error: "Please fill in all required fields" }, { status: 400 });
    }

    if (!isValidEmail(buyerEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!isValidHttpUrl(brandUrl)) {
      return NextResponse.json({ error: "Invalid brand URL" }, { status: 400 });
    }

    const weeks = Math.max(1, Math.min(12, parseInt(String(durationWeeks), 10) || 1));

    // Verify creator exists and is accepting sponsors
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    if (!creator.isListingActive) {
      return NextResponse.json({ error: "This creator is currently not accepting banner sponsorships" }, { status: 400 });
    }

    const totalAmount = creator.weeklyPrice * weeks;

    // Create pending sponsorship record
    const sponsorship = await prisma.sponsorship.create({
      data: {
        creatorId: creator.id,
        buyerName: sanitizeString(buyerName, 100),
        buyerEmail: buyerEmail.trim().toLowerCase(),
        buyerTwitter: buyerTwitter ? sanitizeString(buyerTwitter, 50).replace("@", "") : null,
        brandName: sanitizeString(brandName, 100),
        brandUrl: brandUrl.trim(),
        tagline: tagline ? sanitizeString(tagline, 200) : null,
        bannerImageUrl,
        durationWeeks: weeks,
        amountPaid: totalAmount,
        status: "PENDING",
      },
    });

    const appUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin;

    const returnUrl = `${appUrl}/sponsor/success?sponsorship_id=${sponsorship.id}`;

    const { checkoutUrl, isMock } = await createCheckout({
      sponsorshipId: sponsorship.id,
      creatorId: creator.id,
      buyerName: sponsorship.buyerName,
      buyerEmail: sponsorship.buyerEmail,
      amount: totalAmount,
      durationWeeks: weeks,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl,
      sponsorshipId: sponsorship.id,
      isMock,
    });
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout" }, { status: 500 });
  }
}
