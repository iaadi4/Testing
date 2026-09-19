"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { ArrowLeft, ExternalLink, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { playCashSound } from "@/lib/sound";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [sponsor, setSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      playCashSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
      });
    } catch (e) {
      console.error(e);
    }

    if (!orderId) {
      setLoading(false);
      return;
    }

    const processOrder = async () => {
      try {
        let resolvedSponsor = null;
        let attempts = 0;

        while (attempts < 6) {
          attempts++;
          try {
            const verifyRes = await fetch("/api/sponsor/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId }),
            });

            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              if (verifyData.success && verifyData.sponsor && verifyData.sponsor.status === "ACTIVE") {
                resolvedSponsor = verifyData.sponsor;
                break;
              }
            }
          } catch (e) {
            console.warn("Verify attempt error:", e);
          }

          const res = await fetch("/api/sponsors", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const found =
              data.activeSponsor?.id === orderId
                ? data.activeSponsor
                : data.fallenKings?.find((s: any) => s.id === orderId);
            if (found && found.status === "ACTIVE") {
              resolvedSponsor = found;
              break;
            }
          }

          await new Promise((r) => setTimeout(r, 1200));
        }

        if (resolvedSponsor) {
          setSponsor(resolvedSponsor);
        } else {
          const res = await fetch("/api/sponsors", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            const found =
              data.activeSponsor?.id === orderId
                ? data.activeSponsor
                : data.fallenKings?.find((s: any) => s.id === orderId);
            setSponsor(found);
          }
        }
      } catch (err) {
        console.error("Error confirming order:", err);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-[#fafafa] bg-[radial-gradient(#e5e7eb_1.2px,transparent_1.2px)] [background-size:20px_20px] text-zinc-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center justify-center">
        <div className="w-full bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 text-center shadow-xs space-y-6">
          
          {/* Animated Success Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-xs font-semibold text-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Takeover Confirmed</span>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 flex items-center justify-center gap-2">
              <span>You own the banner!</span>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Your payment was processed successfully. You are now the reigning monarch on{" "}
              <a href="https://x.com/iaadi8" target="_blank" rel="noopener noreferrer" className="text-zinc-900 font-medium hover:underline">
                @iaadi8
              </a>
              .
            </p>
          </div>

          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-zinc-500 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
              <span>Deploying your banner to the arena...</span>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              {/* Live Banner Preview */}
              {sponsor?.bannerImageUrl && (
                <div className="relative aspect-[3/1] w-full rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-xs">
                  <img
                    src={sponsor.bannerImageUrl}
                    alt={sponsor.companyName || "Your Banner"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-medium border border-white/10">
                    Sponsored by {sponsor.companyName}
                  </div>
                </div>
              )}

              {/* Order Meta Box */}
              <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/80 text-xs space-y-2.5">
                <div className="flex justify-between items-center py-0.5 border-b border-zinc-200/60">
                  <span className="text-zinc-500">Sponsor</span>
                  <span className="font-semibold text-zinc-900">{sponsor?.companyName || "Contender"}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-zinc-200/60">
                  <span className="text-zinc-500">Strike Bounty</span>
                  <span className="font-mono font-semibold text-zinc-900">
                    ${sponsor?.amountPaid ? Number(sponsor.amountPaid).toFixed(2) : "1.00"} USD
                  </span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-zinc-200/60">
                  <span className="text-zinc-500">Destination</span>
                  <a
                    href={sponsor?.websiteUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#1D9BF0] hover:underline truncate max-w-[200px]"
                  >
                    {sponsor?.websiteUrl || "—"}
                  </a>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-zinc-500">Live Status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200/60">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active Now</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 bg-zinc-950 hover:bg-black text-white text-xs font-semibold rounded-full shadow-md shadow-zinc-900/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Arena</span>
            </Link>

            <a
              href="https://x.com/iaadi8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Profile on 𝕏</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center text-xs text-zinc-500">
          Loading victory confirmation...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
