import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { ResizerTool } from "@/components/ResizerTool";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "X banner resizer 1500×500",
  "Crop any image to the official X header size and compress it under 2MB.",
  "/tools/x-banner-resizer",
);

export default function ResizerPage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-extrabold">X banner resizer</h1>
      <p className="mt-2 text-sm text-zinc-600">Exports 1500×500. Client-side only.</p>
      <div className="mt-6">
        <ResizerTool />
      </div>
    </PageShell>
  );
}
