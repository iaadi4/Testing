import Link from "next/link";
import { NavbarActions } from "@/components/NavbarActions";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-sm tracking-tight text-zinc-900">twitterbanner.lol</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-zinc-500">
            <Link href="/#creators-grid" className="hover:text-zinc-900">Browse banners</Link>
            <Link href="/#how-it-works" className="hover:text-zinc-900">How it works</Link>
            <Link href="/blog" className="hover:text-zinc-900">Blog</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/blog" className="sm:hidden text-xs text-zinc-500">Blog</Link>
          <NavbarActions />
        </div>
      </div>
    </header>
  );
}
