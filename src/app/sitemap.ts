import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { BLOG_POSTS } from "@/lib/blog";
import { CATEGORY_SLUGS, SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/blog",
    "/for-advertisers",
    "/for-creators",
    "/twitter-banner-advertising",
    "/markets",
    "/terms",
    "/privacy",
    "/refund-policy",
    "/tools/x-banner-safe-zone-preview",
    "/tools/x-banner-resizer",
    "/x-banner-ad-pricing-index",
    "/vs/rentmyx",
    "/vs/headr",
    "/vs/rentmyheader",
    "/vs/adhere",
    "/vs/socialspot",
    "/vs/best-x-banner-marketplaces",
    ...Object.keys(CATEGORY_SLUGS).map((slug) => `/category/${slug}`),
    ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  try {
    const creators = await prisma.user.findMany({
      where: { isListingActive: true, removedAt: null, bio: { not: null } },
      select: { username: true, updatedAt: true },
    });
    return [
      ...staticRoutes,
      ...creators.map((c) => ({
        url: `${SITE_URL}/${c.username}`,
        lastModified: c.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
