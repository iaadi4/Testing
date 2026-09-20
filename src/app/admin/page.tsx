"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Check,
  RefreshCw,
  ExternalLink,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";

type Creator = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  followersCount: number;
  weeklyPrice: number;
  category: string;
  isVerified: boolean;
  isListingActive: boolean;
  removedAt: string | null;
  bookingCount: number;
  gmv: number;
};

type Tx = {
  id: string;
  creatorId: string;
  buyerEmail: string;
  brandName: string;
  amountPaid: number;
  durationWeeks: number;
  status: string;
  dodoPaymentId: string | null;
  clicksCount: number;
  refundDue: boolean;
  createdAt: string;
  startDate: string | null;
  creator?: { username: string; name: string };
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<"creators" | "transactions">("creators");
  const [creators, setCreators] = useState<Creator[]>([]);
  const [sponsorships, setSponsorships] = useState<Tx[]>([]);
  const [metrics, setMetrics] = useState<{ totalCreators: number; totalBookings: number; totalGmv: number; refundDue: number } | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [refundOnly, setRefundOnly] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);

  const adminFetch = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  };

  const loadData = async (extra: Record<string, unknown> = {}, quiet = false) => {
    setLoading(true);
    if (!quiet) setError(null);
    try {
      const data = await adminFetch({
        action: "getData",
        status,
        search,
        creatorId: creatorFilter || selectedCreator || "",
        refundDue: refundOnly,
        ...extra,
      });
      setCreators(data.creators || []);
      setSponsorships(data.sponsorships || []);
      setMetrics(data.metrics || null);
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      if (!quiet) setError(err instanceof Error ? err.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData({}, true).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await adminFetch({ action: "login", password });
      setPassword("");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const mutate = async (payload: Record<string, unknown>, success: string) => {
    try {
      await adminFetch(payload);
      showSuccess(success);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    }
  };

  const exportCsv = () => {
    const header = "id,creator,brand,email,amount,status,paymentId,clicks,refundDue,createdAt\n";
    const rows = sponsorships
      .map((s) =>
        [
          s.id,
          s.creator?.username || "",
          s.brandName,
          s.buyerEmail,
          s.amountPaid,
          s.status,
          s.dodoPaymentId || "",
          s.clicksCount,
          s.refundDue,
          s.createdAt,
        ].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const selected = useMemo(
    () => creators.find((c) => c.id === selectedCreator) || null,
    [creators, selectedCreator]
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-2xl border border-zinc-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-zinc-900" />
            <h1 className="text-base font-bold text-zinc-900">Admin Authentication</h1>
          </div>
          {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-zinc-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Unlock Admin Panel
            </button>
          </form>
          <Link href="/" className="block text-center text-xs text-zinc-400">← Return to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 pb-16">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold">Platform Admin</h1>
            <p className="text-[11px] text-zinc-500">Marketplace Management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => loadData()} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => mutate({ action: "logout" }, "Logged out")}
            className="text-xs text-zinc-500 hover:text-zinc-900"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" /> {successMsg}
          </div>
        )}
        {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">{error}</div>}

        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Metric label="Registered Creators" value={String(metrics.totalCreators)} />
            <Metric label="Paid Bookings" value={String(metrics.totalBookings)} />
            <Metric label="Platform GMV" value={`$${metrics.totalGmv.toFixed(0)}`} />
            <Metric label="Refunds due" value={String(metrics.refundDue)} />
          </div>
        )}

        <div className="flex gap-2">
          {(["creators", "transactions"] as const).map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${tab === id ? "bg-zinc-900 text-white" : "bg-white border border-zinc-200"}`}
            >
              {id === "creators" ? `Creators (${creators.length})` : "Transactions"}
            </button>
          ))}
        </div>

        {tab === "creators" ? (
          <section className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400">
                    <th className="py-2 pr-4">Creator</th>
                    <th className="py-2 px-4">Followers</th>
                    <th className="py-2 px-4">Rate</th>
                    <th className="py-2 px-4">GMV</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {creators.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2.5">
                          <img src={c.avatarUrl || "/avatar.png"} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="font-semibold flex items-center gap-1">
                              {c.name}
                              {c.isVerified && <CheckCircle2 className="w-3 h-3 text-[#1d9bf0]" />}
                            </div>
                            <span className="text-zinc-500">@{c.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{c.followersCount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          defaultValue={c.weeklyPrice}
                          className="w-16 border border-zinc-200 rounded px-1 py-0.5"
                          onBlur={(e) => {
                            const next = Number(e.target.value);
                            if (next !== c.weeklyPrice) {
                              mutate({ action: "updateCreator", creatorId: c.id, weeklyPrice: next }, "Price updated");
                            }
                          }}
                        />
                      </td>
                      <td className="py-3 px-4">${c.gmv.toFixed(0)}</td>
                      <td className="py-3 px-4">
                        {c.removedAt ? (
                          <span className="text-rose-600 font-bold">Removed</span>
                        ) : (
                          <button
                            onClick={() =>
                              mutate(
                                { action: "toggleCreatorActive", creatorId: c.id, isListingActive: !c.isListingActive },
                                "Creator status updated"
                              )
                            }
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${c.isListingActive ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}
                          >
                            {c.isListingActive ? "Active" : "Paused"}
                          </button>
                        )}
                      </td>
                      <td className="py-3 pl-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedCreator(c.id);
                            setTab("transactions");
                            setCreatorFilter(c.id);
                            loadData({ creatorId: c.id });
                          }}
                          className="text-zinc-600 hover:text-zinc-900"
                        >
                          Transactions
                        </button>
                        <Link href={`/${c.username}`} target="_blank" className="inline-flex items-center gap-1 text-zinc-500">
                          Storefront <ExternalLink className="w-3 h-3" />
                        </Link>
                        {c.removedAt ? (
                          <button
                            onClick={() => mutate({ action: "restoreCreator", creatorId: c.id }, "Creator restored")}
                            className="text-emerald-700"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (confirm(`Remove @${c.username}? Their listing will be hidden and transactions kept.`)) {
                                mutate({ action: "removeCreator", creatorId: c.id }, "Creator removed");
                              }
                            }}
                            className="text-rose-600"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
            {selected && (
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
                Viewing @{selected.username}: {selected.bookingCount} paid bookings, ${selected.gmv.toFixed(0)} GMV
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brand, email, payment id"
                className="px-2 py-1.5 border border-zinc-200 rounded-lg text-xs"
              />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-2 py-1.5 border border-zinc-200 rounded-lg text-xs">
                <option value="">All statuses</option>
                {["PENDING", "AWAITING_APPROVAL", "ACTIVE", "COMPLETED", "CANCELLED"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={refundOnly} onChange={(e) => setRefundOnly(e.target.checked)} />
                Refund due
              </label>
              <button onClick={() => loadData()} className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs">Filter</button>
              <button onClick={exportCsv} className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400">
                    <th className="py-2 pr-4">Banner</th>
                    <th className="py-2 px-4">Creator</th>
                    <th className="py-2 px-4">Brand</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Payment</th>
                    <th className="py-2 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {sponsorships.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 pr-4">
                        <img src={`/api/banner/${s.id}`} alt="" className="w-16 h-6 object-cover rounded border border-zinc-200" />
                      </td>
                      <td className="py-3 px-4">@{s.creator?.username}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold">{s.brandName}</div>
                        <div className="text-zinc-400">{s.buyerEmail}</div>
                      </td>
                      <td className="py-3 px-4">${s.amountPaid.toFixed(0)}</td>
                      <td className="py-3 px-4">
                        <select
                          value={s.status}
                          onChange={(e) =>
                            mutate(
                              { action: "updateSponsorshipStatus", sponsorshipId: s.id, status: e.target.value },
                              "Status updated"
                            )
                          }
                          className="px-2 py-0.5 border border-zinc-200 rounded-full"
                        >
                          {["PENDING", "AWAITING_APPROVAL", "ACTIVE", "COMPLETED", "CANCELLED"].map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                        {s.refundDue && <div className="text-rose-600 font-bold mt-1">Refund due</div>}
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px]">{s.dodoPaymentId || "—"}</td>
                      <td className="py-3 pl-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm("Delete this sponsorship?")) {
                              mutate({ action: "deleteSponsorship", sponsorshipId: s.id }, "Deleted");
                            }
                          }}
                          className="text-zinc-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-zinc-200/80">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
