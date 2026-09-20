import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sparkles, ArrowRight, ShieldCheck, LogOut, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "List Your Banner",
  description: "Sign in with Twitter / X to set your weekly banner rental price and start monetizing your Twitter profile.",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 sm:px-6 py-12 sm:py-20 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 shadow-sm space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-bold text-amber-900 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Creator Login</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              List Your Twitter Banner
            </h1>
            
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Sign in with your verified Twitter / X account to set your weekly rental rate ($/week) and manage sponsor bookings.
            </p>
          </div>

          {/* Active Session Card */}
          {user ? (
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatarUrl || "/avatar.png"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-900">
                      Signed in as @{user.username}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-medium">
                      Weekly rate: ${user.weeklyPrice}/week
                    </div>
                  </div>
                </div>

                <a
                  href="/api/auth/logout"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log out</span>
                </a>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <span>Go to Creator Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="text-center">
                  <a
                    href="/api/auth/logout"
                    className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors underline"
                  >
                    Switch to a different Twitter account
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <a
                href="/api/auth/twitter/login"
                className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all group"
              >
                <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Sign in with Twitter / X</span>
              </a>

              <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                We verify your Twitter identity securely using Twitter OAuth 2.0 with PKCE. We never ask for or store your Twitter password.
              </p>
            </div>
          )}

          {/* Value Props */}
          <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full control over your weekly rate ($/week)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Automated 1500×500 banner downloads & fulfillment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>0% platform fee during early launch</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Twitter OAuth 2.0 PKCE • Strict Verification</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
