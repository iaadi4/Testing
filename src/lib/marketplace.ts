import { after } from "next/server";
import { prisma } from "@/lib/db";
import { PAID_STATUSES } from "@/lib/site";

export interface GetMarketplaceOptions {
  category?: string;
  search?: string;
  sortBy?: "followers" | "price_asc" | "price_desc" | "newest";
  recordVisit?: boolean;
}

const liveCreatorWhere = {
  isListingActive: true,
  removedAt: null,
};

function bannerPath(sponsorshipId?: string | null) {
  return sponsorshipId ? `/api/banner/${sponsorshipId}` : "/banner.png";
}

export async function getMarketplaceData(options: GetMarketplaceOptions = {}) {
  const { category, search, sortBy = "followers", recordVisit = false } = options;

  if (recordVisit) {
    after(async () => {
      await prisma.siteSetting
        .update({
          where: { id: "default" },
          data: { totalVisits: { increment: 1 } },
        })
        .catch(() => {});
    });
  }

  const where: Record<string, unknown> = { ...liveCreatorWhere };

  if (category && category !== "All") {
    where.category = category;
  }

  if (search && search.trim() !== "") {
    const q = search.trim();
    where.OR = [
      { username: { contains: q.toLowerCase(), mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { bio: { contains: q, mode: "insensitive" } },
    ];
  }

  let orderBy: Record<string, "asc" | "desc">[] = [{ followersCount: "desc" }];
  if (sortBy === "price_asc") orderBy = [{ weeklyPrice: "asc" }];
  else if (sortBy === "price_desc") orderBy = [{ weeklyPrice: "desc" }];
  else if (sortBy === "newest") orderBy = [{ createdAt: "desc" }];

  const [creators, totalCreators, totalReachAggregate, totalBookingsAggregate, settings] =
    await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
          bio: true,
          location: true,
          website: true,
          followersCount: true,
          followingCount: true,
          isVerified: true,
          weeklyPrice: true,
          isListingActive: true,
          category: true,
          defaultBannerUrl: true,
          sponsorships: {
            where: {
              status: "ACTIVE",
              endDate: { gte: new Date() },
            },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: {
              id: true,
              brandName: true,
              brandUrl: true,
            },
          },
        },
      }),
      prisma.user.count({ where: liveCreatorWhere }),
      prisma.user.aggregate({
        where: liveCreatorWhere,
        _sum: { followersCount: true },
      }),
      prisma.sponsorship.aggregate({
        where: { status: { in: [...PAID_STATUSES] } },
        _sum: { amountPaid: true, clicksCount: true },
        _count: { id: true },
      }),
      prisma.siteSetting.findUnique({ where: { id: "default" } }),
    ]);

  return {
    creators: creators.map((c) => {
      const active = c.sponsorships[0] || null;
      return {
        id: c.id,
        username: c.username,
        name: c.name,
        avatarUrl: c.avatarUrl,
        bio: c.bio,
        location: c.location,
        website: c.website,
        followersCount: c.followersCount,
        followingCount: c.followingCount,
        isVerified: c.isVerified,
        weeklyPrice: c.weeklyPrice,
        isListingActive: c.isListingActive,
        category: c.category,
        defaultBannerUrl: c.defaultBannerUrl,
        bannerSrc: active ? bannerPath(active.id) : c.defaultBannerUrl || "/banner.png",
        activeSponsorship: active
          ? {
              id: active.id,
              brandName: active.brandName,
              brandUrl: active.brandUrl,
              hasBanner: true,
            }
          : null,
      };
    }),
    stats: {
      totalCreators,
      totalAudienceReach: totalReachAggregate._sum.followersCount || 0,
      totalBookings: totalBookingsAggregate._count.id || 0,
      totalGmv: totalBookingsAggregate._sum.amountPaid || 0,
      totalClicks: totalBookingsAggregate._sum.clicksCount || 0,
      totalVisits: settings?.totalVisits || 0,
    },
  };
}

export async function getCreatorProfile(username: string) {
  const cleanUsername = username.toLowerCase().replace("@", "");

  const creator = await prisma.user.findUnique({
    where: { username: cleanUsername },
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      bio: true,
      location: true,
      website: true,
      followersCount: true,
      followingCount: true,
      isVerified: true,
      weeklyPrice: true,
      isListingActive: true,
      category: true,
      defaultBannerUrl: true,
      removedAt: true,
      sponsorships: {
        where: { status: { in: ["ACTIVE", "COMPLETED"] } },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          status: true,
          brandName: true,
          brandUrl: true,
          tagline: true,
          startDate: true,
          endDate: true,
          clicksCount: true,
        },
      },
    },
  });

  if (!creator || creator.removedAt) return null;

  const now = new Date();
  const activeSponsorship = creator.sponsorships.find(
    (s) => s.status === "ACTIVE" && s.endDate && s.endDate >= now
  );

  const pastSponsorships = creator.sponsorships
    .filter((s) => s.id !== activeSponsorship?.id)
    .map((s) => ({
      ...s,
      hasBanner: true,
      bannerSrc: bannerPath(s.id),
    }));

  return {
    creator: {
      id: creator.id,
      username: creator.username,
      name: creator.name,
      avatarUrl: creator.avatarUrl,
      bio: creator.bio,
      location: creator.location,
      website: creator.website,
      followersCount: creator.followersCount,
      followingCount: creator.followingCount,
      isVerified: creator.isVerified,
      weeklyPrice: creator.weeklyPrice,
      isListingActive: creator.isListingActive,
      category: creator.category,
      defaultBannerUrl: creator.defaultBannerUrl,
    },
    activeSponsorship: activeSponsorship
      ? {
          ...activeSponsorship,
          hasBanner: true,
          bannerSrc: bannerPath(activeSponsorship.id),
        }
      : null,
    pastSponsorships,
    isThin: !creator.bio || !creator.isListingActive,
  };
}
