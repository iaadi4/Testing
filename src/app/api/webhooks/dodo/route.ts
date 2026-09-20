import { after, NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dodoClient, extractPaymentAmountCents } from "@/lib/dodopayments";
import { markPaidAwaitingApproval } from "@/lib/sponsorships";
import { emailAdvertiserReceipt, emailCreatorBookingReceived } from "@/lib/mailer";
import { revalidateMarketplace } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
    const isProduction = process.env.NODE_ENV === "production";

    let event: Record<string, unknown>;

    if (webhookSecret && dodoClient) {
      try {
        const headers: Record<string, string> = {};
        req.headers.forEach((value, key) => {
          headers[key.toLowerCase()] = value;
        });
        event = dodoClient.webhooks.unwrap(rawBody, {
          headers,
          key: webhookSecret,
        }) as unknown as Record<string, unknown>;
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    } else {
      if (isProduction) {
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
      }
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
      }
    }

    const eventType = String(event.type || event.event_type || "");
    if (eventType !== "payment.succeeded" && eventType !== "payment_intent.succeeded") {
      return NextResponse.json({ received: true });
    }

    const paymentData = (event.data || event) as Record<string, unknown>;
    const metadata = (paymentData.metadata || {}) as Record<string, string>;
    const sponsorshipId = metadata.sponsorshipId || metadata.sponsorship_id;
    const sessionId = String(
      paymentData.checkout_session_id ||
        paymentData.session_id ||
        metadata.sessionId ||
        ""
    );
    const paymentId = String(paymentData.payment_id || paymentData.id || event.id || "");

    let sponsorship = sponsorshipId
      ? await prisma.sponsorship.findUnique({ where: { id: sponsorshipId }, include: { creator: true } })
      : null;

    if (!sponsorship && sessionId) {
      sponsorship = await prisma.sponsorship.findFirst({
        where: { dodoSessionId: sessionId },
        include: { creator: true },
      });
    }

    if (!sponsorship) {
      console.warn("[WEBHOOK] No matching sponsorship for payment", paymentId);
      return NextResponse.json({ received: true });
    }

    if (sponsorship.dodoPaymentId && sponsorship.dodoPaymentId === paymentId && sponsorship.status !== "PENDING") {
      return NextResponse.json({ received: true, idempotent: true });
    }

    const reportedCents = extractPaymentAmountCents(paymentData);
    if (reportedCents !== null) {
      const expectedCents = Math.round(sponsorship.amountPaid * 100);
      if (Math.abs(reportedCents - expectedCents) > 1) {
        console.error("[WEBHOOK] Amount mismatch", { reportedCents, expectedCents, id: sponsorship.id });
        return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
      }
    }

    const updated = await markPaidAwaitingApproval(sponsorship.id, paymentId, sessionId || undefined);
    if (!updated) {
      return NextResponse.json({ received: true });
    }

    after(async () => {
      await emailAdvertiserReceipt({
        to: sponsorship.buyerEmail,
        buyerName: sponsorship.buyerName,
        brandName: sponsorship.brandName,
        creatorUsername: sponsorship.creator.username,
        amountPaid: sponsorship.amountPaid,
        durationWeeks: sponsorship.durationWeeks,
      });
      if (sponsorship.creator.payoutNotes && sponsorship.creator.payoutNotes.includes("@")) {
        await emailCreatorBookingReceived({
          to: sponsorship.creator.payoutNotes,
          creatorName: sponsorship.creator.name,
          brandName: sponsorship.brandName,
          amountPaid: sponsorship.amountPaid,
          durationWeeks: sponsorship.durationWeeks,
        });
      }
      await revalidateMarketplace(sponsorship.creator.username);
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
