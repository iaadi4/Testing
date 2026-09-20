"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-2xl font-extrabold">Something broke</h1>
      <p className="mt-2 text-sm text-zinc-600">Try again, or return to the marketplace.</p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">
          Retry
        </button>
        <Link href="/" className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold">
          Home
        </Link>
      </div>
    </div>
  );
}
