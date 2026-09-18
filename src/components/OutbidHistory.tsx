"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface OutbidHistoryProps {
  fallenKings: any[];
}

export default function OutbidHistory({ fallenKings }: OutbidHistoryProps) {
  if (!fallenKings || fallenKings.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-5 sm:p-7">
      <div className="pb-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
          Previous Bids
        </h3>
        <span className="text-xs text-zinc-400 font-medium">
          {fallenKings.length} total
        </span>
      </div>

      <div className="divide-y divide-zinc-100 mt-2">
        {fallenKings.map((item) => (
          <div
            key={item.id}
            className="py-3 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {item.logoUrl ? (
                <img
                  src={item.logoUrl}
                  alt={item.companyName}
                  className="w-5 h-5 rounded object-contain border border-zinc-200 shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded bg-zinc-100 text-zinc-600 font-semibold flex items-center justify-center text-[10px] shrink-0">
                  {item.companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-zinc-900 truncate">
                {item.companyName}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-zinc-600 font-medium">
                ${item.amountPaid.toFixed(0)}
              </span>

              <a
                href={`/api/click?id=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
                title="Visit website"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
