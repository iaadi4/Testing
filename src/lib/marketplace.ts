import { prisma } from "@/lib/db";

export interface GetMarketplaceOptions {
  category?: string;
  search?: string;
  sortBy?: "followers" | "price_asc" | "price_desc" | "newest";
}

export async function getMarketplaceData(options: GetMarketplaceOptions = {}) {
  const { category, search, sortBy = "followers" } = options;

  const where: any = {
    isListingActive: true,
  };

  if (category && category !== "All") {
    where.category = category;
  }

  if (search && search.trim() !== "") {
    where.OR = [
      { username: { contains: search.trim().toLowerCase(), mode: "insensitive" } },
      { name: { contains: search.trim(), mode: "insensitive" } },
      { bio: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  let orderBy: any = [{ followersCount: "desc" }];
  if (sortBy === "price_asc") {
    orderBy = [{ weeklyPrice: "asc" }];
  } else if (sortBy === "price_desc") {
    orderBy = [{ weeklyPrice: "desc" }];
  } else if (sortBy === "newest") {
    orderBy = [{ createdAt: "desc" }];
  }

  const creators = await prisma.user.findMany({
    where,
    orderBy,
    include: {
      sponsorships: {
        where: {
          status: "ACTIVE",
          endDate: { gte: new Date() },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  // Calculate platform metrics
  const totalCreators = await prisma.user.count({ where: { isListingActive: true } });
  const totalReachAggregate = await prisma.user.aggregate({
    _sum: { followersCount: true },
  });

  const totalBookingsAggregate = await prisma.sponsorship.aggregate({
    where: { status: { in: ["ACTIVE", "COMPLETED"] } },
    _sum: { amountPaid: true, clicksCount: true },
    _count: { id: true },
  });

  const settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  return {
    creators: creators.map((c) => ({
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
      activeSponsorship: c.sponsorships[0] || null,
    })),
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
    include: {
      sponsorships: {
        where: {
          status: { in: ["ACTIVE", "COMPLETED"] },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!creator) return null;

  const now = new Date();
  const activeSponsorship = creator.sponsorships.find(
    (s) => s.status === "ACTIVE" && s.endDate && s.endDate >= now
  );

  const pastSponsorships = creator.sponsorships.filter(
    (s) => s.id !== activeSponsorship?.id
  );

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
    activeSponsorship: activeSponsorship || null,
    pastSponsorships,
  };
}
