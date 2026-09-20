"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Save, 
  Eye, 
  Calendar, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Share2,
  LogOut
} from "lucide-react";

interface CreatorDashboardViewProps {
  user: any;
  sponsorships: any[];
}

const CATEGORIES = ["Tech & Dev", "AI & ML", "Indie Maker", "Crypto"];

export default function CreatorDashboardView({
  user,
  sponsorships,
}: CreatorDashboardViewProps) {
  const [weeklyPrice, setWeeklyPrice] = useState(user.weeklyPrice || 49);
  const [savedPrice, setSavedPrice] = useState(user.weeklyPrice || 49);
  const [isListingActive, setIsListingActive] = useState(Boolean(user.isListingActive));
  const [category, setCategory] = useState(user.category || "Tech & Dev");
  const [payoutNotes, setPayoutNotes] = useState(user.payoutNotes || "");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [pendingBusy, setPendingBusy] = useState<string | null>(null);

  const storefrontUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${user.username}`
    : `https://www.twitterbanner.lol/${user.username}`;

  const copyStorefrontLink = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const res = await fetch("/api/creator/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weeklyPrice: parseFloat(String(weeklyPrice)),
          isListingActive,
          category,
          payoutNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update settings");
      }

      setSavedPrice(parseFloat(String(weeklyPrice)));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const now = new Date();
  const pendingReviews = sponsorships.filter((s) => s.status === "AWAITING_APPROVAL");
  const activeSponsorship = sponsorships.find(
    (s) => s.status === "ACTIVE" && s.endDate && new Date(s.endDate) >= now
  );

  const reviewBooking = async (sponsorshipId: string, action: "approve" | "reject") => {
    setPendingBusy(sponsorshipId + action);
    try {
      const res = await fetch("/api/creator/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sponsorshipId, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not update booking");
      window.location.reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not update booking");
    } finally {
      setPendingBusy(null);
    }
  };

  const totalEarnings = sponsorships
    .filter((s) => s.status === "ACTIVE" || s.status === "COMPLETED")
    .reduce((acc, s) => acc + (s.amountPaid || 0), 0);

  const totalClicks = sponsorships.reduce((acc, s) => acc + (s.clicksCount || 0), 0);

  const downloadBanner = (bannerUrl: string, brandName: string) => {
    const a = document.createElement("a");
    a.href = bannerUrl;
    a.download = `twitter-banner-${brandName.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header Card */}
      <section className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* User Info */}
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatarUrl || "/avatar.png"}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-zinc-200 shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/avatar.png";
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#1d9bf0]/10 text-[#1d9bf0] text-[11px] font-bold">
                  Verified Creator
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                @{user.username} • {user.followersCount.toLocaleString()} followers
              </p>
              <div className="flex items-center gap-2 mt-1">
                <a
                  href="/api/auth/logout"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-rose-600 transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Log out / Switch Account</span>
                </a>
              </div>
            </div>
          </div>

          {/* Share & Storefront Link */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={copyStorefrontLink}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Storefront Link</span>
                </>
              )}
            </button>

            <Link
              href={`/${user.username}`}
              target="_blank"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {user.removedAt && (
          <div className="mt-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            This listing has been removed from the marketplace. You can still view past bookings, but you cannot go live.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-zinc-100">
          <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
            <div className="text-xs text-zinc-400 font-medium">Weekly Rate</div>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">${savedPrice}/wk</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
            <div className="text-xs text-zinc-400 font-medium">Total Revenue</div>
            <div className="text-lg font-bold text-emerald-600 mt-0.5">${totalEarnings.toFixed(0)}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
            <div className="text-xs text-zinc-400 font-medium">Total Bookings</div>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">{sponsorships.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-100">
            <div className="text-xs text-zinc-400 font-medium">Sponsor Clicks</div>
            <div className="text-lg font-bold text-zinc-900 mt-0.5">{totalClicks}</div>
          </div>
        </div>
      </section>

      {/* Pricing & Listing Settings Form */}
      <section className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              Weekly Pricing & Marketplace Settings
            </h2>
            <p className="text-xs text-zinc-500">
              Set your weekly rate ($/week) and control your public visibility on twitterbanner.lol.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-bold">
            ${savedPrice}/week
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Price and settings updated successfully!</span>
          </div>
        )}

        {saveError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Weekly Price Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">
                Weekly Price ($ USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={weeklyPrice}
                  onChange={(e) => setWeeklyPrice(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                />
              </div>
              <p className="text-[11px] text-zinc-400">Recommended based on your reach: ${Math.max(29, Math.round(user.followersCount / 200))}/week</p>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-zinc-400">Helps relevant advertisers discover you on the marketplace.</p>
            </div>

          </div>

          {/* Accepting Sponsors Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div>
              <div className="text-xs font-bold text-zinc-900">
                Accepting New Banner Sponsorships
              </div>
              <div className="text-[11px] text-zinc-500">
                When enabled, your profile is listed publicly and advertisers can book your banner.
              </div>
            </div>

            <button
              type="button"
              disabled={Boolean(user.removedAt)}
              onClick={() => setIsListingActive(!isListingActive)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isListingActive ? "bg-zinc-900" : "bg-zinc-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  isListingActive ? "right-0.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/* Payout Information */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-900 block">
              Payout Details / Email (Optional)
            </label>
            <input
              type="text"
              value={payoutNotes}
              onChange={(e) => setPayoutNotes(e.target.value)}
              placeholder="e.g. PayPal: payments@mysite.com or wire details"
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-2xs disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save Settings & Price"}</span>
            </button>
          </div>
        </form>
      </section>

      {pendingReviews.length > 0 && (
        <section className="bg-white rounded-2xl border border-amber-200 p-6 sm:p-7 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-zinc-900">Bookings waiting for your approval</h2>
          <p className="text-xs text-zinc-500">The advertiser already paid. Approve to go live, or reject to mark a refund due.</p>
          {pendingReviews.map((s) => (
            <div key={s.id} className="space-y-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100">
              <img src={`/api/banner/${s.id}`} alt={s.brandName} className="w-full aspect-[3/1] object-cover rounded-lg border border-zinc-200" />
              <div className="text-sm font-bold">{s.brandName} · ${s.amountPaid} · {s.durationWeeks}w</div>
              <div className="text-xs text-zinc-500">{s.buyerName} · {s.buyerEmail} · {s.brandUrl}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => reviewBooking(s.id, "approve")}
                  disabled={pendingBusy !== null}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
                >
                  {pendingBusy === s.id + "approve" ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={() => reviewBooking(s.id, "reject")}
                  disabled={pendingBusy !== null}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-semibold"
                >
                  {pendingBusy === s.id + "reject" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Active Sponsor Fulfillment Section */}
      <section className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              Current Live Sponsor Banner
            </h2>
            <p className="text-xs text-zinc-500">
              Download the 1500×500 graphic and upload it to your X header.
            </p>
          </div>

          {activeSponsorship ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Now
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium">
              No Active Sponsor
            </span>
          )}
        </div>

        {activeSponsorship ? (
          <div className="space-y-4">
            {/* Banner Preview */}
            <div className="relative aspect-[3/1] w-full rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200">
              <img
                src={`/api/banner/${activeSponsorship.id}`}
                alt={activeSponsorship.brandName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/60">
              <div className="space-y-1">
                <div className="text-sm font-bold text-zinc-900">
                  {activeSponsorship.brandName}
                </div>
                <div className="text-xs text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
                  <span>Buyer: {activeSponsorship.buyerName} ({activeSponsorship.buyerEmail})</span>
                  <span>•</span>
                  <span>Amount: ${activeSponsorship.amountPaid}</span>
                  <span>•</span>
                  <span>Ends: {new Date(activeSponsorship.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => downloadBanner(`/api/banner/${activeSponsorship.id}`, activeSponsorship.brandName)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Banner (1500×500)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-50 rounded-xl border border-dashed border-zinc-200 space-y-2">
            <Calendar className="w-8 h-8 text-zinc-400 mx-auto" />
            <div className="text-xs font-semibold text-zinc-700">No active sponsor right now</div>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Share your storefront link on Twitter to attract advertisers to your profile!
            </p>
            <button
              onClick={copyStorefrontLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-800 hover:bg-zinc-100 transition-colors shadow-2xs mt-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Storefront</span>
            </button>
          </div>
        )}
      </section>

      {/* Sponsorship Orders History Table */}
      <section className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900">
            Sponsorship Bookings History
          </h2>
          <span className="text-xs text-zinc-400 font-medium">
            {sponsorships.length} orders
          </span>
        </div>

        {sponsorships.length === 0 ? (
          <p className="text-xs text-zinc-400 text-center py-6">
            No bookings yet. Once a brand sponsors your banner, it will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 font-medium">
                  <th className="py-2.5 pr-4">Brand</th>
                  <th className="py-2.5 px-4">Buyer Email</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Duration</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 pl-4 text-right">Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {sponsorships.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 pr-4 font-semibold text-zinc-900">
                      {s.brandName}
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {s.buyerEmail}
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-900">
                      ${s.amountPaid.toFixed(0)}
                    </td>
                    <td className="py-3 px-4 text-zinc-600">
                      {s.durationWeeks} {s.durationWeeks === 1 ? "week" : "weeks"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : s.status === "COMPLETED"
                            ? "bg-zinc-100 text-zinc-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right text-zinc-500">
                      {s.startDate ? new Date(s.startDate).toLocaleDateString() : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
