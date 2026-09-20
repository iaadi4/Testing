import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "For advertisers",
  "Book a 1500×500 Twitter/X header from a verified creator. Live preview, flat weekly pricing, creator approval.",
  "/for-advertisers",
);

export default function ForAdvertisersPage() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold tracking-tight">Advertise on Twitter banners</h1>
      <p className="mt-3 text-sm text-zinc-600">Pay a flat weekly rate to appear on a creator&apos;s 1500×500 header. Preview the graphic on their profile before checkout. They approve the creative before it goes live.</p>
      <ol className="mt-8 space-y-3 text-sm list-decimal pl-5 text-zinc-700">
        <li>Browse by niche, price, or followers.</li>
        <li>Upload 1500×500 and preview the live mockup.</li>
        <li>Pay. Wait for approval. Track clicks on the destination URL.</li>
      </ol>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">Browse creators</Link>
        <Link href="/blog/advertise-on-twitter-banner" className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold">Read the guide</Link>
      </div>
    </PageShell>
  );
}
