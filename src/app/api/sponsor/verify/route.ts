import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dodoClient, isDodoConfigured } from "@/lib/dodopayments";
import { activateSponsor } from "@/lib/sponsorActivation";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const sponsor = await prisma.sponsor.findUnique({
      where: { id: orderId },
    });

    if (!sponsor) {
      return NextResponse.json({ error: "Sponsor not found" }, { status: 404 });
    }

    if (sponsor.status === "ACTIVE") {
      return NextResponse.json({ success: true, sponsor, isAlreadyActive: true });
    }

    // Check if Dodo Payments is configured in live mode
    const isLive = process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" && isDodoConfigured;

    if (isLive && dodoClient) {
      try {
        // Query recent successful payments from Dodo
        const paymentsList = await dodoClient.payments.list({
          status: "succeeded",
          page_size: 10,
        });

        // Check if there is a successful payment matching sponsorId or email
        const matchedPayment = paymentsList.items?.find((p: any) => {
          return (
            p.metadata?.sponsorId === sponsor.id ||
            p.metadata?.orderId === sponsor.id ||
            p.customer?.email?.toLowerCase() === sponsor.email.toLowerCase()
          );
        });

        if (matchedPayment) {
          const activated = await activateSponsor(sponsor.id, matchedPayment.payment_id);
          return NextResponse.json({ success: true, sponsor: activated, verifiedByApi: true });
        }
      } catch (dodoErr) {
        console.error("Dodo payment verification check error:", dodoErr);
      }

      // If webhook has not delivered yet and API check hasn't confirmed, report pending
      return NextResponse.json({ success: false, status: sponsor.status, sponsor });
    }

    // If sandbox / test mode or mock, activate immediately
    const activated = await activateSponsor(sponsor.id, `sim_${sponsor.id.slice(-8)}`);
    return NextResponse.json({ success: true, sponsor: activated });
  } catch (error: any) {
    console.error("Error verifying sponsor order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
