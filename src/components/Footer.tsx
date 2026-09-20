"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white py-10 text-zinc-500 text-xs mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand & Mission */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 font-semibold text-zinc-900">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>twitterbanner.lol</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>The marketplace for Twitter/X profile banner sponsorships</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-zinc-600 font-medium">
          <Link href="/" className="hover:text-zinc-900 transition-colors">
            Marketplace
          </Link>
          <Link href="/blog" className="hover:text-zinc-900 transition-colors">
            Blog
          </Link>
          <a
            href="/api/auth/twitter/login"
            className="hover:text-zinc-900 transition-colors flex items-center gap-1 text-zinc-900"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>List Banner</span>
          </a>
          <a
            href="https://x.com/iaadi8"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 transition-colors flex items-center gap-0.5"
          >
            <span>@iaadi8</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
          <Link
            href="/admin"
            className="text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            Admin
          </Link>
        </div>

      </div>
    </footer>
  );
}
