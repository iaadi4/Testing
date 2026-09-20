import React from "react";
import { Metadata } from "next";
import { getMarketplaceData } from "@/lib/marketplace";
import MarketplaceView from "@/components/MarketplaceView";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { jsonLdScript } from "@/lib/jsonld";
import { pageMeta } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = pageMeta(
  "Twitter Banner Marketplace — Rent Header Space from Top Creators",
  "Rent verified Twitter/X profile banner real estate for 1 week from high-reach creators. 100% direct visibility with zero algorithmic decay.",
  "/",
);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const { creators, stats } = await getMarketplaceData({
    recordVisit: true,
    search: params.search,
    category: params.category,
    sortBy: (params.sort as "followers" | "price_asc" | "price_desc") || "followers",
  });

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <script
        {...jsonLdScript({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How does Twitter banner sponsorship work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Creators set a weekly rate. Advertisers upload a 1500×500 banner, preview it, pay, and wait for creator approval.",
              },
            },
            {
              "@type": "Question",
              name: "What dimensions are required?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "1500×500 pixels, PNG JPG or WebP, compressed under 400KB after upload.",
              },
            },
          ],
        })}
      />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <MarketplaceView
          creators={creators}
          stats={stats}
          initialSearch={params.search || ""}
          initialCategory={params.category || "All"}
          initialSort={(params.sort as "followers" | "price_asc" | "price_desc") || "followers"}
        />
      </main>

      <Footer />
    </div>
  );
}
