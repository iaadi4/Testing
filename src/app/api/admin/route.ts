import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { timingSafeCompare, checkRateLimit, getClientIp, sanitizeString } from "@/lib/security";

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
        const allSponsors = await prisma.sponsor.findMany({
          orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({
          settings: {
            ...settings,
            adminPassword: undefined, // Never leak hash/password
          },
          sponsors: allSponsors,
        });
      }

      case "updateSettings": {
        const updated = await prisma.siteSetting.update({
          where: { id: "default" },
          data: {
            profileName: data.profileName ? sanitizeString(data.profileName, 50) : settings?.profileName,
            twitterHandle: data.twitterHandle ? sanitizeString(data.twitterHandle, 30) : settings?.twitterHandle,
            profileBio: data.profileBio ? sanitizeString(data.profileBio, 200) : settings?.profileBio,
            profileLocation: data.profileLocation ? sanitizeString(data.profileLocation, 50) : settings?.profileLocation,
            profileWebsite: data.profileWebsite ? sanitizeString(data.profileWebsite, 100) : settings?.profileWebsite,
            followersCount: data.followersCount !== undefined ? Math.max(0, Number(data.followersCount)) : settings?.followersCount,
            followingCount: data.followingCount !== undefined ? Math.max(0, Number(data.followingCount)) : settings?.followingCount,
            minOutbidIncrement: data.minOutbidIncrement !== undefined ? Math.max(1, Number(data.minOutbidIncrement)) : settings?.minOutbidIncrement,
            defaultBannerUrl: data.defaultBannerUrl ? sanitizeString(data.defaultBannerUrl, 500) : settings?.defaultBannerUrl,
          },
        });
        return NextResponse.json({
          success: true,
          settings: {
            ...updated,
            adminPassword: undefined,
          },
        });
      }

      case "setActiveSponsor": {
        const { sponsorId } = data;
        await prisma.siteSetting.update({
          where: { id: "default" },
          data: { activeSponsorId: sponsorId || null },
        });
        if (sponsorId) {
          await prisma.sponsor.update({
            where: { id: sponsorId },
            data: { status: "ACTIVE" },
          });
        }
        return NextResponse.json({ success: true });
      }

      case "updateSponsorStatus": {
        const { sponsorId, status } = data;
        if (!["ACTIVE", "QUEUED", "EXPIRED", "PENDING"].includes(status)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
        const updated = await prisma.sponsor.update({
          where: { id: sponsorId },
          data: { status },
        });
        return NextResponse.json({ success: true, sponsor: updated });
      }

      case "deleteSponsor": {
        const { sponsorId } = data;
        await prisma.sponsor.delete({
          where: { id: sponsorId },
        });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}
