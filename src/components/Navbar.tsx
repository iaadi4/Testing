"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
}

export function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-zinc-900">
              twitterbanner.lol
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              Marketplace
            </Link>
            <Link href="/blog" className="hover:text-zinc-900 transition-colors">
              Blog
            </Link>
          </nav>
        </div>

        {/* Action / Auth Links */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <Link
            href="/blog"
            className="sm:hidden text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Blog
          </Link>

          {loading ? (
            <div className="w-20 h-7 rounded-lg bg-zinc-100 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-2xs font-medium"
              >
                <img
                  src={user.avatarUrl || "/avatar.png"}
                  alt={user.name}
                  className="w-4 h-4 rounded-full object-cover border border-white/20"
                  onError={(e) => {
                    e.currentTarget.src = "/avatar.png";
                  }}
                />
                <span>@{user.username}</span>
                <LayoutDashboard className="w-3.5 h-3.5 text-zinc-300 ml-0.5" />
              </Link>

              <a
                href="/api/auth/logout"
                title="Log out / Switch account"
                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-600 transition-colors px-2 py-1 rounded-md hover:bg-zinc-100"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-semibold shadow-2xs text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>List Your Banner</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
