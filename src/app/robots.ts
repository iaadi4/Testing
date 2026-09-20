import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/sponsor/success"],
      },
    ],
    sitemap: "https://www.twitterbanner.lol/sitemap.xml",
  };
}
