import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog";
import { jsonLdScript } from "@/lib/jsonld";
import { pageMeta, SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Blog",
  "Insights on Twitter banner advertising, creator monetization, and X header specs.",
  "/blog",
);

export default function BlogIndex() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: BLOG_POSTS.map((post, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="space-y-8">
      <script {...jsonLdScript(itemList)} />
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-[11px] font-semibold text-zinc-600 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          Articles & Insights
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">The twitterbanner.lol Blog</h1>
        <p className="text-sm text-zinc-500 mt-1 max-w-lg">Creator monetization, banner advertising, specs, and compliance.</p>
      </div>
      <div className="flex flex-col gap-5">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug} className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-semibold text-[10px]">{post.tag}</span>
              <time dateTime={post.dateIso}>{post.date}</time>
              <span>{post.readTime}</span>
            </div>
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 hover:underline flex justify-between gap-3">
                <span>{post.title}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 shrink-0 mt-1" />
              </h2>
            </Link>
            <p className="text-sm text-zinc-600">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
