"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  ArrowUpRight, 
  Users, 
  Eye, 
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { BannerSoldCountdown } from "@/components/BannerSoldCountdown";

interface Creator {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
  weeklyPrice: number;
  isListingActive: boolean;
  category: string;
  defaultBannerUrl?: string;
  bannerSrc?: string;
  activeSponsorship?: any | null;
}

interface MarketplaceViewProps {
  creators: Creator[];
  stats: {
    totalCreators: number;
    totalAudienceReach: number;
    totalBookings: number;
    totalGmv: number;
    totalClicks: number;
    totalVisits: number;
  };
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: "followers" | "price_asc" | "price_desc";
}

const CATEGORIES = ["All", "Tech & Dev", "AI & ML", "Indie Maker", "Crypto"];

export default function MarketplaceView({
  creators,
  stats,
  initialSearch = "",
  initialCategory = "All",
  initialSort = "followers",
}: MarketplaceViewProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"followers" | "price_asc" | "price_desc">(initialSort);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (sortBy !== "followers") params.set("sort", sortBy);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }, [searchQuery, selectedCategory, sortBy, router]);

  // Filter & sort logic
  const filteredCreators = useMemo(() => {
    let list = [...creators];

    if (selectedCategory !== "All") {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.username.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.bio && c.bio.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === "followers") {
        return b.followersCount - a.followersCount;
      }
      if (sortBy === "price_asc") {
        return a.weeklyPrice - b.weeklyPrice;
      }
      if (sortBy === "price_desc") {
        return b.weeklyPrice - a.weeklyPrice;
      }
      return 0;
    });

    return list;
  }, [creators, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-5 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-600 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-zinc-900">{stats.totalAudienceReach.toLocaleString()}</span>
          <span>verified creator reach</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 max-w-3xl mx-auto leading-[1.15]">
          Rent Twitter Banners from High-Reach Creators
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
          Book prime 1500×500 real estate directly on verified Twitter profiles for 1 week.
          Zero algorithmic decay. 100% direct visibility.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#creators-grid"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-semibold text-xs sm:text-sm shadow-xs flex items-center gap-2"
          >
            <span>Browse Creators</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <Link
            href="/login"
            className="px-5 py-2.5 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 transition-all text-zinc-900 font-semibold text-xs sm:text-sm shadow-2xs flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>List Your Banner ($/week)</span>
          </Link>
        </div>

        {/* Real Analytics Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-6">
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="text-lg sm:text-xl font-bold text-zinc-900">{stats.totalCreators}</div>
            <div className="text-[11px] text-zinc-500 font-medium">Verified Creators</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="text-lg sm:text-xl font-bold text-zinc-900">{stats.totalAudienceReach.toLocaleString()}</div>
            <div className="text-[11px] text-zinc-500 font-medium">Follower Reach</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="text-lg sm:text-xl font-bold text-zinc-900">{stats.totalBookings}</div>
            <div className="text-[11px] text-zinc-500 font-medium">Total Bookings</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs">
            <div className="text-lg sm:text-xl font-bold text-zinc-900">{stats.totalVisits.toLocaleString()}</div>
            <div className="text-[11px] text-zinc-500 font-medium">Website Visits</div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section id="creators-grid" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creator or @handle..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white border border-zinc-200/80 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg bg-white border border-zinc-200/80 text-zinc-700 font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              <option value="followers">Most Followers</option>
              <option value="price_asc">Lowest Price</option>
              <option value="price_desc">Highest Price</option>
            </select>
          </div>

        </div>

        {/* Creator Cards Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200/80 p-8 space-y-3">
            <Users className="w-8 h-8 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900">No creators found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your category filter or search query, or be the first to list in this category!
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors mt-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>List Your Banner</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCreators.map((creator, index) => {
              const activeSponsorship = creator.activeSponsorship;
              const bannerSrc =
                (creator as { bannerSrc?: string }).bannerSrc ||
                creator.defaultBannerUrl ||
                "/banner.png";

              return (
                <div
                  key={creator.id}
                  className="group bg-white rounded-2xl border border-zinc-200/80 hover:border-zinc-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Banner Thumbnail (3:1) */}
                    <div className="relative aspect-[3/1] w-full bg-zinc-100 overflow-hidden">
                      <Image
                        src={bannerSrc}
                        alt={`${creator.name}'s banner`}
                        fill
                        priority={index < 3}
                        loading={index < 3 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />

                      {/* Status Tag */}
                      <div className="absolute top-2.5 right-2.5">
                        {activeSponsorship ? (
                          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-semibold backdrop-blur-sm shadow-xs">
                            Sold
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-semibold backdrop-blur-sm shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Available Now
                          </span>
                        )}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 text-zinc-700 text-[10px] font-semibold backdrop-blur-sm shadow-2xs border border-zinc-200/60">
                          {creator.category}
                        </span>
                      </div>
                    </div>

                    {/* Creator Details */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={creator.avatarUrl || "/avatar.png"}
                            alt={creator.name}
                            className="w-10 h-10 rounded-full object-cover border border-zinc-200 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = "/avatar.png";
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="text-sm font-bold text-zinc-900 group-hover:text-black">
                                {creator.name}
                              </h3>
                              {creator.isVerified && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#1d9bf0]" />
                              )}
                            </div>
                            <span className="text-xs text-zinc-500 font-medium">
                              @{creator.username}
                            </span>
                          </div>
                        </div>

                        {/* Follower Metric */}
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-zinc-900">
                            {creator.followersCount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-medium">Followers</div>
                        </div>
                      </div>

                      {/* Bio */}
                      {creator.bio && (
                        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                          {creator.bio}
                        </p>
                      )}
                      {activeSponsorship?.endDate && (
                        <p className="text-[11px] font-medium text-rose-700">
                          <BannerSoldCountdown endDate={activeSponsorship.endDate} prefix="Available in" />
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer / Rent Action */}
                  <div className="px-4 sm:px-5 py-3 bg-zinc-50/60 border-t border-zinc-100 flex items-center justify-between">
                    <div>
                      {activeSponsorship ? (
                        <>
                          <div className="text-xs text-zinc-400 font-medium">Status</div>
                          <div className="text-sm font-bold text-rose-700">Sold this week</div>
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-zinc-400 font-medium">Weekly Rate</div>
                          <div className="text-sm font-bold text-zinc-900">
                            ${creator.weeklyPrice.toFixed(0)}{" "}
                            <span className="text-[11px] font-normal text-zinc-500">/ week</span>
                          </div>
                        </>
                      )}
                    </div>

                    <Link
                      href={`/${creator.username}`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-2xs ${
                        activeSponsorship
                          ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          : "bg-zinc-900 hover:bg-zinc-800 text-white"
                      }`}
                    >
                      <span>{activeSponsorship ? "View storefront" : "Rent Banner"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 space-y-6 shadow-xs scroll-mt-20">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            How twitterbanner.lol Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            A frictionless marketplace connecting verified Twitter creators with brands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-2">
            <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold text-zinc-900">Choose a Creator</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Browse top verified creators by niche, audience size, or rate. Check their real Twitter metrics and bio.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-2">
            <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-bold text-zinc-900">Upload & Live Preview</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Upload your 1500×500 banner and destination URL. Preview how it renders on the creator's real profile.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 space-y-2">
            <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h3 className="text-sm font-bold text-zinc-900">Rent for 1 Week</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Pay securely via Dodo Payments. The banner is reserved for your duration, driving clicks and high-intent attention.
            </p>
          </div>
        </div>

        {/* Creator Callout Banner */}
        <div className="p-5 rounded-xl bg-zinc-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Are you a Twitter / X creator?</span>
            </div>
            <p className="text-xs text-zinc-300">
              Monetize your header space. Sign in with Twitter, set your weekly price, and start receiving brand sponsorships.
            </p>
          </div>

          <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-white text-zinc-900 hover:bg-zinc-100 transition-colors font-bold text-xs whitespace-nowrap shadow-xs"
          >
            Start Monetizing
          </Link>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Everything you need to know about renting and listing Twitter profile banners.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          {[
            {
              q: "How does Twitter banner sponsorship work?",
              a: "Creators connect their Twitter account to verify their follower reach and set a custom rate per week ($/week). Advertisers browse the marketplace, upload their 1500×500 banner, see a real-time live preview of how it looks on the creator's profile, and book 1-week, 2-week, or 4-week slots securely.",
            },
            {
              q: "What dimensions and file formats are required?",
              a: "Twitter banners must be 1500 pixels wide by 500 pixels high (standard 3:1 aspect ratio). Supported formats are PNG, JPG, and WebP up to 5MB. When you upload, our live preview immediately shows how your graphic will appear on the creator's profile card.",
            },
            {
              q: "How do creators get verified and receive payouts?",
              a: "Creators sign in via Twitter OAuth 2.0 PKCE, which directly pulls verified follower metrics, display names, and avatars from the Twitter API. Creators control their weekly rates in their dashboard and can add payout instructions (PayPal, bank transfer, or crypto).",
            },
            {
              q: "Can advertisers track clicks and traffic?",
              a: "Yes! Every active sponsorship includes built-in click tracking via custom redirect links. Advertisers and creators can view real-time click counts and analytics.",
            },
            {
              q: "How is this different from BannerMRR or outbid.lol?",
              a: "Unlike BannerMRR which requires expensive 30-day subscriptions, twitterbanner.lol offers flexible 1-week slots with interactive live ad previews before checkout. And unlike directory meme sites (outbid clones), your banner is placed directly on high-reach Twitter profiles with real, permanent daily impressions.",
            },
            {
              q: "What types of products or brands can sponsor a banner?",
              a: "Tech startups, AI tools, SaaS products, developer devtools, newsletters, crypto/Web3 projects, and indie creators are all great fits. Abusive, explicit, or misleading content is strictly prohibited and moderated.",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="group rounded-xl bg-zinc-50/70 border border-zinc-200/60 overflow-hidden"
            >
              <summary className="cursor-pointer px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-900 flex items-center justify-between hover:bg-zinc-100/60 transition-colors">
                <span>{item.q}</span>
                <span className="text-zinc-400 group-open:rotate-45 transition-transform text-lg leading-none font-normal">+</span>
              </summary>
              <p className="px-4 pb-3.5 text-xs text-zinc-600 leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
