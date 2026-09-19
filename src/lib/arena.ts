import { prisma } from "@/lib/db";

export async function getArenaData(recordVisit: boolean = false) {
  let settings = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        id: "default",
        defaultBannerUrl: "/banner-moon.png",
        twitterHandle: "@iaadi8",
        profileName: "Aditya",
        profileBio: "SWE Intern | 21 • twitterbanner.lol",
        profileLocation: "India",
        profileWebsite: "adityacodes.site",
        followingCount: 85,
        followersCount: 109,
        totalVisits: recordVisit ? 1 : 0,
        minOutbidIncrement: 1.0,
      },
    });
  } else if (recordVisit) {
    settings = await prisma.siteSetting.update({
      where: { id: "default" },
      data: {
        totalVisits: { increment: 1 },
      },
    });
  }

  // Get currently active sponsor
  let activeSponsor = null;
  if (settings.activeSponsorId) {
    activeSponsor = await prisma.sponsor.findUnique({
      where: { id: settings.activeSponsorId },
    });
  }

  if (!activeSponsor) {
    activeSponsor = await prisma.sponsor.findFirst({
      where: { status: "ACTIVE" },
      orderBy: [{ createdAt: "desc" }],
    });
  }

  const currentPrice = activeSponsor ? activeSponsor.amountPaid : 0;
  const minIncrement = settings.minOutbidIncrement || 1.0;
  const minBidToDethrone = activeSponsor ? Math.max(1, currentPrice + minIncrement) : 1;

  // Recent banner overthrow history
  const fallenKings = await prisma.sponsor.findMany({
    where: { status: { in: ["ACTIVE", "EXPIRED"] } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Real aggregate arena metrics
  const statsAggregate = await prisma.sponsor.aggregate({
    where: { status: { in: ["ACTIVE", "EXPIRED"] } },
    _sum: { amountPaid: true, clicksCount: true },
    _count: { id: true },
    _max: { amountPaid: true },
  });

  return {
    settings: {
      ...settings,
      adminPassword: undefined,
    },
    activeSponsor,
    currentPrice,
    minBidToDethrone,
    fallenKings,
    stats: {
      totalBounties: statsAggregate._sum.amountPaid || 0,
      totalBattles: statsAggregate._count.id || 0,
      totalClicks: statsAggregate._sum.clicksCount || 0,
      recordBounty: statsAggregate._max.amountPaid || 0,
      totalVisits: settings.totalVisits || 0,
    },
  };
}
