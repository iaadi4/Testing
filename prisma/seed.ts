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

  // 2. Upsert primary creator: @iaadi8
  const aditya = await prisma.user.upsert({
    where: { username: "iaadi8" },
    update: {
      followersCount: 111,
      followingCount: 85,
      avatarUrl: "/avatar.png",
      weeklyPrice: 29.0,
      isListingActive: true,
      role: "ADMIN",
    },
    create: {
      twitterId: "1234567890",
      username: "iaadi8",
      name: "Aditya",
      avatarUrl: "/avatar.png",
      bio: "SWE Intern | 21 • Building cool tools & exploring attention economics. Let's build together.",
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

  // 3. Seed active sponsorship for @iaadi8 if none exists
  const existingSponsorship = await prisma.sponsorship.findFirst({
    where: { creatorId: aditya.id },
  });

  if (!existingSponsorship) {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    await prisma.sponsorship.create({
      data: {
        creatorId: aditya.id,
        buyerName: "Draviya",
        buyerEmail: "draviya@example.com",
        buyerTwitter: "draviya",
        brandName: "Draviya",
        brandUrl: "https://x.com/iaadi8",
        tagline: "First Sponsor on twitterbanner.lol",
        bannerImageUrl: "/banner.png",
        durationWeeks: 1,
        amountPaid: 29.0,
        status: "ACTIVE",
        startDate: new Date(),
        endDate: oneWeekFromNow,
        clicksCount: 12,
      },
    });
  }

  // 4. Seed a few featured demo creators for rich marketplace experience
  const sampleCreators = [
    {
      twitterId: "demo_creator_1",
      username: "sarahbuilds",
      name: "Sarah Chen",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
      bio: "Full-stack Indie Hacker building AI workflows. Shipping in public to 25k makers.",
      location: "San Francisco, CA",
      website: "https://sarahbuilds.dev",
      followersCount: 24800,
      followingCount: 420,
      isVerified: true,
      weeklyPrice: 79.0,
      isListingActive: true,
      category: "AI & ML",
      defaultBannerUrl: "/banner-moon.png",
    },
    {
      twitterId: "demo_creator_2",
      username: "alexdev",
      name: "Alex Rivera",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
      bio: "Next.js & TypeScript enthusiast. Writing tutorials and open-source packages.",
      location: "Berlin, Germany",
      website: "https://alexrivera.dev",
      followersCount: 14200,
      followingCount: 380,
      isVerified: true,
      weeklyPrice: 49.0,
      isListingActive: true,
      category: "Tech & Dev",
      defaultBannerUrl: "/banner.png",
    },
    {
      twitterId: "demo_creator_3",
      username: "elena_crypto",
      name: "Elena Rostova",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
      bio: "DeFi researcher & web3 designer. Curating the best visual crypto narratives.",
      location: "London, UK",
      website: "https://elenacrypto.eth",
      followersCount: 38500,
      followingCount: 650,
      isVerified: true,
      weeklyPrice: 120.0,
      isListingActive: true,
      category: "Crypto",
      defaultBannerUrl: "/banner-moon.png",
    },
  ];

  for (const creator of sampleCreators) {
    await prisma.user.upsert({
      where: { username: creator.username },
      update: {},
      create: creator,
    });
  }

  console.log("Database initialized with marketplace creators & site settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
