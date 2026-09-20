import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell width="narrow">
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-sm text-zinc-600">That URL is not a live storefront or article.</p>
      <Link href="/" className="inline-block mt-6 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold">
        Back to the marketplace
      </Link>
    </PageShell>
  );
}
