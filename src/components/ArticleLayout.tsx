import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { jsonLdScript, organizationLd } from "@/lib/jsonld";
import type { BlogPost } from "@/lib/blog";

export function ArticleLayout({
  post,
  children,
}: {
  post: BlogPost;
  children: React.ReactNode;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: `${post.dateIso}T00:00:00Z`,
    dateModified: `${post.dateIso}T00:00:00Z`,
    url,
    image: `${url}/opengraph-image`,
    author: { "@type": "Person", name: "Aditya (@iaadi8)", url: "https://x.com/iaadi8" },
    publisher: organizationLd,
    mainEntityOfPage: url,
  };

  return (
    <article className="prose prose-zinc max-w-none">
      <script {...jsonLdScript(jsonLd)} />
      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-900">Home</Link>
        {" / "}
        <Link href="/blog" className="hover:text-zinc-900">Blog</Link>
        {" / "}
        <span>{post.tag}</span>
      </nav>
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
          <time dateTime={post.dateIso}>{post.date}</time>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
          {post.title}
        </h1>
        <p className="text-sm text-zinc-500">By Aditya (@iaadi8) · Updated {post.date}</p>
      </header>
      <section className="text-zinc-600 leading-relaxed space-y-6 text-sm sm:text-base">
        {children}
      </section>
    </article>
  );
}
