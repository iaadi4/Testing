import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.twitterbanner.lol";

  return [
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
  ];
}
