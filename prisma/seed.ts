import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Initialize SiteSetting
  await prisma.siteSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      platformFeePercent: 0.0,
      featuredUsernames: "iaadi8",
      adminPassword: process.env.ADMIN_PASSWORD || "admin123",
      totalVisits: 0,
    },
  });

  // 2. Real creator: @iaadi8
  await prisma.user.upsert({
    where: { username: "iaadi8" },
    update: {
      name: "Aditya",
      avatarUrl: "/avatar.png",
      bio: "SWE Intern | 21 • twitterbanner.lol",
      location: "India",
      website: "https://adityacodes.site",
      followersCount: 111,
      followingCount: 85,
      isVerified: true,
      weeklyPrice: 29.0,
      isListingActive: true,
      category: "Tech & Dev",
      defaultBannerUrl: "/banner.png",
      role: "ADMIN",
    },
    create: {
      twitterId: "1234567890",
      username: "iaadi8",
      name: "Aditya",
      avatarUrl: "/avatar.png",
      bio: "SWE Intern | 21 • twitterbanner.lol",
      location: "India",
      website: "https://adityacodes.site",
      followersCount: 111,
      followingCount: 85,
      isVerified: true,
      weeklyPrice: 29.0,
      isListingActive: true,
      category: "Tech & Dev",
      defaultBannerUrl: "/banner.png",
      role: "ADMIN",
    },
  });

  console.log("Database initialized with real data only. No fake sponsors or creators.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
