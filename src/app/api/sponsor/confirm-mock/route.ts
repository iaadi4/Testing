import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isDodoConfigured } from "@/lib/dodopayments";

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
  // CRITICAL: Strictly disable mock confirmation in production or live mode
  const isProduction = process.env.NODE_ENV === "production";
  const isLiveDodo = process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" && isDodoConfigured;

  if (isProduction || isLiveDodo) {
    return NextResponse.json(
      { error: "Mock confirmation is strictly disabled in production / live mode" },
      { status: 403 }
    );
  }

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

    const startDate = new Date();
    const endDate = calculateEndDate(sponsor.durationType, startDate);

    const settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });

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
      }
    }

    const updated = await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: {
        status: "ACTIVE",
        startDate,
        endDate,
        dodoPaymentId: `sim_${Date.now()}`,
      },
    });

    await prisma.siteSetting.update({
      where: { id: "default" },
      data: { activeSponsorId: updated.id },
    });

    return NextResponse.json({
      success: true,
      sponsor: updated,
    });
  } catch (error: any) {
    console.error("Mock confirm error:", error);
    return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
  }
}
