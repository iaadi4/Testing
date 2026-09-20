import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { timingSafeCompare, checkRateLimit, getClientIp } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const body = await req.json();
    const { action, password, ...data } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    // Rate-limit password attempts: 10 per 15 minutes per IP
    const rateLimit = checkRateLimit(`admin_auth_${ip}`, 10, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${rateLimit.resetInSec}s.` },
        { status: 429 }
      );
    }

    const settings = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });

    const expectedPassword = process.env.ADMIN_PASSWORD || settings?.adminPassword || "admin123";

    if (!timingSafeCompare(password, expectedPassword)) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    switch (action) {
      case "getData": {
        const creators = await prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: { sponsorships: true },
            },
          },
        });

        const sponsorships = await prisma.sponsorship.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            creator: {
              select: { username: true, name: true },
            },
          },
        });

        const totalGmv = sponsorships
          .filter((s) => s.status === "ACTIVE" || s.status === "COMPLETED")
          .reduce((acc, s) => acc + (s.amountPaid || 0), 0);

        return NextResponse.json({
          settings: {
            ...settings,
            adminPassword: undefined,
          },
          creators,
          sponsorships,
          metrics: {
            totalCreators: creators.length,
            totalBookings: sponsorships.length,
            totalGmv,
          },
        });
      }

      case "toggleCreatorActive": {
        const { creatorId, isListingActive } = data;
        const updated = await prisma.user.update({
          where: { id: creatorId },
          data: { isListingActive: Boolean(isListingActive) },
        });
        return NextResponse.json({ success: true, creator: updated });
      }

      case "updateCreator": {
        const { creatorId, weeklyPrice, category, isVerified } = data;
        const updateData: any = {};
        if (weeklyPrice !== undefined) updateData.weeklyPrice = Number(weeklyPrice);
        if (category !== undefined) updateData.category = String(category);
        if (isVerified !== undefined) updateData.isVerified = Boolean(isVerified);

        const updated = await prisma.user.update({
          where: { id: creatorId },
          data: updateData,
        });
        return NextResponse.json({ success: true, creator: updated });
      }

      case "updateSponsorshipStatus": {
        const { sponsorshipId, status } = data;
        if (!["ACTIVE", "PENDING", "COMPLETED", "CANCELLED"].includes(status)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
        const updated = await prisma.sponsorship.update({
          where: { id: sponsorshipId },
          data: { status },
        });
        return NextResponse.json({ success: true, sponsorship: updated });
      }

      case "deleteSponsorship": {
        const { sponsorshipId } = data;
        await prisma.sponsorship.delete({
          where: { id: sponsorshipId },
        });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: error.message || "Operation failed" }, { status: 500 });
  }
}
