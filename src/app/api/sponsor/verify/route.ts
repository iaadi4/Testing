import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { dodoClient, isDodoConfigured } from "@/lib/dodopayments";

export async function POST(req: NextRequest) {
  try {
    const { sponsorshipId } = await req.json();

    if (!sponsorshipId) {
      return NextResponse.json({ error: "Missing sponsorshipId" }, { status: 400 });
    }

    const sponsorship = await prisma.sponsorship.findUnique({
      where: { id: sponsorshipId },
      include: { creator: true },
    });

    if (!sponsorship) {
      return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 });
    }

    // If already active, return immediately
    if (sponsorship.status === "ACTIVE") {
      return NextResponse.json({
        success: true,
        status: "ACTIVE",
        sponsorship,
      });
    }

    // In dev / test / mock mode, auto-activate
    const isTestMode =
      process.env.NODE_ENV !== "production" ||
      !isDodoConfigured ||
      process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode";

    if (isTestMode) {
      const startDate = new Date();
      const durationWeeks = sponsorship.durationWeeks || 1;
      const endDate = new Date(startDate.getTime() + durationWeeks * 7 * 24 * 60 * 60 * 1000);

      await prisma.sponsorship.updateMany({
        where: {
          creatorId: sponsorship.creatorId,
          status: "ACTIVE",
          id: { not: sponsorship.id },
        },
        data: { status: "COMPLETED" },
      });

      const updated = await prisma.sponsorship.update({
        where: { id: sponsorship.id },
        data: {
          status: "ACTIVE",
          startDate,
          endDate,
          dodoPaymentId: `sim_${Date.now()}`,
        },
        include: { creator: true },
      });

      return NextResponse.json({
        success: true,
        status: "ACTIVE",
        sponsorship: updated,
      });
    }

    return NextResponse.json({
      success: false,
      status: sponsorship.status,
      message: "Payment still pending webhook verification",
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
