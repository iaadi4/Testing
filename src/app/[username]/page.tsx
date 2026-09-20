import React from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { getCreatorProfile } from "@/lib/marketplace";
import CreatorBookingView from "@/components/CreatorBookingView";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RESERVED_ROUTES, SITE_URL } from "@/lib/site";
import { jsonLdScript } from "@/lib/jsonld";

export const revalidate = 60;

interface CreatorPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase();
  if (RESERVED_ROUTES.has(cleanUsername)) return {};

  const profile = await getCreatorProfile(cleanUsername);
  if (!profile) return { title: "Creator Not Found" };

  const { creator, isThin } = profile;
  return {
    title: `Rent @${creator.username}'s Twitter Banner ($${creator.weeklyPrice}/wk)`,
    description: `Sponsor ${creator.name}'s Twitter/X header for 1 week. Reaches ${creator.followersCount.toLocaleString()} followers directly.`,
    alternates: { canonical: `/${creator.username}` },
    robots: isThin ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: `Rent @${creator.username}'s Twitter Banner`,
      description: `Direct 1500×500 profile visibility to ${creator.followersCount.toLocaleString()} followers.`,
      url: `${SITE_URL}/${creator.username}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Rent @${creator.username}'s Twitter Banner ($${creator.weeklyPrice}/wk)`,
      description: `Direct 1500×500 profile sponsorship to ${creator.followersCount.toLocaleString()} followers.`,
    },
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { username } = await params;
  if (username.startsWith("%40") || username.startsWith("@")) {
    redirect(`/${decodeURIComponent(username).replace(/^@/, "").toLowerCase()}`);
  }
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase();
  if (RESERVED_ROUTES.has(cleanUsername)) notFound();

  const profile = await getCreatorProfile(cleanUsername);
  if (!profile) notFound();

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `@${profile.creator.username} Twitter banner sponsorship`,
    description: `Weekly 1500×500 X header placement on @${profile.creator.username}`,
    url: `${SITE_URL}/${profile.creator.username}`,
    offers: {
      "@type": "Offer",
      price: profile.creator.weeklyPrice,
      priceCurrency: "USD",
      availability: profile.creator.isListingActive
        ? "https://schema.org/InStock"
        : "https://schema.org/SoldOut",
    },
  };

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col">
      <Navbar />
      <script {...jsonLdScript(productLd)} />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <CreatorBookingView
          creator={profile.creator}
          activeSponsorship={profile.activeSponsorship}
          pastSponsorships={profile.pastSponsorships}
        />
      </main>
      <Footer />
    </div>
  );
}
