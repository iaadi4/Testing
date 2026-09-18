import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dodoClient } from "@/lib/dodopayments";

function calculateEndDate(durationType: string, startDate: Date = new Date()): Date {
  const end = new Date(startDate);
  switch (durationType) {
    case "WEEK":
      end.setDate(end.getDate() + 7);
      break;
    case "MONTH":
      end.setDate(end.getDate() + 30);
      break;
    case "YEAR":
      end.setDate(end.getDate() + 365);
      break;
    case "LIFETIME":
      end.setFullYear(end.getFullYear() + 100);
      break;
    case "OUTBID":
    default:
      end.setDate(end.getDate() + 7);
      break;
  }
  return end;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    let event: any;

    if (webhookSecret && dodoClient) {
      try {
        const headers: Record<string, string> = {};
        req.headers.forEach((value, key) => {
          headers[key.toLowerCase()] = value;
        });

        event = dodoClient.webhooks.unwrap(rawBody, {
          headers,
          key: webhookSecret,
        });
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    } else {
      // In production, NEVER accept unverified webhooks
      if (isProduction) {
        console.error("DODO_WEBHOOK_SECRET is not configured in production. Rejecting unverified webhook.");
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
      }

      // Only in local development fallback
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    const eventType = event.type || event.event_type;

    if (eventType === "payment.succeeded" || eventType === "payment_intent.succeeded") {
      const paymentData = event.data || event;
      const metadata = paymentData.metadata || {};
      const sponsorId = metadata.sponsorId;
      const paymentId = paymentData.payment_id || paymentData.id;

      if (!sponsorId || typeof sponsorId !== "string") {
        return NextResponse.json({ received: true, warning: "Missing sponsorId" }, { status: 200 });
      }

      const sponsor = await prisma.sponsor.findUnique({
        where: { id: sponsorId },
      });

      if (!sponsor) {
        return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
      }

      // Idempotency: If already active with this payment ID, avoid duplicate processing
      if (sponsor.status === "ACTIVE" && sponsor.dodoPaymentId === paymentId) {
        return NextResponse.json({ received: true, message: "Already processed" }, { status: 200 });
      }

      const startDate = new Date();
      const endDate = calculateEndDate(sponsor.durationType, startDate);

      const settings = await prisma.siteSetting.findUnique({
        where: { id: "default" },
      });

      let shouldMakeActive = true;
      if (settings?.activeSponsorId && settings.activeSponsorId !== sponsor.id) {
        const currentActive = await prisma.sponsor.findUnique({
          where: { id: settings.activeSponsorId },
        });

        if (currentActive && (sponsor.durationType === "OUTBID" || sponsor.amountPaid >= currentActive.amountPaid)) {
          await prisma.sponsor.update({
            where: { id: currentActive.id },
            data: {
              isOutbid: true,
              outbidById: sponsor.id,
              status: "EXPIRED",
            },
          });
          shouldMakeActive = true;
        }
      }

      await prisma.sponsor.update({
        where: { id: sponsor.id },
        data: {
          status: shouldMakeActive ? "ACTIVE" : "QUEUED",
          startDate,
          endDate,
          dodoPaymentId: paymentId ? String(paymentId) : null,
        },
      });

      if (shouldMakeActive) {
        await prisma.siteSetting.update({
          where: { id: "default" },
          data: { activeSponsorId: sponsor.id },
        });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Dodo webhook processing error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
