import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+",
  description: "In August 2026, Jonathan Wilke built a pay-to-rank public leaderboard in 3 hours that made $200,000+ in under a week. Here's a breakdown of the mechanics and how it inspired the Twitter banner marketplace.",
  keywords: "outbid lol, outbid.lol, outbid lol revenue, what is outbid lol, jonathan wilke outbid, pay to rank leaderboard, twitter banner marketplace",
  openGraph: {
    title: "The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+",
    description: "In August 2026, Jonathan Wilke built a pay-to-rank public leaderboard in 3 hours that made $200,000+ in under a week.",
    type: "article",
    publishedTime: "2026-09-15T00:00:00Z",
    authors: ["@iaadi8"],
  },
};

export default function Post() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.description,
    author: {
      "@type": "Person",
      name: "Aditya (@iaadi8)",
      url: "https://x.com/iaadi8"
    },
    datePublished: "2026-09-15T00:00:00Z",
  };

  return (
    <article className="prose prose-zinc max-w-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <header className="mb-10">
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
          <time dateTime="2026-09-15">September 15, 2026</time>
          <span>•</span>
          <span>6 min read</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-4">
          The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+
        </h1>
      </header>

      <section className="text-zinc-600 leading-relaxed space-y-6 text-sm sm:text-base">
        <p className="text-base sm:text-lg text-zinc-800 font-medium leading-relaxed">
          In August 2026, a German developer built a single-page website in 3 hours that generated over $200,000 in under a week. It spawned over 170 copycats, triggered heated debates across Hacker News and Twitter, and revived the digital attention economics first popularized by <em>The Million Dollar Homepage</em> in 2005.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">What Was outbid.lol?</h2>
        <p>
          At its core, <strong>outbid.lol</strong> was a brutally simple pay-to-rank public leaderboard. It had zero algorithms, no quality score, no editorial gatekeeping, and required no user accounts. Rank was determined strictly by the dollar amount paid.
        </p>
        <p>
          To claim the coveted #1 spot, a bidder simply paid $5 more than the current leader. If you were already on the board, you only paid the difference to bump your rank.
        </p>
        <p>
          Here's the economic twist that made it viral: <em>all payments were 100% non-refundable</em>. It operated on a classic all-pay auction framework. Whether you held the throne for 30 seconds or 3 hours, your money was gone, and the creator kept the cash.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">The Viral Timeline</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>August 19, 2026:</strong> Jonathan Wilke ships the site after approximately 3 hours of coding with Cursor and his <code>supastarter</code> Next.js boilerplate.</li>
          <li><strong>Hour 24:</strong> The leaderboard catches fire among founders on X. Revenue crosses $21,000 with 200,000+ unique visitors.</li>
          <li><strong>Hour 48:</strong> High-ticket AI companies and SaaS founders engage in bidding wars. Revenue passes $132,000 and 1,000,000+ visitors.</li>
          <li><strong>Day 6:</strong> Cumulative bids surpass $200,000–$221,000. Jonathan publicly turns down an unsolicited $100,000 cash buyout offer.</li>
        </ul>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">The Game Theory: Shubik&apos;s Dollar Auction</h2>
        <p>
          The psychological engine powering outbid.lol is rooted in Martin Shubik&apos;s famous 1971 game-theory paradox: the <strong>Dollar Auction</strong>.
        </p>
        <p>
          In a standard auction, only the winner pays. In an all-pay auction, everyone pays, but only the top bidder gets the spotlight. When a founder spent $1,000 to secure #1, getting knocked down to #2 felt like wasting $1,000. Bidding an extra $50 to reclaim #1 felt completely rational to &quot;protect&quot; their sunk investment.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-3">Real ROI: Why Companies Actually Paid</h2>
        <p>
          Despite sounding like a meme, early sponsors saw legitimate, high-converting return on investment:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>MakerThrive:</strong> Spent $42 on an early bid, which drove over 64,000 unique visitors to their site and generated $29,000 in direct product sales within 24 hours.</li>
          <li><strong>Comp AI & JONI:</strong> Pushed enterprise bids past $10,000 and $14,000 respectively, acquiring high-intent B2B SaaS buyers for a fraction of the cost of LinkedIn Ads.</li>
          <li><strong>Peak #1 Bid:</strong> Surpassed $17,000+ at the frenzy&apos;s peak.</li>
        </ul>

        <hr className="my-8 border-zinc-200" />
        
        <h2 className="text-xl font-bold text-zinc-900 mb-3">The Problem: Why Directory Clones Died</h2>
        <p>
          Within two weeks of outbid.lol&apos;s launch, over 170 clones sprouted up (<code>claimthethrone.lol</code>, <code>rankbid.lol</code>, <code>bidwall.lol</code>). Almost all of them failed completely.
        </p>
        <p>
          Why? Because standalone directory sites have <strong>zero intrinsic traffic</strong> once novelty fades. Advertisers weren&apos;t paying for a table in a database; they were paying for the massive audience visiting Jonathan&apos;s viral domain. Once the hype moved on, the directories became digital ghost towns.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mb-3">The Evolution: Anchoring to Real Creator Audiences</h2>
        <p>
          The takeaway from outbid.lol wasn&apos;t that leaderboards are the future of advertising. The real lesson was that <strong>frictionless, algorithmic-free advertising works</strong> when paired with genuine attention.
        </p>
        <p>
          That&apos;s why we built <Link href="/" className="font-bold text-zinc-900 hover:underline">twitterbanner.lol</Link> as a <strong>two-sided creator marketplace</strong>.
        </p>
        <p>
          Instead of paying for a temporary row on a dying directory, brands can sponsor the prime 1500×500 header space on verified Twitter/X profiles for 1 week. Creators verify their follower reach via Twitter OAuth, set their own weekly rate ($/week), and earn passive income—while advertisers get guaranteed, direct profile views.
        </p>

        <div className="p-5 rounded-2xl bg-zinc-900 text-white space-y-3 mt-8">
          <h3 className="text-base font-bold text-white">Join the Marketplace</h3>
          <p className="text-xs text-zinc-300">
            Whether you want to sponsor high-reach builders or monetize your own Twitter header, start in under 60 seconds.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 transition-colors"
            >
              Browse Creators
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700 transition-colors"
            >
              List Your Banner
            </Link>
          </div>
        </div>

      </section>
    </article>
  );
}
