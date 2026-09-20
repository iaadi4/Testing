import React from "react";
import { Metadata } from "next";
import { getMarketplaceData } from "@/lib/marketplace";
import MarketplaceView from "@/components/MarketplaceView";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Twitter Banner Marketplace — Rent Header Space from Top Creators",
  description:
    "Rent verified Twitter/X profile banner real estate for 1 week from high-reach creators. 100% direct visibility with zero algorithmic decay.",
};

export default async function HomePage() {
  const { creators, stats } = await getMarketplaceData({ recordVisit: true });

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <MarketplaceView creators={creators} stats={stats} />
      </main>

      <Footer />
    </div>
  );
}
