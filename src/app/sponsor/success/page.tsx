"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Crown, ArrowLeft, ExternalLink, Loader2, Zap } from "lucide-react";
import { playCashSound } from "@/lib/sound";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const isMock = searchParams.get("mock") === "true";

  const [sponsor, setSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      playCashSound();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
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
        if (isMock) {
          await fetch("/api/sponsor/confirm-mock", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });
        }

        const res = await fetch("/api/sponsors");
        if (res.ok) {
          const data = await res.json();
          const found =
            data.activeSponsor?.id === orderId
              ? data.activeSponsor
              : data.fallenKings?.find((s: any) => s.id === orderId);
          setSponsor(found);
        }
      } catch (err) {
        console.error("Error confirming order:", err);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [orderId, isMock]);

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-black flex flex-col items-center justify-center p-4 selection:bg-[#FFE600] selection:text-black">
      <div className="w-full max-w-md rounded-3xl bg-white border-4 border-black p-6 sm:p-8 text-center shadow-[10px_10px_0px_0px_#000]">
        
        {/* Crown Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-[#FFE600] text-black flex items-center justify-center mx-auto mb-4 border-3 border-black shadow-[4px_4px_0px_0px_#000]">
          <Crown className="w-8 h-8 fill-black" />
        </div>

        <div className="inline-block px-3 py-1 rounded-full bg-[#CCFF00] text-black border-2 border-black text-xs font-mono font-black uppercase tracking-wider mb-3 shadow-xs">
          👑 YOU HAVE CONQUERED THE THRONE
        </div>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          LONG LIVE THE KING!
        </h1>
        <p className="text-xs font-mono text-zinc-600 mt-1.5 leading-relaxed">
          Your takeover was confirmed. You are officially reigning over Aditya's (<a href="https://x.com/iaadi8" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#1D9BF0]">@iaadi8</a>) Twitter banner.
        </p>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-black font-mono text-xs font-bold">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>COMMISSIONING THE BANNER...</span>
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-2xl bg-[#F8FAFC] border-2 border-black text-left text-xs font-mono space-y-2 shadow-[3px_3px_0px_0px_#000]">
            <div className="flex justify-between py-1 border-b border-zinc-200">
              <span className="text-zinc-500 font-bold">MONARCH</span>
              <span className="font-black text-black">{sponsor?.companyName || "Contender"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-200">
              <span className="text-zinc-500 font-bold">STRIKE BOUNTY</span>
              <span className="font-black text-black">${sponsor?.amountPaid?.toFixed(2) || "1.00"} USD</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-200">
              <span className="text-zinc-500 font-bold">REDIRECT URL</span>
              <span className="font-bold text-black truncate max-w-[200px]">{sponsor?.websiteUrl || "—"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500 font-bold">STATUS</span>
              <span className="text-black font-black flex items-center gap-1.5 bg-[#CCFF00] px-2 py-0.5 rounded border border-black">
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                ACTIVE ON 𝕏
              </span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 bg-[#FFE600] hover:bg-[#edd400] text-black font-mono font-black text-xs uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>SEE YOUR ARENA</span>
          </Link>

          <a
            href="https://x.com/iaadi8"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 text-black font-mono font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>VERIFY ON 𝕏</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center font-mono text-black text-xs font-bold">
          LOADING VICTORY SCREEN...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
