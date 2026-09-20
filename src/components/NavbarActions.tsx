"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";

type User = { username: string; name: string; avatarUrl: string };

export function NavbarActions() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);
    fetch("/api/auth/me", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => {
        window.clearTimeout(timer);
        setLoading(false);
      });
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  if (loading) {
    return <div className="w-20 h-7 rounded-lg bg-zinc-100 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium"
        >
          <img src={user.avatarUrl || "/avatar.png"} alt="" className="w-4 h-4 rounded-full object-cover" />
          <span>@{user.username}</span>
          <LayoutDashboard className="w-3.5 h-3.5 text-zinc-300" />
        </Link>
        <a
          href="/api/auth/logout"
          className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-zinc-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log out</span>
        </a>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 font-semibold text-xs"
    >
      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
      <span>List your banner</span>
    </Link>
  );
}
