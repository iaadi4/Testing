import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { DYNAMIC_POSTS, getPost } from "@/lib/blog";
import { ArticleLayout } from "@/components/ArticleLayout";
import { OG_IMAGE_META, SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return DYNAMIC_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.static) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: `${post.dateIso}T00:00:00Z`,
      url: `${SITE_URL}/blog/${post.slug}`,
      images: [OG_IMAGE_META],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [OG_IMAGE_META],
    },
  };
}

export default async function DynamicBlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.static) notFound();

  return (
    <ArticleLayout post={post}>
      <PostBody slug={slug} />
    </ArticleLayout>
  );
}

function PostBody({ slug }: { slug: string }) {
  if (slug === "twitter-banner-size") {
    return (
      <>
        <p className="text-base sm:text-lg text-zinc-800 font-medium">The X header size is 1500×500 pixels (3:1). Design at that size. Keep logos and copy out of the lower-left avatar overlap and the outer crop that phones apply.</p>
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm"><strong>TL;DR:</strong> 1500×500, JPG or PNG, under 5MB (ideally under 2MB). Conservative safe zone: center-right ~1260×420. Avatar mask: treat the lower-left ~225×185 as dead. Mobile often trims ~60px from the top and bottom.</div>
        <h2 className="text-xl font-bold text-zinc-900">Official spec</h2>
        <p>X&apos;s own profile guidelines still specify 1500×500. Guides from Snappa, Neal Schaffer, ScreenSnap, Pixpipe, and Media Cheat Sheet all agree on the canvas. They disagree on the safe zone, which is why we publish the conservative intersection instead of one vendor&apos;s screenshot.</p>
        <h2 className="text-xl font-bold text-zinc-900">Where sources disagree</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Avatar overlap is cited from ~134×134 to ~225×185, and it shifts toward center-left on mobile.</li>
          <li>Mobile crop is often described as ~60px off the top and bottom, or a centered ~1260×420 window.</li>
          <li>Safe text boxes are described as ~1300×300 or the upper-right two-thirds.</li>
        </ul>
        <p>Use the overlap of those ranges: keep every word and logo inside a centered 1260×360 box, biased right, and treat the lower-left third as background only.</p>
        <p>Preview your file on a real profile mockup with our <Link href="/tools/x-banner-safe-zone-preview" className="font-bold text-zinc-900 underline">safe-zone tool</Link>, or <Link href="/tools/x-banner-resizer" className="font-bold text-zinc-900 underline">resize any image to spec</Link>.</p>
      </>
    );
  }

  if (slug === "advertise-on-twitter-banner") {
    return (
      <>
        <p className="text-base sm:text-lg text-zinc-800 font-medium">To advertise on a Twitter banner, pick a creator, upload a 1500×500 graphic, preview it on their profile, and pay a flat weekly rate. The creator approves the creative before it goes live.</p>
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm"><strong>TL;DR:</strong> Browse twitterbanner.lol, book 1–4 weeks, pay through Dodo, wait for approval. You get a destination URL, click tracking, and a live profile placement—not a feed auction.</div>
        <h2 className="text-xl font-bold text-zinc-900">When a header beats X Ads</h2>
        <p>X Ads average roughly $0.74 CPC and $6.46 CPM. That is cheap reach in a noisy feed. A header is different: everyone who opens the profile sees it, ad blockers cannot strip it, and you pay a known weekly price instead of bidding.</p>
        <h2 className="text-xl font-bold text-zinc-900">The booking path</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Filter creators by niche, price, or followers.</li>
          <li>Upload a 1500×500 file and preview it on their exact mockup.</li>
          <li>Pay. The creator reviews the brand, URL, and creative.</li>
          <li>On approval they upload the graphic to X. You get a receipt and the storefront link.</li>
        </ol>
        <p><Link href="/" className="font-bold text-zinc-900 underline">Browse creators</Link> or read the <Link href="/for-advertisers" className="font-bold text-zinc-900 underline">advertiser guide</Link>.</p>
      </>
    );
  }

  if (slug === "twitter-banner-ad-cost") {
    return (
      <>
        <p className="text-base sm:text-lg text-zinc-800 font-medium">Most creator Twitter banners price as a flat weekly fee. On twitterbanner.lol that is typically $29–$49 for 1–5K followers, $49–$129 for 5–25K, and $149+ above that—set by the creator, not an auction.</p>
        <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm"><strong>TL;DR:</strong> Budget weekly rate × weeks. A two-week $79 slot is $158. X Ads still charge per click (~$0.74). Use the <Link href="/x-banner-ad-pricing-index" className="underline font-bold text-zinc-900">live pricing index</Link> once enough bookings exist.</div>
        <h2 className="text-xl font-bold text-zinc-900">What you are buying</h2>
        <p>You are renting the 1500×500 header for a date window, plus a click-tracked destination URL. You are not buying a tweet, a follow, or X&apos;s targeting graph.</p>
        <h2 className="text-xl font-bold text-zinc-900">Compare to X Ads</h2>
        <p>Public 2026 benchmarks put X around $0.74 CPC and $6.46 CPM, with no platform minimum. Headers win when the audience is already visiting a specific creator. Ads win when you need scale and keyword targeting.</p>
      </>
    );
  }

  return (
    <>
      <p className="text-base sm:text-lg text-zinc-800 font-medium">X&apos;s Terms of Service bar selling or transferring the account itself. They do not, by themselves, bar a creator from placing a paid image on a header they still control. Advertising law still applies.</p>
      <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-sm"><strong>TL;DR:</strong> Do not sell the login. You may sell placement. Disclose the paid relationship in the visual. A bio badge is not enough. Use X&apos;s paid-partnership label on sponsored posts. Restricted categories (finance, gambling, and some crypto) vary by region.</div>
      <h2 className="text-xl font-bold text-zinc-900">What X actually forbids</h2>
      <p>The ToS treat the account as non-transferable and let X show its own ads. That is different from a creator updating their own header after a private booking. Competitors that verify placements via the X API operate on that distinction. We do not take over accounts.</p>
      <h2 className="text-xl font-bold text-zinc-900">FTC disclosure</h2>
      <p>The FTC Endorsement Guides say a material connection must be clear and conspicuous. Staff Q&amp;A is explicit that a profile badge alone is insufficient because many viewers never see it. If the header endorses a product, put “Ad” or “Paid” in the graphic. Sponsored tweets need the in-composer paid-partnership label plus in-content language.</p>
      <h2 className="text-xl font-bold text-zinc-900">How twitterbanner.lol handles this</h2>
      <p>Creators approve every creative. We recommend an on-image disclosure. Rejections trigger a manual refund. Read the <Link href="/terms" className="underline font-bold text-zinc-900">terms</Link> and <Link href="/refund-policy" className="underline font-bold text-zinc-900">refund policy</Link>.</p>
    </>
  );
}
