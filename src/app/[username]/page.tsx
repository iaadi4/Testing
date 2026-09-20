import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCreatorProfile } from "@/lib/marketplace";
import CreatorBookingView from "@/components/CreatorBookingView";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

interface CreatorPageProps {
  params: Promise<{ username: string }>;
}

const RESERVED_ROUTES = new Set([
  "admin",
  "api",
  "blog",
  "dashboard",
  "sponsor",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase();

  if (RESERVED_ROUTES.has(cleanUsername)) {
    return {};
  }

  const profile = await getCreatorProfile(cleanUsername);
  if (!profile) {
    return {
      title: "Creator Not Found | twitterbanner.lol",
    };
  }

  const { creator } = profile;

  return {
    title: `Rent @${creator.username}'s Twitter Banner ($${creator.weeklyPrice}/wk)`,
    description: `Sponsor ${creator.name}'s Twitter/X header for 1 week. Reaches ${creator.followersCount.toLocaleString()} verified followers directly.`,
    openGraph: {
      title: `Rent @${creator.username}'s Twitter Banner | twitterbanner.lol`,
      description: `Sponsor ${creator.name}'s Twitter header. Direct 1500×500 profile visibility to ${creator.followersCount.toLocaleString()} followers.`,
      images: [
        {
          url: creator.avatarUrl || "/avatar.png",
          width: 400,
          height: 400,
          alt: `@${creator.username} Twitter profile`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `Rent @${creator.username}'s Twitter Banner ($${creator.weeklyPrice}/wk)`,
      description: `Direct 1500×500 profile sponsorship to ${creator.followersCount.toLocaleString()} followers.`,
      images: [creator.avatarUrl || "/avatar.png"],
    },
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { username } = await params;
  const cleanUsername = decodeURIComponent(username).replace(/^@/, "").toLowerCase();

  if (RESERVED_ROUTES.has(cleanUsername)) {
    notFound();
  }

  const profile = await getCreatorProfile(cleanUsername);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

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
