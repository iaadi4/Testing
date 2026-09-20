export const SITE_NAME = "twitterbanner.lol";
export const SITE_URL = "https://www.twitterbanner.lol";
export const SITE_HOST = "www.twitterbanner.lol";
export const APEX_HOST = "twitterbanner.lol";

export const SITE_DESCRIPTION =
  "The two-sided marketplace to rent Twitter/X profile banner real estate from verified high-reach creators. Set your weekly rate, get sponsored, or advertise directly on X.";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    SITE_URL
  ).replace(/\/$/, "");
}

export function pageMeta(title: string, description: string, path: string) {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export const CATEGORIES = [
  "Tech & Dev",
  "AI & ML",
  "Indie Maker",
  "Crypto",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<string, CategoryName> = {
  "tech-dev": "Tech & Dev",
  "ai-ml": "AI & ML",
  "indie-maker": "Indie Maker",
  crypto: "Crypto",
};

export function categoryToSlug(category: string): string {
  const found = Object.entries(CATEGORY_SLUGS).find(([, name]) => name === category);
  return found?.[0] || category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function slugToCategory(slug: string): CategoryName | null {
  return CATEGORY_SLUGS[slug] || null;
}

export const RESERVED_ROUTES = new Set([
  "admin",
  "api",
  "blog",
  "dashboard",
  "sponsor",
  "login",
  "for-advertisers",
  "for-creators",
  "terms",
  "privacy",
  "refund-policy",
  "category",
  "vs",
  "tools",
  "twitter-banner-advertising",
  "x-banner-ad-pricing-index",
  "markets",
  "llms.txt",
  "rss.xml",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
  "opengraph-image",
  "twitter-image",
  "icon.png",
  "apple-icon.png",
]);

export const SPONSORSHIP_STATUSES = [
  "PENDING",
  "AWAITING_APPROVAL",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

export type SponsorshipStatus = (typeof SPONSORSHIP_STATUSES)[number];

export const PAID_STATUSES = ["AWAITING_APPROVAL", "ACTIVE", "COMPLETED"] as const;
