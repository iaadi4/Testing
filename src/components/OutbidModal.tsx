"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Upload, ArrowUpRight, AlertCircle, Loader2 } from "lucide-react";

interface OutbidModalProps {
  isOpen: boolean;
  onClose: () => void;
  minBidToDethrone: number;
  currentPrice: number;
  activeSponsor: any;
}

export default function OutbidModal({
  isOpen,
  onClose,
  minBidToDethrone,
  currentPrice,
  activeSponsor,
}: OutbidModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [email, setEmail] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bidAmount, setBidAmount] = useState<number>(minBidToDethrone);
  const [isCustom, setIsCustom] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const bannerFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isCustom) {
      setBidAmount(minBidToDethrone);
    }
  }, [minBidToDethrone, isCustom]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3.5 * 1024 * 1024) {
      setErrorMessage("Banner image must be under 3.5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setBannerImageUrl(reader.result as string);
      setErrorMessage("");
    };
    reader.readAsDataURL(file);
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      setErrorMessage("Logo image must be under 1.5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!companyName.trim() || !websiteUrl.trim() || !email.trim() || !bannerImageUrl.trim()) {
      setErrorMessage("Please fill all required fields (Brand Name, Website, Email, and Banner).");
      return;
    }

    if (bidAmount < minBidToDethrone) {
      setErrorMessage(`Bid must be at least $${minBidToDethrone.toFixed(0)} to take the spot.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          websiteUrl: websiteUrl.trim(),
          email: email.trim(),
          bannerImageUrl,
          logoUrl: logoUrl.trim() || null,
          bidAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process bid");
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("Missing checkout destination");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl p-6 sm:p-7 z-10 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="pr-6 pb-4 border-b border-zinc-100">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">
            Outbid the Twitter Banner
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Starts at $1. Pay $1 more than current sponsor to replace it instantly on @iaadi8.
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs">
            <div className="px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-600">
              Current: <strong className="text-zinc-900">{activeSponsor ? `$${currentPrice.toFixed(0)} (${activeSponsor.companyName})` : "$0"}</strong>
            </div>
            <div className="px-2.5 py-1 rounded-md bg-zinc-900 text-white font-medium">
              Next Min: <strong>${minBidToDethrone.toFixed(0)}</strong>
            </div>
          </div>
        </div>

        {/* Outbid Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
          
          {/* Banner Upload */}
          <div>
            <label className="block text-xs font-semibold text-zinc-900 mb-1">
              Banner Image (1500 × 500) <span className="text-red-500">*</span>
            </label>

            {bannerImageUrl ? (
              <div className="relative aspect-[3/1] w-full rounded-xl border border-zinc-200 overflow-hidden group bg-zinc-50 mb-2">
                <img
                  src={bannerImageUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => bannerFileRef.current?.click()}
                  className="absolute inset-0 bg-black/40 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Change Image</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => bannerFileRef.current?.click()}
                className="border-2 border-dashed border-zinc-200 hover:border-zinc-300 rounded-xl p-4 text-center cursor-pointer transition-colors bg-zinc-50/50 hover:bg-zinc-50"
              >
                <Upload className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-zinc-700">Upload banner image</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">PNG, JPG, or SVG up to 3.5MB</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-1.5">
              <input
                ref={bannerFileRef}
                type="file"
                accept="image/*"
                onChange={handleBannerFile}
                className="hidden"
              />
              <input
                type="url"
                placeholder="Or paste banner image URL..."
                value={bannerImageUrl.startsWith("data:") ? "" : bannerImageUrl}
                onChange={(e) => setBannerImageUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Acme Inc"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Website URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                placeholder="https://acme.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="founder@acme.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-900 mb-1">
                Logo (Optional)
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="URL or upload"
                  value={logoUrl.startsWith("data:") ? "Logo uploaded" : logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => logoFileRef.current?.click()}
                  className="px-2.5 py-2 rounded-xl border border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFile}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Bid Amount */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-900">
                Your Outbid Amount
              </span>
              <span className="text-sm font-bold text-zinc-900 font-mono">
                ${bidAmount.toFixed(0)} USD
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setBidAmount(minBidToDethrone);
                  setIsCustom(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  !isCustom && bidAmount === minBidToDethrone
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                Min (${minBidToDethrone.toFixed(0)})
              </button>

              <button
                type="button"
                onClick={() => {
                  setBidAmount(minBidToDethrone + 5);
                  setIsCustom(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  !isCustom && bidAmount === minBidToDethrone + 5
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                +$5 (${(minBidToDethrone + 5).toFixed(0)})
              </button>

              <button
                type="button"
                onClick={() => {
                  setBidAmount(minBidToDethrone + 10);
                  setIsCustom(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  !isCustom && bidAmount === minBidToDethrone + 10
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                +$10 (${(minBidToDethrone + 10).toFixed(0)})
              </button>

              <div className="relative flex-1 min-w-[90px]">
                <input
                  type="number"
                  min={minBidToDethrone}
                  step="1"
                  placeholder="Custom $"
                  value={isCustom ? bidAmount : ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setIsCustom(true);
                    setBidAmount(isNaN(val) ? minBidToDethrone : val);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                <span>Redirecting to Checkout...</span>
              </>
            ) : (
              <>
                <span>Outbid for ${bidAmount.toFixed(0)}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-300" />
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-zinc-400">
            Processed securely with Dodo Payments. Banner updates live on @iaadi8 immediately upon payment.
          </p>
        </form>
      </div>
    </div>
  );
}
