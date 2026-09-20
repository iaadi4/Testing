import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { SafeZoneTool } from "@/components/SafeZoneTool";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "X banner safe-zone preview",
  "Upload a 1500×500 header and see desktop avatar overlap plus mobile crop. Free, no signup.",
  "/tools/x-banner-safe-zone-preview",
);

export default function SafeZonePage() {
  return (
    <PageShell>
      <h1 className="text-3xl font-extrabold">X banner safe-zone preview</h1>
      <p className="mt-2 text-sm text-zinc-600">Runs in your browser. We do not upload the file. Overlays use the conservative intersection of public 2026 size guides.</p>
      <div className="mt-6">
        <SafeZoneTool />
      </div>
    </PageShell>
  );
}
