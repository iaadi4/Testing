import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 bg-white py-10 text-zinc-500 text-xs mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2 font-semibold text-zinc-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>twitterbanner.lol</span>
            </div>
            <p>The marketplace for Twitter/X profile banner sponsorships.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="font-semibold text-zinc-900">Marketplace</div>
              <Link href="/" className="block hover:text-zinc-900">Browse banners</Link>
              <Link href="/for-advertisers" className="block hover:text-zinc-900">For advertisers</Link>
              <Link href="/for-creators" className="block hover:text-zinc-900">For creators</Link>
              <Link href="/login" className="inline-flex items-center gap-1 text-zinc-900">
                <Sparkles className="w-3 h-3 text-amber-500" /> List banner
              </Link>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-zinc-900">Resources</div>
              <Link href="/blog" className="block hover:text-zinc-900">Blog</Link>
              <Link href="/twitter-banner-advertising" className="block hover:text-zinc-900">Advertising guide</Link>
              <Link href="/tools/x-banner-safe-zone-preview" className="block hover:text-zinc-900">Safe-zone tool</Link>
              <Link href="/x-banner-ad-pricing-index" className="block hover:text-zinc-900">Pricing index</Link>
              <Link href="/markets" className="block hover:text-zinc-900">US, UK, India, EU</Link>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-zinc-900">Legal</div>
              <Link href="/terms" className="block hover:text-zinc-900">Terms</Link>
              <Link href="/privacy" className="block hover:text-zinc-900">Privacy</Link>
              <Link href="/refund-policy" className="block hover:text-zinc-900">Refunds</Link>
              <a href="https://x.com/iaadi8" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 hover:text-zinc-900">
                @iaadi8 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-zinc-100">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-zinc-400 mb-2">Find us on</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-zinc-500">
            <a href="https://www.producthunt.com/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">Product Hunt</a>
            <a href="https://alternativeto.net/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">AlternativeTo</a>
            <a href="https://www.indiehackers.com/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">Indie Hackers</a>
            <a href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">Hacker News</a>
          </div>
          <p className="mt-2 text-[10px] text-zinc-400">Reciprocal launch badges go here after editorial listings go live. Do not buy dofollow placements.</p>
        </div>
      </div>
    </footer>
  );
}
