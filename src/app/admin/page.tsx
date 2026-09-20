"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Trash2, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Download, 
  DollarSign, 
  Users,
  Loader2,
  Lock,
  Eye,
  CheckCircle2,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [creators, setCreators] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async (pwd: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getData", password: pwd }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setCreators(data.creators || []);
      setSponsorships(data.sponsorships || []);
      setMetrics(data.metrics || null);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(password);
  };

  const handleToggleCreator = async (creatorId: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggleCreatorActive",
          password,
          creatorId,
          isListingActive: !currentActive,
        }),
      });

      if (res.ok) {
        setCreators((prev) =>
          prev.map((c) => (c.id === creatorId ? { ...c, isListingActive: !currentActive } : c))
        );
        showSuccess("Creator status updated");
      }
    } catch {
      setError("Failed to update creator status");
    }
  };

  const handleUpdateSponsorshipStatus = async (sponsorshipId: string, status: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSponsorshipStatus",
          password,
          sponsorshipId,
          status,
        }),
      });

      if (res.ok) {
        setSponsorships((prev) =>
          prev.map((s) => (s.id === sponsorshipId ? { ...s, status } : s))
        );
        showSuccess("Sponsorship status updated");
      }
    } catch {
      setError("Failed to update sponsorship status");
    }
  };

  const handleDeleteSponsorship = async (sponsorshipId: string) => {
    if (!confirm("Are you sure you want to delete this sponsorship?")) return;

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteSponsorship",
          password,
          sponsorshipId,
        }),
      });

      if (res.ok) {
        setSponsorships((prev) => prev.filter((s) => s.id !== sponsorshipId));
        showSuccess("Sponsorship deleted");
      }
    } catch {
      setError("Failed to delete sponsorship");
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-zinc-900" />
            <h1 className="text-base font-bold text-zinc-900">Admin Authentication</h1>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-zinc-400 hover:text-zinc-600">
              ← Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 pb-16 font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-zinc-900">Platform Admin</h1>
            <p className="text-[11px] text-zinc-500">Marketplace Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData(password)}
            disabled={loading}
            className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Metrics Row */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-2xs">
              <div className="text-xs text-zinc-500 font-medium">Registered Creators</div>
              <div className="text-2xl font-extrabold text-zinc-900 mt-1">{metrics.totalCreators}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-2xs">
              <div className="text-xs text-zinc-500 font-medium">Total Bookings</div>
              <div className="text-2xl font-extrabold text-zinc-900 mt-1">{metrics.totalBookings}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-zinc-200/80 shadow-2xs">
              <div className="text-xs text-zinc-500 font-medium">Platform GMV</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">${metrics.totalGmv.toFixed(0)}</div>
            </div>
          </div>
        )}

        {/* Creators Table */}
        <section className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-900">
              Creators ({creators.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 font-medium">
                  <th className="py-2 pr-4">Creator</th>
                  <th className="py-2 px-4">Followers</th>
                  <th className="py-2 px-4">Rate</th>
                  <th className="py-2 px-4">Category</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {creators.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={c.avatarUrl || "/avatar.png"}
                          alt={c.name}
                          className="w-7 h-7 rounded-full object-cover border border-zinc-200"
                        />
                        <div>
                          <div className="font-semibold text-zinc-900 flex items-center gap-1">
                            <span>{c.name}</span>
                            {c.isVerified && <CheckCircle2 className="w-3 h-3 text-[#1d9bf0]" />}
                          </div>
                          <span className="text-zinc-500 text-[11px]">@{c.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-700">
                      {c.followersCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-zinc-900">
                      ${c.weeklyPrice}/wk
                    </td>
                    <td className="py-3 px-4 text-zinc-500">
                      {c.category}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleCreator(c.id, c.isListingActive)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isListingActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {c.isListingActive ? "Active" : "Paused"}
                      </button>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <Link
                        href={`/${c.username}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-900 font-medium"
                      >
                        <span>Storefront</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Sponsorships Table */}
        <section className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-sm font-bold text-zinc-900">
              Sponsorship Orders ({sponsorships.length})
            </h2>
          </div>

          {sponsorships.length === 0 ? (
            <p className="text-xs text-zinc-400 py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-medium">
                    <th className="py-2 pr-4">Banner</th>
                    <th className="py-2 px-4">Creator</th>
                    <th className="py-2 px-4">Brand / Buyer</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Duration</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {sponsorships.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 pr-4">
                        <img
                          src={s.bannerImageUrl}
                          alt={s.brandName}
                          className="w-16 h-6 object-cover rounded border border-zinc-200"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-800">
                        @{s.creator?.username || "creator"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900">{s.brandName}</div>
                        <div className="text-[11px] text-zinc-400">{s.buyerEmail}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-zinc-900">
                        ${s.amountPaid.toFixed(0)}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {s.durationWeeks}w
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={s.status}
                          onChange={(e) => handleUpdateSponsorshipStatus(s.id, e.target.value)}
                          className="px-2 py-0.5 text-[11px] font-bold rounded-full border border-zinc-200 bg-white"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="PENDING">PENDING</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="py-3 pl-4 text-right">
                        <button
                          onClick={() => handleDeleteSponsorship(s.id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-1"
                          title="Delete order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
