import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dodoClient } from "@/lib/dodopayments";
import { activateSponsor } from "@/lib/sponsorActivation";

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
      // In production, reject if secret is missing
      if (isProduction) {
        console.error("DODO_WEBHOOK_SECRET is not configured in production. Rejecting unverified webhook.");
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
      }

      // Local development fallback
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
      const sponsorId =
        metadata.sponsorId ||
        metadata.sponsor_id ||
        metadata.orderId ||
        metadata.order_id ||
        metadata.id;
      const paymentId = paymentData.payment_id || paymentData.id || event.id;

      let sponsor = null;
      if (sponsorId && typeof sponsorId === "string") {
        sponsor = await prisma.sponsor.findUnique({
          where: { id: sponsorId },
        });
      }

      // Fallback: If sponsorId is not in metadata, look up the most recent PENDING sponsor by customer email
      if (!sponsor && paymentData.customer?.email) {
        sponsor = await prisma.sponsor.findFirst({
          where: {
            email: String(paymentData.customer.email).trim().toLowerCase(),
            status: "PENDING",
          },
          orderBy: { createdAt: "desc" },
        });
      }

      if (!sponsor) {
        console.warn("Dodo webhook: No matching pending sponsor found for payload:", paymentData);
        return NextResponse.json({ received: true, warning: "Sponsor not found" }, { status: 200 });
      }

      // Activate sponsor and dethrone previous king
      const activated = await activateSponsor(sponsor.id, paymentId);
      console.log(`Dodo webhook: Sponsor ${sponsor.id} (${sponsor.companyName}) activated successfully!`);

      return NextResponse.json({ received: true, activated: Boolean(activated) }, { status: 200 });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Dodo webhook processing error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
