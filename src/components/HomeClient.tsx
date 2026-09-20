"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import TwitterProfile from "@/components/TwitterProfile";
import OutbidModal from "@/components/OutbidModal";
import OutbidHistory from "@/components/OutbidHistory";
import { Footer } from "@/components/Footer";

interface HomeClientProps {
  initialData: {
    settings: any;
    activeSponsor: any;
    currentPrice: number;
    minBidToDethrone: number;
    fallenKings: any[];
    stats: any;
  };
}

export default function HomeClient({ initialData }: HomeClientProps) {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async (recordVisit: boolean = false) => {
    try {
      const url = recordVisit ? "/api/sponsors?record_visit=1" : "/api/sponsors";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error updating banner data:", err);
    }
  };

  useEffect(() => {
    // Record visit once per session
    const hasVisited = sessionStorage.getItem("tb_visited");
    if (!hasVisited) {
      sessionStorage.setItem("tb_visited", "true");
      fetchData(true);
    }

    // Refresh every 8 seconds in background
    const interval = setInterval(() => fetchData(false), 8000);
    return () => clearInterval(interval);
  }, []);

  const activeSponsor = data?.activeSponsor ?? null;
  const currentPrice = data?.currentPrice ?? initialData.currentPrice ?? 0;
  const minBidToDethrone = data?.minBidToDethrone ?? initialData.minBidToDethrone ?? 1;
  const fallenKings = data?.fallenKings ?? initialData.fallenKings ?? [];
  const totalVisits = data?.stats?.totalVisits ?? data?.settings?.totalVisits ?? initialData.stats?.totalVisits ?? 0;

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* Subtle Top Navbar */}
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        
        {/* Clean Header */}
        <div className="text-center space-y-2.5 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-zinc-200/80 text-[11px] text-zinc-500 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-zinc-700">{totalVisits.toLocaleString()} website visits</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Outbid the Twitter Banner
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            Inspired by outbid.lol. Starts at $1. Pay $1 more than the current sponsor to replace the banner on{" "}
            <a
              href="https://x.com/iaadi8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 font-medium hover:underline"
            >
              @iaadi8
            </a>
            .
          </p>
        </div>

        {/* Aditya's Twitter Profile */}
        <TwitterProfile
          activeSponsor={activeSponsor}
          currentPrice={currentPrice}
          minBidToDethrone={minBidToDethrone}
          onOutbidClick={() => setModalOpen(true)}
          settings={data?.settings || initialData?.settings}
        />

        {/* History of Previous Bids (if any exist) */}
        <OutbidHistory fallenKings={fallenKings} />

        {/* How It Works — SEO content section */}
        <section className="mt-8 space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">How It Works</h2>
          <div className="grid gap-3">
            {[
              {
                step: "1",
                title: "Pick Your Banner",
                desc: "Upload a 1500×500 banner image. Add your company name, tagline, and link.",
              },
              {
                step: "2",
                title: "Pay to Dethrone",
                desc: "Pay $1 more than the current sponsor. That\u2019s it. No auctions, no algorithms, no waiting.",
              },
              {
                step: "3",
                title: "Reign as King",
                desc: "Your banner goes live on @iaadi8\u2019s Twitter profile instantly. Every profile visitor sees your brand — until someone outbids you.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-3 items-start p-3 rounded-lg bg-white/80 border border-zinc-200/80"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — SEO content section with structured data keywords */}
        <section className="mt-8 space-y-3 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">FAQ</h2>
          <div className="space-y-2">
            {[
              {
                q: "What is twitterbanner.lol?",
                a: "twitterbanner.lol is a pay-to-dethrone Twitter banner sponsorship platform inspired by outbid.lol. Anyone can pay to replace the current banner on @iaadi8\u2019s Twitter/X profile. The concept is simple: outbid the current king to take the throne.",
              },
              {
                q: "How much does it cost to sponsor the banner?",
                a: "It starts at just $1. To dethrone the current sponsor, you pay $1 more than what they paid. There are no hidden fees, no subscriptions, and no algorithms — just pure pay-to-rank visibility.",
              },
              {
                q: "What happens when someone outbids me?",
                a: "Your banner gets replaced by the new sponsor\u2019s banner immediately. You join the \u201CFallen Kings\u201D hall of fame showing your reign duration and the amount you paid. Your brand still gets visibility in the bid history.",
              },
              {
                q: "How is this different from outbid.lol?",
                a: "outbid.lol is a pay-to-rank leaderboard directory. twitterbanner.lol takes that same competitive mechanic but anchors it to real social media real estate — a Twitter profile banner that gets organic daily impressions from every profile visitor.",
              },
              {
                q: "Who sees my banner?",
                a: "Everyone who visits @iaadi8\u2019s Twitter/X profile sees the current sponsor\u2019s banner. This includes organic visitors from tweets, replies, and retweets. It\u2019s direct, algorithmic-free visibility for your brand.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-lg bg-white/80 border border-zinc-200/80 overflow-hidden"
              >
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-zinc-900 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                  {item.q}
                  <span className="text-zinc-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-3 text-xs text-zinc-500 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

      </main>

      {/* Clean Footer */}
      <Footer />

      {/* Sleek Outbid Modal */}
      <OutbidModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        minBidToDethrone={minBidToDethrone}
        currentPrice={currentPrice}
        activeSponsor={activeSponsor}
      />

    </div>
  );
}
