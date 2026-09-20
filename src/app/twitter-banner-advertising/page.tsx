import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "Twitter banner advertising",
  "The hub for renting X headers: specs, pricing, compliance, tools, and creator categories.",
  "/twitter-banner-advertising",
);

const links = [
  ["/blog/twitter-banner-size", "1500×500 size and safe zones"],
  ["/blog/advertise-on-twitter-banner", "How to advertise on a header"],
  ["/blog/twitter-banner-ad-cost", "What banner ads cost"],
  ["/blog/is-renting-twitter-header-allowed", "ToS and FTC disclosure"],
  ["/tools/x-banner-safe-zone-preview", "Free safe-zone preview"],
  ["/tools/x-banner-resizer", "Free 1500×500 resizer"],
  ["/x-banner-ad-pricing-index", "Live pricing index"],
  ["/vs/rentmyx", "vs RentMyX"],
  ["/vs/headr", "vs Headr"],
  ["/category/crypto", "Crypto creators"],
  ["/markets", "US, UK, India, EU"],
];

export default function PillarPage() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold">Twitter banner advertising</h1>
      <p className="mt-3 text-sm text-zinc-600">twitterbanner.lol is a marketplace for 1500×500 X profile headers. Brands book a week. Creators set the rate and approve the creative. Start here, then jump into specs, pricing, tools, or a competitor comparison.</p>
      <ul className="mt-8 space-y-2 text-sm">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="font-semibold text-zinc-900 underline">{label}</Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
