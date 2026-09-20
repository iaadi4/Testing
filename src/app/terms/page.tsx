import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Terms of Service",
  "Terms for using twitterbanner.lol.",
  "/terms",
);

export default function TermsPage() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold">Terms of Service</h1>
      <div className="mt-6 space-y-4 text-sm text-zinc-600 leading-relaxed">
        <p>twitterbanner.lol is a marketplace. Creators list header inventory. Advertisers book a date window and upload a 1500×500 graphic. Dodo Payments is the merchant of record for checkout.</p>
        <p>Creators keep control of their X account. We never post to X on your behalf. You must approve a booking before it is marked active.</p>
        <p>You will not list or book illegal, deceptive, adult, or hate content. Restricted categories (certain financial, gambling, and crypto promotions) may be refused.</p>
        <p>Creators are responsible for FTC-compliant disclosure on the graphic and for any sponsored posts they publish. A bio badge is not sufficient.</p>
        <p>We may pause or remove listings that violate these terms. Removed creators keep historical transactions.</p>
      </div>
    </PageShell>
  );
}
