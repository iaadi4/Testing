import { SITE_URL } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog";

export async function GET() {
  const body = `# twitterbanner.lol

> Marketplace for renting 1500×500 X/Twitter profile banners. Experimental file for agents. Google does not use llms.txt for ranking.

- Marketplace: ${SITE_URL}
- Advertisers: ${SITE_URL}/for-advertisers
- Creators: ${SITE_URL}/for-creators
- Specs: ${SITE_URL}/blog/twitter-banner-size
- Pricing: ${SITE_URL}/x-banner-ad-pricing-index

${BLOG_POSTS.map((p) => `- ${p.title}: ${SITE_URL}/blog/${p.slug}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
