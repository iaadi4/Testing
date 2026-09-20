import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

const COMPS: Record<string, { name: string; title: string; facts: string[]; ours: string[] }> = {
  rentmyx: {
    name: "RentMyX",
    title: "twitterbanner.lol vs RentMyX",
    facts: ["Daily rates, often €15–€150", "About 10% platform fee", "Stripe escrow and X-API placement verification", "Header, avatar, bio, and pinned inventory"],
    ours: ["Flat weekly USD pricing", "0% launch fee", "Live 1500×500 preview before pay", "Creator approval without handing over the X account"],
  },
  headr: {
    name: "Headr",
    title: "twitterbanner.lol vs Headr.io",
    facts: ["AI matching across many profiles", "Multi-sig crypto escrow", "Banners, bios, and pinned posts"],
    ours: ["You pick one creator and see the exact mockup", "Card checkout via Dodo", "Click tracking on the destination URL"],
  },
  rentmyheader: {
    name: "RentMyHeader",
    title: "twitterbanner.lol vs Rent My Header",
    facts: ["Headers, posts, and bio links", "Quoted ~$10–$200/week", "Campaign calendar and proof-before-pay"],
    ours: ["Public marketplace with weekly rates on the card", "Interactive profile preview", "No advertiser account required"],
  },
  adhere: {
    name: "adHere",
    title: "twitterbanner.lol vs adHere",
    facts: ["Many inventory types including Twitch and newsletters", "10% fee, USDT/USDC on Solana", "X banners listed alongside other slots"],
    ours: ["X headers only, so search and schema stay focused", "USD checkout", "Safe-zone tools next to the marketplace"],
  },
  socialspot: {
    name: "SocialSpot",
    title: "twitterbanner.lol vs SocialSpot",
    facts: ["Headers, bios, pinned posts, stories", "Proposal and approval workflow"],
    ours: ["Guest checkout for advertisers", "Same-week bookings with a 1500×500 preview"],
  },
  "best-x-banner-marketplaces": {
    name: "the field",
    title: "Best X banner marketplaces in 2026",
    facts: ["RentMyX, Headr, RentMyHeader, adHere, and SocialSpot all offer some mix of escrow, approval, and extra inventory"],
    ours: ["Choose twitterbanner.lol when you want a live preview, weekly USD rates, click tracking, and a creator who still owns the X login"],
  },
};

export function generateStaticParams() {
  return Object.keys(COMPS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comp = COMPS[slug];
  if (!comp) return {};
  return pageMeta(
    comp.title,
    `Honest comparison of ${comp.name} and twitterbanner.lol for X header advertising.`,
    `/vs/${slug}`,
  );
}

export default async function VsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comp = COMPS[slug];
  if (!comp) notFound();
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold">{comp.title}</h1>
      <p className="mt-3 text-sm text-zinc-600">These notes use public marketing pages as of 2026. Features change. We include competitors because that is what buyers and AI answer engines actually compare.</p>
      <h2 className="mt-8 text-lg font-bold">What {comp.name} is known for</h2>
      <ul className="mt-3 list-disc pl-5 text-sm space-y-1">{comp.facts.map((f) => <li key={f}>{f}</li>)}</ul>
      <h2 className="mt-8 text-lg font-bold">Where twitterbanner.lol is different</h2>
      <ul className="mt-3 list-disc pl-5 text-sm space-y-1">{comp.ours.map((f) => <li key={f}>{f}</li>)}</ul>
      <Link href="/" className="inline-block mt-8 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">Browse the marketplace</Link>
    </PageShell>
  );
}
