"use client";

import React from "react";
import Image from "next/image";
import { 
  ExternalLink, 
  MapPin, 
  Link as LinkIcon, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";

interface TwitterProfileProps {
  activeSponsor: any;
  currentPrice: number;
  minBidToDethrone: number;
  onOutbidClick: () => void;
}

export default function TwitterProfile({
  activeSponsor,
  currentPrice,
  minBidToDethrone,
  onOutbidClick,
}: TwitterProfileProps) {
  const handleBannerClick = () => {
    if (activeSponsor) {
      window.open(`/api/click?id=${activeSponsor.id}`, "_blank", "noopener,noreferrer");
    } else {
      onOutbidClick();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
      
      {/* 1500x500 Twitter Banner */}
      <div 
        onClick={handleBannerClick}
        className="relative aspect-[3/1] w-full bg-zinc-100 cursor-pointer overflow-hidden group"
      >
        <Image
          src={activeSponsor?.bannerImageUrl || "/banner.png?v=4"}
          alt="Twitter Banner"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 672px"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
        />

        {/* Subtle Status Pill */}
        <div className="absolute top-3 right-3 z-10">
          {activeSponsor ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-medium backdrop-blur-md transition-colors border border-white/10 shadow-sm">
              <span>Sponsored by {activeSponsor.companyName} (${activeSponsor.amountPaid.toFixed(0)})</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/85 text-white text-xs font-semibold backdrop-blur-md border border-emerald-500/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Banner Available • $1 to Claim</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                Outbid ↗
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Area */}
      <div className="p-4 sm:p-6 pt-0">
        
        {/* Avatar and Action Buttons */}
        <div className="flex items-end justify-between -mt-10 sm:-mt-12 mb-3 relative z-10">
          {/* Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white bg-zinc-950 overflow-hidden shadow-xs">
            <Image
              src="/avatar.png?v=4"
              alt="Aditya"
              fill
              unoptimized
              sizes="(max-width: 640px) 80px, 96px"
              className="object-cover"
              priority
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://x.com/iaadi8"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-900 transition-colors"
            >
              Follow on 𝕏
            </a>

            {/* Highlighted Outbid Button */}
            <button
              onClick={onOutbidClick}
              className="px-4 py-1.5 rounded-full bg-zinc-950 hover:bg-black text-white text-xs font-bold transition-all shadow-md shadow-zinc-900/20 ring-2 ring-emerald-500/60 hover:ring-emerald-500 flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Outbid (${minBidToDethrone.toFixed(0)})</span>
            </button>
          </div>
        </div>

        {/* Bio & Details */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Aditya</h1>
              <CheckCircle2 className="w-4 h-4 text-[#1D9BF0] fill-current" />
            </div>
            <p className="text-xs text-zinc-500 font-medium">@iaadi8</p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
            SWE Intern | 21 • Building & shipping tools • This banner is open for advertising on{" "}
            <span className="text-zinc-900 font-medium">twitterbanner.lol</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>India</span>
            </div>
            <a
              href="https://adityacodes.site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#1D9BF0] hover:underline"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>adityacodes.site</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs pt-1">
            <span>
              <strong className="text-zinc-900 font-semibold">85</strong>{" "}
              <span className="text-zinc-500">Following</span>
            </span>
            <span>
              <strong className="text-zinc-900 font-semibold">109</strong>{" "}
              <span className="text-zinc-500">Followers</span>
            </span>
          </div>
        </div>

        {/* Active Sponsor Attribution Pill */}
        {activeSponsor && (
          <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {activeSponsor.logoUrl ? (
                <img
                  src={activeSponsor.logoUrl}
                  alt={activeSponsor.companyName}
                  className="w-5 h-5 rounded object-contain border border-zinc-200"
                />
              ) : (
                <span className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center text-[10px]">
                  ⚡
                </span>
              )}
              <span className="text-zinc-500">
                Current Sponsor:{" "}
                <strong className="text-zinc-900 font-semibold">{activeSponsor.companyName}</strong>
                {activeSponsor.tagline && ` — ${activeSponsor.tagline}`}
              </span>
            </div>

            <a
              href={`/api/click?id=${activeSponsor.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 hover:text-[#1D9BF0] flex items-center gap-0.5 font-medium transition-colors"
            >
              <span>Visit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
