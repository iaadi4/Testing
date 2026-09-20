import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+",
  description: "In August 2026, Jonathan Wilke built a pay-to-rank public leaderboard in 3 hours that made $200,000+ in under a week. Here's a breakdown of the mechanics.",
  keywords: "outbid lol, outbid.lol, outbid lol revenue, what is outbid lol, jonathan wilke outbid, pay to rank leaderboard",
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
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
          The outbid.lol Phenomenon: How a 3-Hour Side Project Made $200K+
        </h1>
      </header>

      <section className="text-zinc-600 leading-relaxed space-y-6">
        <p className="text-lg text-zinc-800 font-medium">
          In August 2026, a German developer built a website in 3 hours that made $200,000+ in under a week. It spawned over 170 clones, created a micro-economy of positional scarcity, and captivated Indie Hackers around the globe.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">What is outbid.lol?</h2>
        <p>
          At its core, <strong>outbid.lol</strong> is a pay-to-rank public leaderboard. There are no complex algorithms, no followers needed, and no SEO magic involved. It is a pure, dollar-based ranking system. The top spot on the leaderboard simply costs $5 more than whatever the current leader paid.
        </p>
        <p>
          Here's the catch that makes it an economic masterclass: <em>all bids are non-refundable</em>. This operates on an all-pay auction model. Whether you hold the top spot for 10 seconds or 10 hours, your money is gone. 
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">The Viral Timeline</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Launch (Aug 19, 2026):</strong> The site goes live with barely a whisper.</li>
          <li><strong>24 Hours In:</strong> The leaderboard catches fire on Twitter. Revenue hits $21K.</li>
          <li><strong>48 Hours In:</strong> Major founders and AI startups enter a bidding war. Revenue hits $132K.</li>
          <li><strong>Day 6:</strong> Total revenue crosses the staggering $200K+ mark.</li>
        </ul>
        <p>
          By the end of its first week, the site had seen over 1M+ unique visitors and inspired a staggering 170+ clones.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">The Creator and the Tech Stack</h2>
        <p>
          The mastermind behind this is <strong>Jonathan Wilke</strong>. Astonishingly, he built the entire project using the Cursor AI editor and the supastarter boilerplate, allowing him to ship the product in roughly 3 hours. As the site went viral, he famously turned down a $100K acquisition offer, letting the experiment run its course.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">The Game Theory: Shubik's Dollar Auction</h2>
        <p>
          The mechanics of outbid.lol perfectly mirror Shubik's Dollar Auction—a classic game theory paradox. Because bids are non-refundable, participants experience sunk cost escalation. Once you've spent $1,000 to get to the top, you're incentivized to spend another $1,005 to regain it if you're dethroned shortly after.
        </p>
        <p>
          This created a perfect storm of scarcity:
          <br/>- <strong>Positional:</strong> Only one #1 spot.
          <br/>- <strong>Temporal:</strong> You don't know how long you'll hold it.
          <br/>- <strong>Price:</strong> The barrier to entry constantly rises.
          <br/>- <strong>Social:</strong> High visibility among peers and competitors.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">Real Case Studies: Who Paid?</h2>
        <p>
          Was it worth it for the bidders? For many, yes.
        </p>
        <p>
          <strong>MakerThrive</strong> spent $42 early on. They held the spot long enough to receive 64K unique visitors, which converted into $29K in revenue. On the higher end, <strong>Comp AI</strong> bid over $10K+ in a massive marketing flex. At its absolute peak, acquiring the #1 spot cost upwards of $17K+.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 mt-8 mb-4">Why It Worked</h2>
        <p>
          Beyond the mechanics, outbid.lol tapped into founder FOMO, screenshot culture on Twitter, and ego-driven competition. It wasn't just about traffic; it was a status symbol to be the "King of the Hill" in a highly visible arena.
        </p>

        <hr className="my-8 border-zinc-200" />
        
        <h2 className="text-xl font-bold text-zinc-900 mb-4">The Next Evolution</h2>
        <p>
          The outbid.lol experiment proved that people will pay for guaranteed, high-visibility placement. But a standalone leaderboard relies on viral momentum. 
        </p>
        <p>
          <strong>We took the outbid.lol concept and anchored it to real social media real estate — your Twitter banner.</strong>
        </p>
        <p className="mt-4">
          Want to monetize your own profile using this exact pay-to-dethrone mechanic? Check out <Link href="/" className="font-medium text-zinc-900 hover:underline">twitterbanner.lol</Link> and start letting sponsors bid for your banner space today.
        </p>
      </section>
    </article>
  );
}
