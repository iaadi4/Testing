import React from "react";
import { Megaphone } from "lucide-react";

interface BannerSlotPlaceholderProps {
  weeklyPrice?: number;
  compact?: boolean;
}

/**
 * Honest "empty ad slot" visual shown when a creator has no active sponsor
 * and no custom banner. X's API v2 doesn't expose a user's real profile
 * banner, so instead of faking one we show that the 1500x500 slot is for
 * rent. Fills its (aspect-[3/1]) parent, which should be `relative`.
 */
export function BannerSlotPlaceholder({
  weeklyPrice,
  compact = false,
}: BannerSlotPlaceholderProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#0f172a_100%)]">
      {/* dotted texture */}
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_center,#38bdf8_0.6px,transparent_0.6px)] [background-size:16px_16px]" />
      {/* soft glow */}
      <div className="absolute -inset-x-10 -top-1/2 h-full opacity-30 blur-2xl bg-[radial-gradient(ellipse_at_center,#0ea5e9_0%,transparent_60%)]" />

      <div className="relative flex flex-col items-center justify-center text-center px-4">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/30 font-semibold text-white/90 ${
            compact ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs"
          } mb-2`}
        >
          <Megaphone className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} />
          <span>Ad space available</span>
        </div>

        <div
          className={`font-bold tracking-tight text-white ${
            compact ? "text-sm" : "text-lg sm:text-2xl"
          }`}
        >
          Your banner goes here
        </div>

        {weeklyPrice ? (
          <div
            className={`mt-0.5 font-semibold text-emerald-300 ${
              compact ? "text-[11px]" : "text-sm sm:text-base"
            }`}
          >
            from ${Math.round(weeklyPrice)}/week
          </div>
        ) : null}
      </div>
    </div>
  );
}
