"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Shield } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-sm tracking-tight text-zinc-900">
            twitterbanner.lol
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
          <Link
            href="/blog"
            className="hover:text-zinc-900 transition-colors"
          >
            Blog
          </Link>
          <a
            href="https://x.com/iaadi8"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors flex items-center gap-1"
          >
            <span>@iaadi8</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>

      </div>
    </header>
  );
}
