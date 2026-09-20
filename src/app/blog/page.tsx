import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on Twitter banner advertising, creator monetization, outbid.lol attention economics, and social media sponsorships.",
};

const posts = [
  {
    title: "How to Monetize Your Twitter/X Banner: The Complete Guide",
    slug: "monetize-twitter-banner",
    excerpt: "Your Twitter banner is seen by every profile visitor. Learn how to price your header ($/week), automate bookings, and earn passive sponsorship income.",
    date: "September 20, 2026",
    readTime: "6 min read",
    tag: "Guide",
  },
  {
    title: "BannerMRR vs twitterbanner.lol: The Complete Comparison",
    slug: "bannermrr-vs-twitterbanner",
    excerpt: "Comparing BannerMRR and twitterbanner.lol. Explore monthly subscriptions vs weekly rentals, live ad previews, fees, and creator controls.",
    date: "September 20, 2026",
    readTime: "5 min read",
    tag: "Comparison",
  },
  {
    title: "The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+",
    slug: "outbid-lol-phenomenon",
    excerpt: "In August 2026, Jonathan Wilke built a pay-to-rank leaderboard in 3 hours that made $200,000+ in under a week. Here is the game theory breakdown.",
    date: "September 15, 2026",
    readTime: "6 min read",
    tag: "Case Study",
  },
  {
    title: "Why 99% of outbid.lol Clones Failed (And What Actually Works)",
    slug: "why-outbid-clones-failed",
    excerpt: "Over 170 clones launched within 14 days, and almost all of them died. Here is an analysis of the Empty Carousel Problem and why creator marketplaces win.",
    date: "September 18, 2026",
    readTime: "5 min read",
    tag: "Analysis",
  },
];

export default function BlogIndex() {
  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
          <span>Articles & Insights</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
          The twitterbanner.lol Blog
        </h1>
        <p className="text-sm text-zinc-500 mt-1 max-w-lg">
          Insights on creator monetization, Twitter banner advertising, attention economics, and digital sponsorships.
        </p>
      </div>

      <div className="flex flex-col gap-5 pt-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-xs hover:shadow-sm transition-all group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold text-[10px]">
                  {post.tag}
                </span>
                <span>•</span>
                <time dateTime={post.date}>{post.date}</time>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <Link href={`/blog/${post.slug}`} className="block group">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 group-hover:text-black group-hover:underline flex items-start justify-between gap-3">
                  <span>{post.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 shrink-0 mt-1 transition-colors" />
                </h2>
              </Link>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
