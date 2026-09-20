import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on the outbid.lol phenomenon, Twitter banner sponsorship, and pay-to-rank monetization models.",
};

const posts = [
  {
    title: "The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+",
    slug: "outbid-lol-phenomenon",
    excerpt: "In August 2026, a German developer built a website in 3 hours that made $200,000+ in under a week. Here's how.",
    date: "September 15, 2026",
    readTime: "6 min read",
  },
  {
    title: "Why 99% of outbid.lol Clones Failed (And What Actually Works)",
    slug: "why-outbid-clones-failed",
    excerpt: "170+ clones launched within 2 weeks. Almost all of them are dead. Here is the fatal flaw they all shared.",
    date: "September 18, 2026",
    readTime: "5 min read",
  },
  {
    title: "How to Monetize Your Twitter/X Banner: The Complete Guide",
    slug: "monetize-twitter-banner",
    excerpt: "Your Twitter banner gets seen by every single person who visits your profile. Why not monetize it? Here is a complete guide.",
    date: "September 20, 2026",
    readTime: "5 min read",
  },
];

export default function BlogIndex() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Blog</h1>
      <div className="flex flex-col gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <time dateTime={post.date}>{post.date}</time>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 group-hover:underline">
                {post.title}
              </h2>
            </Link>
            <p className="text-zinc-600 leading-relaxed">
              {post.excerpt}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
