import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "X banner ads in the US, UK, India, and EU",
  "Same marketplace, different audience windows. Checkout is USD.",
  "/markets",
);

export default function MarketsPage() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold">US, UK, India, and EU</h1>
      <p className="mt-3 text-sm text-zinc-600">twitterbanner.lol is a global English marketplace. We do not create city doorway pages. Time zones and local ad rules still matter.</p>
      <ul className="mt-6 space-y-3 text-sm text-zinc-700">
        <li><strong>United States:</strong> FTC disclosure applies to US audiences. Peak profile traffic often follows US work hours.</li>
        <li><strong>United Kingdom and EU:</strong> Paid-partnership labels and local advertising restrictions (especially finance and gambling) still apply.</li>
        <li><strong>India:</strong> Strong tech and crypto creator density. Checkout remains USD via Dodo.</li>
      </ul>
    </PageShell>
  );
}
