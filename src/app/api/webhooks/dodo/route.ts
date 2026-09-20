import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dodoClient } from "@/lib/dodopayments";

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
      if (isProduction) {
        console.error("DODO_WEBHOOK_SECRET is not configured in production. Rejecting unverified webhook.");
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
      }

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
      const sponsorshipId =
        metadata.sponsorshipId ||
        metadata.sponsorship_id ||
        metadata.sponsorId ||
        metadata.orderId;
      const paymentId = paymentData.payment_id || paymentData.id || event.id;

      let sponsorship = null;
      if (sponsorshipId && typeof sponsorshipId === "string") {
        sponsorship = await prisma.sponsorship.findUnique({
          where: { id: sponsorshipId },
        });
      }

      // Fallback matching by email if metadata was lost
      if (!sponsorship && paymentData.customer?.email) {
        sponsorship = await prisma.sponsorship.findFirst({
          where: {
            buyerEmail: paymentData.customer.email.toLowerCase(),
            status: "PENDING",
          },
          orderBy: { createdAt: "desc" },
        });
      }

      if (sponsorship) {
        const startDate = new Date();
        const durationWeeks = sponsorship.durationWeeks || 1;
        const endDate = new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000);

        // Mark any prior active sponsorship for this creator as COMPLETED
        await prisma.sponsorship.updateMany({
          where: {
            creatorId: sponsorship.creatorId,
            status: "ACTIVE",
            id: { not: sponsorship.id },
          },
          data: { status: "COMPLETED" },
        });

        // Activate new sponsorship
        await prisma.sponsorship.update({
          where: { id: sponsorship.id },
          data: {
            status: "ACTIVE",
            startDate,
            endDate,
            dodoPaymentId: paymentId ? String(paymentId) : undefined,
          },
        });

        console.log(`[WEBHOOK] Successfully activated sponsorship ${sponsorship.id} for creator ${sponsorship.creatorId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message || "Webhook error" }, { status: 500 });
  }
}
