"use client";

import React from "react";
import Image from "next/image";
import { BannerSoldCountdown } from "@/components/BannerSoldCountdown";
import { BannerSlotPlaceholder } from "@/components/BannerSlotPlaceholder";
import { 
  MapPin, 
  Link as LinkIcon, 
  CheckCircle2, 
  Sparkles,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";

export interface CreatorProfileData {
  id?: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
  weeklyPrice?: number;
  defaultBannerUrl?: string;
}

interface TwitterProfileProps {
  creator: CreatorProfileData;
  activeSponsorship?: any | null;
  previewBannerUrl?: string | null;
  onRentClick?: () => void;
  showRentButton?: boolean;
}

export default function TwitterProfile({
  creator,
  activeSponsorship,
  previewBannerUrl,
  onRentClick,
  showRentButton = true,
}: TwitterProfileProps) {
  const hasCustomDefault = Boolean(
    creator.defaultBannerUrl && creator.defaultBannerUrl !== "/banner.png"
  );
  const realBanner =
    previewBannerUrl ||
    activeSponsorship?.bannerSrc ||
    activeSponsorship?.bannerImageUrl ||
    (hasCustomDefault ? creator.defaultBannerUrl : null);
  const showSlotPlaceholder = !realBanner;
  const currentBanner = realBanner || "/banner.png";
  const isRemoteBanner = currentBanner.startsWith("http") || currentBanner.startsWith("/");

  const handleBannerClick = () => {
    if (activeSponsorship?.id) {
      window.open(`/api/click?id=${activeSponsorship.id}`, "_blank", "noopener,noreferrer");
    } else if (onRentClick) {
      onRentClick();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
      
      {/* 1500x500 Twitter Banner */}
      <div 
        onClick={handleBannerClick}
        className="relative aspect-[3/1] w-full bg-zinc-100 cursor-pointer overflow-hidden group"
      >
        {showSlotPlaceholder ? (
          <BannerSlotPlaceholder weeklyPrice={creator.weeklyPrice} />
        ) : isRemoteBanner ? (
          <Image
            src={currentBanner}
            alt={activeSponsorship ? `Banner by ${activeSponsorship.brandName}` : `${creator.name}'s Twitter Banner`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        ) : (
          <img
            src={currentBanner}
            alt={activeSponsorship ? `Banner by ${activeSponsorship.brandName}` : `${creator.name}'s Twitter Banner`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        )}

        {/* Status Pill on Banner */}
        <div className="absolute top-3 right-3 z-10">
          {previewBannerUrl ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold backdrop-blur-md shadow-sm animate-pulse">
              <span>Previewing Your Banner</span>
            </div>
          ) : activeSponsorship ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold backdrop-blur-md shadow-sm">
                <span>Sold · {activeSponsorship.brandName}</span>
              </div>
              {activeSponsorship.endDate && (
                <div className="px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-medium backdrop-blur-md border border-white/10">
                  <BannerSoldCountdown endDate={activeSponsorship.endDate} prefix="Available in" />
                </div>
              )}
            </div>
          ) : showSlotPlaceholder ? null : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-md transition-colors border border-white/10 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for ${creator.weeklyPrice || 49}/week</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info Area */}
      <div className="px-5 sm:px-7 pb-6 relative">
        
        {/* Avatar + Action Row */}
        <div className="flex justify-between items-end -mt-10 sm:-mt-14 mb-4">
          <div className="relative">
            <Image
              src={creator.avatarUrl || "/avatar.png"}
              alt={creator.name}
              width={112}
              height={112}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white object-cover bg-zinc-100 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <a
              href={`https://x.com/${creator.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>View on X</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            {showRentButton && onRentClick && (
              <button
                onClick={onRentClick}
                className="px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Rent Banner (${creator.weeklyPrice || 49}/wk)</span>
              </button>
            )}
          </div>
        </div>

        {/* Names & Handle */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
              {creator.name}
            </h2>
            {creator.isVerified && (
              <CheckCircle2 className="w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0]/10" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium">
            @{creator.username}
          </p>
        </div>

        {/* Bio */}
        {creator.bio && (
          <p className="mt-3 text-xs sm:text-sm text-zinc-700 leading-relaxed max-w-xl">
            {creator.bio}
          </p>
        )}

        {/* Meta & Stats */}
        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-zinc-500">
          {creator.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{creator.location}</span>
            </div>
          )}

          {creator.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
              <a
                href={creator.website.startsWith("http") ? creator.website : `https://${creator.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-900 font-medium hover:underline truncate max-w-[200px]"
              >
                {creator.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}

          <div className="flex items-center gap-3 font-medium text-zinc-700 ml-auto sm:ml-0">
            <span>
              <strong className="text-zinc-900 font-bold">{creator.followingCount}</strong> Following
            </span>
            <span>
              <strong className="text-zinc-900 font-bold">{creator.followersCount.toLocaleString()}</strong> Followers
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
