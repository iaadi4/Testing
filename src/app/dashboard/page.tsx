import React from "react";
import { Metadata } from "next";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CreatorDashboardView from "@/components/CreatorDashboardView";
import { Sparkles, ShieldCheck } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
        <Navbar />

        <main className="flex-1 max-w-md mx-auto w-full px-4 sm:px-6 py-16 flex flex-col justify-center">
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 text-center space-y-5 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-900">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                Creator Dashboard
              </h1>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Sign in with your Twitter/X account to verify your audience, set your weekly banner rate, and start earning.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href="/api/auth/twitter/login"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-all"
              >
                <span>Sign in with Twitter / X</span>
              </a>

              <div className="text-[11px] text-zinc-400">
                <span>Instant verification • Only takes 5 seconds</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Official Twitter OAuth 2.0 • Secure PKCE</span>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    );
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
