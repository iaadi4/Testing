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
