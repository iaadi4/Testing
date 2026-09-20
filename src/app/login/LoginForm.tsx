"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AtSign } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHandleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().replace(/^@/, "");
    if (!clean) {
      setError("Please enter your Twitter username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/handle-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: clean }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Hard redirect to dashboard to refresh session cookies
      window.location.href = data.redirect || "/dashboard";
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Option 1: Direct Twitter Handle Sign In */}
      <form onSubmit={handleHandleLogin} className="space-y-3">
        <label className="text-xs font-bold text-zinc-900 block">
          Enter Your Twitter / X Username
        </label>

        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
            <AtSign className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            autoFocus
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="e.g. iaadi8"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 bg-white placeholder:text-zinc-400 transition-all font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying & entering dashboard...</span>
            </>
          ) : (
            <>
              <span>Continue to Creator Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200/80" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-zinc-400 font-medium">or</span>
        </div>
      </div>

      {/* Option 2: Sign In with Twitter OAuth */}
      <div>
        <a
          href="/api/auth/twitter/login"
          className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-900 font-semibold text-xs sm:text-sm transition-all shadow-2xs"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Sign in with Twitter / X (OAuth)</span>
        </a>
      </div>
    </div>
  );
}
