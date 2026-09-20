"use client";

import { useRef, useState } from "react";
import { compressBannerFile } from "@/lib/compressBanner";

export function SafeZoneTool() {
  const [src, setSrc] = useState<string | null>(null);
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
          const { previewUrl } = await compressBannerFile(file);
          setSrc(previewUrl);
        }}
      />
      <button onClick={() => inputRef.current?.click()} className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">
        Upload banner
      </button>
      <div className="relative aspect-[3/1] w-full bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200">
        {src && <img src={src} alt="Preview" className="w-full h-full object-cover" />}
        <div className="absolute left-[4%] bottom-[6%] w-[15%] aspect-square rounded-full border-2 border-white/90 bg-black/20" />
        <div className="absolute inset-[8%_8%] border border-dashed border-emerald-400/80 pointer-events-none" />
      </div>
      <p className="text-xs text-zinc-500">White circle: avatar overlap. Dashed box: conservative safe text area.</p>
    </div>
  );
}
