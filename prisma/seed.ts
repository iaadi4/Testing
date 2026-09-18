import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingSetting = await prisma.siteSetting.findUnique({
    where: { id: "default" },
  });

  if (!existingSetting) {
    await prisma.siteSetting.create({
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
        weekPrice: 29.0,
        monthPrice: 89.0,
        yearPrice: 499.0,
        lifetimePrice: 1299.0,
        minOutbidIncrement: 10.0,
        adminPassword: "admin",
      },
    });
  }

  console.log("Database initialized with real settings (no fake sponsors).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
