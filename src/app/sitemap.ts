import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.twitterbanner.lol";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/outbid-lol-phenomenon`,
      lastModified: new Date("2026-09-20"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/why-outbid-clones-failed`,
      lastModified: new Date("2026-09-20"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/monetize-twitter-banner`,
      lastModified: new Date("2026-09-20"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/bannermrr-vs-twitterbanner`,
      lastModified: new Date("2026-09-20"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic creator storefronts
  try {
    const creators = await prisma.user.findMany({
      where: { isListingActive: true },
      select: { username: true, updatedAt: true },
    });

    const creatorRoutes: MetadataRoute.Sitemap = creators.map((c) => ({
      url: `${baseUrl}/${c.username}`,
      lastModified: c.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [...staticRoutes, ...creatorRoutes];
  } catch {
    return staticRoutes;
  }
}
