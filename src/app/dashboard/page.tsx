import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CreatorDashboardView from "@/components/CreatorDashboardView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Creator Dashboard | twitterbanner.lol",
  description: "Manage your Twitter banner rental price, listing status, and active sponsorships.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const sponsorships = await prisma.sponsorship.findMany({
    where: { creatorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        <CreatorDashboardView user={user} sponsorships={sponsorships} />
      </main>

      <Footer />
    </div>
  );
}
