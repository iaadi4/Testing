import { PrismaClient } from "@prisma/client";
import sharp from "sharp";
import fs from "fs";

const prisma = new PrismaClient();
const bannerPath =
  process.argv[2] ||
  "/home/iaadi4/.cursor/projects/media-Programming-Web-Dev-Next-Projects-Twitterbanner-lol/assets/draviya_banner-15239e89-25b2-4996-ab5a-a22eb4e4d8ab.jpg";

async function bannerDataUrl() {
  const input = fs.readFileSync(bannerPath);
  let quality = 82;
  let buf = await sharp(input)
    .resize(1500, 500, { fit: "cover", position: "centre" })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  while (buf.length > 380 * 1024 && quality > 40) {
    quality -= 8;
    buf = await sharp(input)
      .resize(1500, 500, { fit: "cover", position: "centre" })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
  }
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function main() {
  const iaadi8 = await prisma.user.findUnique({ where: { username: "iaadi8" } });
  if (!iaadi8) throw new Error("User iaadi8 not found");

  const removed = await prisma.user.updateMany({
    where: { username: { not: "iaadi8" } },
    data: { removedAt: new Date(), isListingActive: false },
  });

  await prisma.sponsorship.updateMany({
    where: { creatorId: iaadi8.id, status: "ACTIVE" },
    data: { status: "COMPLETED" },
  });

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const bannerImageUrl = await bannerDataUrl();

  const sponsorship = await prisma.sponsorship.create({
    data: {
      creatorId: iaadi8.id,
      buyerName: "Draviya",
      buyerEmail: "bookings@draviya.example",
      brandName: "draviya.",
      brandUrl: "https://draviya.com",
      tagline: "draviya.",
      bannerImageUrl,
      durationWeeks: 1,
      amountPaid: iaadi8.weeklyPrice,
      status: "ACTIVE",
      startDate,
      endDate,
      approvedAt: startDate,
      dodoPaymentId: `manual_${Date.now()}`,
    },
  });

  console.log(
    JSON.stringify(
      {
        removedOtherCreators: removed.count,
        sponsorshipId: sponsorship.id,
        endDate: endDate.toISOString(),
        bannerBytes: Math.floor((bannerImageUrl.length * 3) / 4),
      },
      null,
      2
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
