"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowLeft, 
  UploadCloud, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Loader2, 
  ArrowUpRight 
} from "lucide-react";
import TwitterProfile, { CreatorProfileData } from "@/components/TwitterProfile";
import { BannerSoldCountdown } from "@/components/BannerSoldCountdown";
import { compressBannerFile } from "@/lib/compressBanner";

interface CreatorBookingViewProps {
  creator: CreatorProfileData;
  activeSponsorship: any | null;
  pastSponsorships: any[];
}

export default function CreatorBookingView({
  creator,
  activeSponsorship,
  pastSponsorships,
}: CreatorBookingViewProps) {
  const [durationWeeks, setDurationWeeks] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerTwitter, setBuyerTwitter] = useState("");
  const [brandUrl, setBrandUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerDataUrl, setBannerDataUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bookingFormRef = useRef<HTMLDivElement>(null);

  const weeklyPrice = creator.weeklyPrice || 49;
  const totalPrice = weeklyPrice * durationWeeks;
  const isSold = Boolean(activeSponsorship?.endDate && new Date(activeSponsorship.endDate) >= new Date());

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setErrorMessage("");
      const { dataUrl, previewUrl } = await compressBannerFile(file);
      setBannerPreview(previewUrl);
      setBannerDataUrl(dataUrl);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not process that image.");
    }
  };

  const handleScrollToForm = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!bannerDataUrl) {
      setErrorMessage("Please upload your 1500×500 banner image.");
      return;
    }

    if (!brandName.trim() || !brandUrl.trim() || !buyerEmail.trim() || !buyerName.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: creator.id,
          buyerName: buyerName.trim(),
          buyerEmail: buyerEmail.trim(),
          buyerTwitter: buyerTwitter.trim() || undefined,
          brandName: brandName.trim(),
          brandUrl: brandUrl.trim(),
          tagline: tagline.trim() || undefined,
          bannerImageUrl: bannerDataUrl,
          durationWeeks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout creation failed");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Twitter Profile Mockup with Live Banner Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900">
            Rent @{creator.username}&apos;s Twitter banner
          </h1>
          {bannerPreview && (
            <button
              type="button"
              onClick={() => {
                setBannerPreview(null);
                setBannerDataUrl(null);
              }}
              className="text-xs text-rose-600 hover:underline font-medium"
            >
              Reset preview
            </button>
          )}
        </div>
        <ol className="flex flex-wrap gap-2 text-[11px] font-semibold text-zinc-500">
          <li className="px-2 py-1 rounded-full bg-white border border-zinc-200">1. Upload</li>
          <li className="px-2 py-1 rounded-full bg-white border border-zinc-200">2. Details</li>
          <li className="px-2 py-1 rounded-full bg-white border border-zinc-200">3. Pay</li>
        </ol>

        <TwitterProfile
          creator={creator}
          activeSponsorship={activeSponsorship}
          previewBannerUrl={bannerPreview}
          onRentClick={handleScrollToForm}
          showRentButton={!bannerPreview && !isSold}
        />
      </section>

      {isSold && activeSponsorship?.endDate && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-900">
          <p className="font-bold">This banner is sold for the current week.</p>
          <p className="mt-1 text-xs text-rose-800">
            <BannerSoldCountdown endDate={activeSponsorship.endDate} prefix="New bookings open in" />
          </p>
        </div>
      )}

      {/* Booking Form Card */}
      <section
        ref={bookingFormRef}
        className={`bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 sm:p-8 space-y-6 ${isSold ? "opacity-60 pointer-events-none" : ""}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
              Rent @{creator.username}&apos;s Banner
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Guaranteed 100% header visibility to {creator.followersCount.toLocaleString()} followers.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-zinc-400 font-medium">Rate</div>
            <div className="text-lg sm:text-xl font-extrabold text-zinc-900">
              ${weeklyPrice} <span className="text-xs font-medium text-zinc-500">/ week</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmitBooking} className="space-y-5">
          
          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-900 block">
              Choose Rental Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 4].map((weeks) => (
                <button
                  type="button"
                  key={weeks}
                  onClick={() => setDurationWeeks(weeks)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    durationWeeks === weeks
                      ? "border-zinc-900 bg-zinc-900 text-white shadow-2xs font-semibold"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-700 font-medium"
                  }`}
                >
                  <div className="text-xs">{weeks} {weeks === 1 ? "Week" : "Weeks"}</div>
                  <div className="text-sm font-bold mt-0.5">${weeklyPrice * weeks}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Banner Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-900 block">
              1500×500 Banner Image *
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-zinc-200 hover:border-zinc-400 rounded-xl p-5 text-center transition-colors bg-zinc-50/40 space-y-2"
            >
              <UploadCloud className="w-7 h-7 text-zinc-400 mx-auto" />
              <div className="text-xs font-medium text-zinc-700">
                {bannerPreview ? (
                  <span className="text-emerald-600 font-semibold">✓ Banner uploaded & previewing above! Click to change.</span>
                ) : (
                  <span>Click to browse or drag and drop your banner image (1500×500 recommended)</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400">PNG, JPG, or WebP up to 5MB</p>
            </div>
          </div>

          {/* Brand / Campaign Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">
                Brand / Project Name *
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Acme AI"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">
                Destination URL *
              </label>
              <input
                type="url"
                required
                value={brandUrl}
                onChange={(e) => setBrandUrl(e.target.value)}
                placeholder="https://acme.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-900 block">
              Tagline (Optional)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="The intelligent workspace for modern engineers"
              className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Alex"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="alex@acme.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-900 block">
                Your X / Twitter Handle
              </label>
              <input
                type="text"
                value={buyerTwitter}
                onChange={(e) => setBuyerTwitter(e.target.value)}
                placeholder="@alex"
                className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Secure checkout powered by Dodo Payments</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Rent Banner for ${totalPrice} ({durationWeeks} {durationWeeks === 1 ? "wk" : "wks"})</span>
                </>
              )}
            </button>
          </div>

        </form>
      </section>

      {/* Past Sponsors / Hall of Fame */}
      {pastSponsorships.length > 0 && (
        <section className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h3 className="text-sm font-bold text-zinc-900">
              Past Sponsors of @{creator.username}
            </h3>
            <span className="text-xs text-zinc-400 font-medium">
              {pastSponsorships.length} total
            </span>
          </div>

          <div className="divide-y divide-zinc-100">
            {pastSponsorships.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-700 font-bold flex items-center justify-center text-[11px] shrink-0 border border-zinc-200">
                    {item.brandName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 truncate">
                      {item.brandName}
                    </div>
                    {item.tagline && (
                      <p className="text-[11px] text-zinc-400 truncate max-w-sm">
                        {item.tagline}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-zinc-600 font-medium">
                    ${item.amountPaid.toFixed(0)} ({item.durationWeeks}w)
                  </span>
                  <a
                    href={`/api/click?id=${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-900 p-1 transition-colors"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
