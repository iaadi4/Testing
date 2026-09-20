export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateIso: string;
  readTime: string;
  tag: string;
  excerpt: string;
  static?: boolean;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "monetize-twitter-banner",
    title: "How to Monetize Your Twitter/X Banner: The Complete Guide",
    description: "Learn how to turn your Twitter profile header into weekly passive income.",
    date: "September 20, 2026",
    dateIso: "2026-09-20",
    readTime: "6 min read",
    tag: "Guide",
    excerpt: "Your Twitter banner is seen by every profile visitor. Learn how to price your header and automate bookings.",
    static: true,
  },
  {
    slug: "bannermrr-vs-twitterbanner",
    title: "BannerMRR vs twitterbanner.lol: The Complete Comparison",
    description: "Comparing BannerMRR and twitterbanner.lol weekly rentals vs monthly subscriptions.",
    date: "September 20, 2026",
    dateIso: "2026-09-20",
    readTime: "5 min read",
    tag: "Comparison",
    excerpt: "Monthly subscriptions vs weekly rentals, live ad previews, fees, and creator controls.",
    static: true,
  },
  {
    slug: "why-outbid-clones-failed",
    title: "Why 99% of outbid.lol Clones Failed (And What Actually Works)",
    description: "The Empty Carousel Problem and why creator marketplaces win.",
    date: "September 18, 2026",
    dateIso: "2026-09-18",
    readTime: "5 min read",
    tag: "Analysis",
    excerpt: "Over 170 clones launched within 14 days. Here is why creator marketplaces survive.",
    static: true,
  },
  {
    slug: "outbid-lol-phenomenon",
    title: "The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+",
    description: "Game theory behind outbid.lol and what it taught about attention markets.",
    date: "September 15, 2026",
    dateIso: "2026-09-15",
    readTime: "6 min read",
    tag: "Case Study",
    excerpt: "Jonathan Wilke built a pay-to-rank leaderboard in 3 hours that made $200,000+.",
    static: true,
  },
  {
    slug: "twitter-banner-size",
    title: "X / Twitter Banner Size 2026: 1500×500 Safe Zones",
    description: "Official 1500×500 spec plus the conservative safe zone after avatar overlap and mobile crop.",
    date: "September 22, 2026",
    dateIso: "2026-09-22",
    readTime: "7 min read",
    tag: "Specs",
    excerpt: "Use 1500×500. Keep text out of the lower-left avatar mask and the outer ~60px crop.",
  },
  {
    slug: "advertise-on-twitter-banner",
    title: "How to Advertise on a Twitter Banner (Without X Ads)",
    description: "Book a creator header for one week, preview the 1500×500 live, and pay a flat rate.",
    date: "September 24, 2026",
    dateIso: "2026-09-24",
    readTime: "6 min read",
    tag: "Advertiser",
    excerpt: "A practical booking flow for brands that want profile-level visibility instead of feed auctions.",
  },
  {
    slug: "twitter-banner-ad-cost",
    title: "What Does a Twitter Banner Ad Cost in 2026?",
    description: "Typical weekly rates by follower tier versus X Ads CPC and CPM.",
    date: "September 26, 2026",
    dateIso: "2026-09-26",
    readTime: "6 min read",
    tag: "Pricing",
    excerpt: "Creator headers usually price as a flat weekly fee. Compare that with X Ads ~$0.74 CPC.",
  },
  {
    slug: "is-renting-twitter-header-allowed",
    title: "Is Renting Your X Header Allowed? ToS and FTC Rules",
    description: "X bars selling the account, not ad placement. FTC still requires a clear visual disclosure.",
    date: "September 28, 2026",
    dateIso: "2026-09-28",
    readTime: "8 min read",
    tag: "Compliance",
    excerpt: "A profile badge is not enough. Disclosure belongs in the visual, and paid-partnership labels apply to posts.",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export const DYNAMIC_POSTS = BLOG_POSTS.filter((p) => !p.static);
