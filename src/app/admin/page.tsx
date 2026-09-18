"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  Trash2, 
  Download, 
  RefreshCw, 
  Settings, 
  DollarSign, 
  Users,
  Loader2,
  Lock
} from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState<any>(null);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    profileName: "",
    twitterHandle: "",
    profileBio: "",
    profileLocation: "",
    profileWebsite: "",
    followersCount: 109,
    followingCount: 85,
    weekPrice: 29,
    monthPrice: 89,
    yearPrice: 499,
    lifetimePrice: 1299,
    minOutbidIncrement: 10,
  });

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

      setSettings(data.settings);
      setSponsors(data.sponsors);
      setFormData({
        profileName: data.settings?.profileName || "Aditya",
        twitterHandle: data.settings?.twitterHandle || "@iaadi8",
        profileBio: data.settings?.profileBio || "SWE Intern | 21",
        profileLocation: data.settings?.profileLocation || "India",
        profileWebsite: data.settings?.profileWebsite || "adityacodes.site",
        followersCount: data.settings?.followersCount ?? 109,
        followingCount: data.settings?.followingCount ?? 85,
        weekPrice: data.settings?.weekPrice ?? 29,
        monthPrice: data.settings?.monthPrice ?? 89,
        yearPrice: data.settings?.yearPrice ?? 499,
        lifetimePrice: data.settings?.lifetimePrice ?? 1299,
        minOutbidIncrement: data.settings?.minOutbidIncrement ?? 10,
      });

      setIsAuthenticated(true);
      sessionStorage.setItem("tb_admin_pwd", pwd);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("tb_admin_pwd");
    if (saved) {
      setPassword(saved);
      loadData(saved);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(password);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateSettings",
          password,
          ...formData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setSuccessMsg("Settings updated successfully!");
      setSettings(data.settings);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetActiveSponsor = async (sponsorId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setActiveSponsor",
          password,
          sponsorId,
        }),
      });
      if (res.ok) {
        setSuccessMsg("Active banner updated!");
        loadData(password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSponsor = async (sponsorId: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteSponsor",
          password,
          sponsorId,
        }),
      });
      if (res.ok) {
        setSuccessMsg("Sponsor removed.");
        loadData(password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white border border-zinc-200 p-6 sm:p-8 text-center shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5" />
          </div>

          <h1 className="text-lg font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-0.5 mb-5">Enter password to manage twitterbanner.lol</p>

          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs text-zinc-900 focus:outline-none focus:bg-white focus:border-zinc-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>

          <Link href="/" className="inline-block mt-5 text-xs text-zinc-400 hover:text-zinc-700">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb] text-zinc-900 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <span>twitterbanner.lol Admin</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  @iaadi8
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadData(password)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("tb_admin_pwd");
                setIsAuthenticated(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-700"
            >
              Log Out
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Total Sponsors</p>
            <p className="text-xl font-black text-zinc-900 mt-0.5">{sponsors.length}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Total Revenue</p>
            <p className="text-xl font-black text-emerald-600 font-mono mt-0.5">
              ${sponsors.reduce((acc, s) => acc + (s.status !== "PENDING" ? s.amountPaid : 0), 0).toFixed(0)}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Active Banner</p>
            <p className="text-xs font-bold text-zinc-900 mt-1 truncate">
              {sponsors.find((s) => s.id === settings?.activeSponsorId)?.companyName || "Default"}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <p className="text-[10px] text-zinc-400 uppercase font-semibold">Outbound Clicks</p>
            <p className="text-xl font-black text-zinc-900 font-mono mt-0.5">
              {sponsors.reduce((acc, s) => acc + s.clicksCount, 0)}
            </p>
          </div>
        </div>

        {/* Sponsors Table */}
        <div className="rounded-xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-zinc-600" />
              <span>Sponsor Orders & Bids</span>
            </h2>
            <span className="text-xs text-zinc-400">{sponsors.length} entries</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Banner</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {sponsors.map((s) => {
                  const isActive = settings?.activeSponsorId === s.id;
                  return (
                    <tr key={s.id} className={isActive ? "bg-emerald-50/50" : "hover:bg-zinc-50"}>
                      <td className="p-3">
                        <div className="font-bold text-zinc-900 flex items-center gap-1">
                          <span>{s.companyName}</span>
                          <a href={s.websiteUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                          </a>
                        </div>
                        <p className="text-[11px] text-zinc-500">{s.email}</p>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-zinc-800 font-bold">${s.amountPaid.toFixed(0)}</span>
                        <span className="text-[10px] text-zinc-400 block font-mono uppercase">{s.durationType}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : s.status === "ACTIVE"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-zinc-100 text-zinc-600"
                          }`}
                        >
                          {isActive ? "LIVE" : s.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{s.clicksCount}</td>
                      <td className="p-3">
                        {s.bannerImageUrl && s.bannerImageUrl.startsWith("http") ? (
                          <a
                            href={s.bannerImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sky-600 hover:underline"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        ) : (
                          <div
                            className="w-12 h-4 rounded border border-zinc-300"
                            style={{ background: s.bannerImageUrl || "#111" }}
                          />
                        )}
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        {!isActive && (
                          <button
                            onClick={() => handleSetActiveSponsor(s.id)}
                            className="px-2 py-1 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold rounded text-[10px]"
                          >
                            Set Live
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSponsor(s.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Controls & Webhook Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Pricing Settings ($)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">1 Week ($)</label>
                <input
                  type="number"
                  value={formData.weekPrice}
                  onChange={(e) => setFormData({ ...formData, weekPrice: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">1 Month ($)</label>
                <input
                  type="number"
                  value={formData.monthPrice}
                  onChange={(e) => setFormData({ ...formData, monthPrice: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">1 Year ($)</label>
                <input
                  type="number"
                  value={formData.yearPrice}
                  onChange={(e) => setFormData({ ...formData, yearPrice: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-zinc-500 mb-1">Lifetime ($)</label>
                <input
                  type="number"
                  value={formData.lifetimePrice}
                  onChange={(e) => setFormData({ ...formData, lifetimePrice: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-zinc-500 mb-1">Min Outbid Increment ($)</label>
                <input
                  type="number"
                  value={formData.minOutbidIncrement}
                  onChange={(e) => setFormData({ ...formData, minOutbidIncrement: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="mt-4 w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-all"
            >
              Save Pricing
            </button>
          </div>

          <div className="p-5 rounded-xl bg-white border border-zinc-200 shadow-xs text-xs space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Dodo Payments Webhook</span>
            </h3>
            <p className="text-zinc-500 leading-relaxed">
              Add this webhook URL in your Dodo Payments Dashboard under Webhooks:
            </p>
            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 font-mono text-[11px] text-zinc-800 select-all">
              https://twitterbanner.lol/api/webhooks/dodo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
