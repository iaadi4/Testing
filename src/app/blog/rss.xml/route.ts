import { BLOG_POSTS } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  const items = BLOG_POSTS.map(
    (p) => `<item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid>${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.dateIso).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>twitterbanner.lol Blog</title>
      <link>${SITE_URL}/blog</link>
      <description>Twitter banner advertising and creator monetization</description>
      ${items}
    </channel>
  </rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
