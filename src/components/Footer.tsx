"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white py-6 text-zinc-500 text-xs mt-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900">twitterbanner.lol</span>
          <span>•</span>
          <span>
            by{" "}
            <a
              href="https://x.com/iaadi8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-900 hover:underline font-medium"
            >
              @iaadi8
            </a>
          </span>
          <span>•</span>
          <span className="text-zinc-400">inspired by outbid.lol</span>
        </div>

        <div className="flex items-center gap-4 text-zinc-500">
          <a
            href="https://adityacodes.site"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors flex items-center gap-0.5"
          >
            <span>adityacodes.site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
