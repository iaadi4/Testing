import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMarketplaceData } from "@/lib/marketplace";
import { CATEGORY_SLUGS, pageMeta, SITE_URL, slugToCategory } from "@/lib/site";
import { PageShell } from "@/components/PageShell";
import { jsonLdScript } from "@/lib/jsonld";

export function generateStaticParams() {
  return Object.keys(CATEGORY_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return {};
  const { creators } = await getMarketplaceData({ category });
  return {
    ...pageMeta(`${category} Twitter banners`, `Book ${category} creators on twitterbanner.lol.`, `/category/${slug}`),
    robots: creators.length < 1 ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = slugToCategory(slug);
  if (!category) notFound();
  const { creators } = await getMarketplaceData({ category });
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: creators.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/${c.username}`,
      name: `@${c.username}`,
    })),
  };

  return (
    <PageShell>
      <script {...jsonLdScript(itemList)} />
      <h1 className="text-3xl font-extrabold">{category} Twitter banners</h1>
      <p className="mt-2 text-sm text-zinc-600">{creators.length} live listings in this niche.</p>
      <div className="mt-6 grid gap-3">
        {creators.map((c) => (
          <Link key={c.id} href={`/${c.username}`} className="p-4 rounded-xl bg-white border border-zinc-200 flex justify-between">
            <span className="font-semibold">@{c.username}</span>
            <span className="text-sm">${c.weeklyPrice}/wk</span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
