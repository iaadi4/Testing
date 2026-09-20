import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "For creators",
  "List your Twitter banner, set a weekly rate, approve every booking, and get paid.",
  "/for-creators",
);

export default function ForCreatorsPage() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold tracking-tight">List your Twitter banner</h1>
      <p className="mt-3 text-sm text-zinc-600">Sign in with X, set a weekly price, and share your storefront. You approve every creative. Early listings have a 0% platform fee.</p>
      <ol className="mt-8 space-y-3 text-sm list-decimal pl-5 text-zinc-700">
        <li>Connect Twitter OAuth 2.0. We pull followers and avatar.</li>
        <li>Set $/week and a category.</li>
        <li>Approve or reject paid bookings, then upload the 1500×500 file to X.</li>
      </ol>
      <div className="mt-8 flex gap-3">
        <Link href="/login" className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">Sign in with X</Link>
        <Link href="/blog/monetize-twitter-banner" className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold">Pricing guide</Link>
      </div>
    </PageShell>
  );
}
