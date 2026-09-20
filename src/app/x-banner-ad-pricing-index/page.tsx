import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { PageShell } from "@/components/PageShell";
import { jsonLdScript } from "@/lib/jsonld";
import { pageMeta, PAID_STATUSES } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = pageMeta(
  "X banner ad pricing index",
  "Median weekly rates and clicks from live twitterbanner.lol bookings.",
  "/x-banner-ad-pricing-index",
);

export default async function PricingIndexPage() {
  const [creators, paid] = await Promise.all([
    prisma.user.findMany({
      where: { removedAt: null, isListingActive: true },
      select: { weeklyPrice: true, followersCount: true, category: true },
    }),
    prisma.sponsorship.findMany({
      where: { status: { in: [...PAID_STATUSES] } },
      select: { amountPaid: true, clicksCount: true, durationWeeks: true },
    }),
  ]);

  const sample = creators.length;
  const hide = sample < 5;
  const median = (values: number[]) => {
    if (!values.length) return 0;
    const s = [...values].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  };

  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "twitterbanner.lol weekly banner rates",
    description: "Median listed weekly prices by follower tier from live marketplace rows.",
    creator: "twitterbanner.lol",
  };

  return (
    <PageShell width="narrow">
      <script {...jsonLdScript(dataset)} />
      <h1 className="text-3xl font-extrabold">X banner ad pricing index</h1>
      <p className="mt-3 text-sm text-zinc-600">Built from our own listings and paid bookings. We hide the chart until at least five live creators exist so a two-row sample cannot be mistaken for a market.</p>
      {hide ? (
        <p className="mt-6 text-sm text-zinc-500">Not enough public listings yet ({sample}). Check back after more creators list.</p>
      ) : (
        <div className="mt-6 space-y-3 text-sm">
          <p>Median listed weekly rate: <strong>${median(creators.map((c) => c.weeklyPrice)).toFixed(0)}</strong> across {sample} creators.</p>
          <p>Paid bookings in sample: {paid.length}. Median clicks on paid rows: {median(paid.map((p) => p.clicksCount)).toFixed(0)}.</p>
        </div>
      )}
      <p className="mt-8 text-xs text-zinc-400">Methodology: active, non-removed listings only. Paid statuses include awaiting approval, active, and completed. No third-party rate cards.</p>
    </PageShell>
  );
}
