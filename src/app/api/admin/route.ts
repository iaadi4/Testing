import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp, sanitizeString } from "@/lib/security";
import {
  attachAdminCookie,
  clearAdminCookie,
  createAdminToken,
  isAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/adminAuth";
import { SPONSORSHIP_STATUSES, PAID_STATUSES } from "@/lib/site";
import { revalidateMarketplace } from "@/lib/revalidate";

export const runtime = "nodejs";

const CREATOR_SELECT = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
  followersCount: true,
  weeklyPrice: true,
  category: true,
  isVerified: true,
  isListingActive: true,
  removedAt: true,
  createdAt: true,
  _count: { select: { sponsorships: true } },
} as const;

const TX_SELECT = {
  id: true,
  creatorId: true,
  buyerName: true,
  buyerEmail: true,
  brandName: true,
  brandUrl: true,
  durationWeeks: true,
  amountPaid: true,
  status: true,
  startDate: true,
  endDate: true,
  dodoPaymentId: true,
  dodoSessionId: true,
  clicksCount: true,
  refundDue: true,
  createdAt: true,
  approvedAt: true,
  rejectedAt: true,
  creator: { select: { username: true, name: true } },
} as const;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, password, ...data } = body;

    if (action === "login") {
      const ip = getClientIp(req);
      const rateLimit = checkRateLimit(`admin_auth_${ip}`, 10, 15 * 60 * 1000);
      if (!rateLimit.allowed) {
        return NextResponse.json(
          { error: `Too many attempts. Please try again in ${rateLimit.resetInSec}s.` },
          { status: 429 }
        );
      }
      if (!password || typeof password !== "string" || !(await verifyAdminPassword(password))) {
        return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
      }
      const token = await createAdminToken();
      const res = NextResponse.json({ success: true });
      attachAdminCookie(res, token);
      return res;
    }

    if (action === "logout") {
      const res = NextResponse.json({ success: true });
      clearAdminCookie(res);
      return res;
    }

    if (!(await isAdminAuthenticated())) {
      return unauthorized();
    }

    switch (action) {
      case "getData": {
        const page = Math.max(1, parseInt(String(data.page || 1), 10));
        const pageSize = Math.min(50, Math.max(10, parseInt(String(data.pageSize || 25), 10)));
        const status = typeof data.status === "string" ? data.status : "";
        const creatorId = typeof data.creatorId === "string" ? data.creatorId : "";
        const search = typeof data.search === "string" ? data.search.trim() : "";
        const refundDue = data.refundDue === true;

        const txWhere: Record<string, unknown> = {};
        if (status && SPONSORSHIP_STATUSES.includes(status as never)) txWhere.status = status;
        if (creatorId) txWhere.creatorId = creatorId;
        if (refundDue) txWhere.refundDue = true;
        if (search) {
          txWhere.OR = [
            { brandName: { contains: search, mode: "insensitive" } },
            { buyerEmail: { contains: search, mode: "insensitive" } },
            { dodoPaymentId: { contains: search, mode: "insensitive" } },
            { creator: { username: { contains: search.toLowerCase(), mode: "insensitive" } } },
          ];
        }

        const [creators, sponsorships, totalTransactions, paid] = await Promise.all([
          prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: CREATOR_SELECT,
          }),
          prisma.sponsorship.findMany({
            where: txWhere,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: TX_SELECT,
          }),
          prisma.sponsorship.count({ where: txWhere }),
          prisma.sponsorship.aggregate({
            where: { status: { in: [...PAID_STATUSES] } },
            _sum: { amountPaid: true },
            _count: { id: true },
          }),
        ]);

        const perCreator = await prisma.sponsorship.groupBy({
          by: ["creatorId"],
          _count: { id: true },
          _sum: { amountPaid: true },
          where: { status: { in: [...PAID_STATUSES] } },
        });
        const statsByCreator = Object.fromEntries(
          perCreator.map((row) => [
            row.creatorId,
            { bookingCount: row._count.id, gmv: row._sum.amountPaid || 0 },
          ])
        );

        return NextResponse.json({
          creators: creators.map((c) => ({
            ...c,
            bookingCount: statsByCreator[c.id]?.bookingCount || 0,
            gmv: statsByCreator[c.id]?.gmv || 0,
          })),
          sponsorships: sponsorships.map((s) => ({
            ...s,
            hasBanner: true,
          })),
          page,
          pageSize,
          totalTransactions,
          metrics: {
            totalCreators: creators.length,
            totalBookings: paid._count.id,
            totalGmv: paid._sum.amountPaid || 0,
            refundDue: await prisma.sponsorship.count({ where: { refundDue: true } }),
          },
        });
      }

      case "toggleCreatorActive": {
        const updated = await prisma.user.update({
          where: { id: data.creatorId },
          data: { isListingActive: Boolean(data.isListingActive) },
          select: CREATOR_SELECT,
        });
        await revalidateMarketplace(updated.username);
        return NextResponse.json({ success: true, creator: updated });
      }

      case "updateCreator": {
        const updateData: Record<string, unknown> = {};
        if (data.weeklyPrice !== undefined) updateData.weeklyPrice = Number(data.weeklyPrice);
        if (data.category !== undefined) updateData.category = sanitizeString(data.category, 50);
        if (data.isVerified !== undefined) updateData.isVerified = Boolean(data.isVerified);
        const updated = await prisma.user.update({
          where: { id: data.creatorId },
          data: updateData,
          select: CREATOR_SELECT,
        });
        await revalidateMarketplace(updated.username);
        return NextResponse.json({ success: true, creator: updated });
      }

      case "removeCreator": {
        const updated = await prisma.user.update({
          where: { id: data.creatorId },
          data: { removedAt: new Date(), isListingActive: false },
          select: CREATOR_SELECT,
        });
        await revalidateMarketplace(updated.username);
        return NextResponse.json({ success: true, creator: updated });
      }

      case "restoreCreator": {
        const updated = await prisma.user.update({
          where: { id: data.creatorId },
          data: { removedAt: null },
          select: CREATOR_SELECT,
        });
        await revalidateMarketplace(updated.username);
        return NextResponse.json({ success: true, creator: updated });
      }

      case "updateSponsorshipStatus": {
        if (!SPONSORSHIP_STATUSES.includes(data.status)) {
          return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }
        const updated = await prisma.sponsorship.update({
          where: { id: data.sponsorshipId },
          data: { status: data.status },
          select: TX_SELECT,
        });
        return NextResponse.json({ success: true, sponsorship: updated });
      }

      case "deleteSponsorship": {
        await prisma.sponsorship.delete({ where: { id: data.sponsorshipId } });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin API error:", error);
    const message = error instanceof Error ? error.message : "Operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
