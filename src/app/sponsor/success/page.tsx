"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { ArrowLeft, ExternalLink, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sponsorshipId =
    searchParams.get("sponsorship_id") ||
    searchParams.get("sponsorshipId") ||
    searchParams.get("order_id");

  const [sponsorship, setSponsorship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.4 },
      });
    } catch (e) {
      console.error(e);
    }

    if (!sponsorshipId) {
      setLoading(false);
      return;
    }

    const processOrder = async () => {
      try {
        let attempts = 0;
        while (attempts < 6) {
          attempts++;
          try {
            const verifyRes = await fetch("/api/sponsor/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sponsorshipId }),
            });

            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              if (verifyData.success && verifyData.sponsorship) {
                setSponsorship(verifyData.sponsorship);
                break;
              }
            }
          } catch (e) {
            console.warn("Verify attempt error:", e);
          }

          if (attempts < 6) {
            await new Promise((r) => setTimeout(r, 1200));
          }
        }
      } catch (err) {
        console.error("Order processing error:", err);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [sponsorshipId]);

  return (
    <div className="max-w-xl mx-auto w-full px-4 sm:px-6 py-12 space-y-6">
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 sm:p-8 space-y-6 text-center">
        
        {/* Animated Badge */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Payment Successful!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Your Twitter banner sponsorship has been secured and confirmed.
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs">Activating your banner reservation...</span>
          </div>
        ) : sponsorship ? (
          <div className="space-y-5 text-left pt-2">
            
            {/* Banner Preview */}
            <div className="rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 aspect-[3/1]">
              <img
                src={sponsorship.bannerImageUrl}
                alt={sponsorship.brandName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details Box */}
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/60 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Brand</span>
                <span className="font-semibold text-zinc-900">{sponsorship.brandName}</span>
              </div>
              {sponsorship.creator && (
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-medium">Creator</span>
                  <span className="font-semibold text-zinc-900">@{sponsorship.creator.username}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Duration</span>
                <span className="font-semibold text-zinc-900">
                  {sponsorship.durationWeeks} {sponsorship.durationWeeks === 1 ? "week" : "weeks"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Amount Paid</span>
                <span className="font-bold text-zinc-900">${sponsorship.amountPaid?.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Destination URL</span>
                <a
                  href={sponsorship.brandUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-900 hover:underline flex items-center gap-1 truncate max-w-[220px]"
                >
                  <span>{sponsorship.brandUrl}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                </a>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 text-emerald-800 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                The creator has been notified to set your 1500×500 graphic on their verified Twitter profile!
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {sponsorship.creator ? (
                <Link
                  href={`/${sponsorship.creator.username}`}
                  className="w-full sm:w-1/2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold text-center transition-colors shadow-2xs"
                >
                  View Creator Storefront
                </Link>
              ) : (
                <Link
                  href="/"
                  className="w-full sm:w-1/2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold text-center transition-colors shadow-2xs"
                >
                  Return to Marketplace
                </Link>
              )}

              <Link
                href="/"
                className="w-full sm:w-1/2 py-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold text-center transition-colors"
              >
                Browse More Creators
              </Link>
            </div>

          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <p className="text-xs text-zinc-600">
              Your payment was received! The sponsorship will activate within a few moments once webhook verification completes.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors"
            >
              <span>Back to Marketplace</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense
          fallback={
            <div className="py-16 text-center text-xs text-zinc-400">
              Loading confirmation...
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
