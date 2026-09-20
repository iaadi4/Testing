"use client";

import { useRef, useState } from "react";
import { compressBannerFile } from "@/lib/compressBanner";

export function ResizerTool() {
  const [href, setHref] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const { dataUrl } = await compressBannerFile(file);
          setHref(dataUrl);
        }}
      />
      <button onClick={() => inputRef.current?.click()} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">
        Choose image
      </button>
      {href && (
        <>
          <img src={href} alt="Resized banner" className="w-full aspect-[3/1] object-cover rounded-xl border border-zinc-200" />
          <a href={href} download="twitter-banner-1500x500.jpg" className="inline-block px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold">
            Download 1500×500
          </a>
        </>
      )}
    </div>
  );
}
