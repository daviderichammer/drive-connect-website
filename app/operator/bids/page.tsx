"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Bid {
  id: number;
  opportunityId: number;
  opportunityReference: string;
  sippCode: string;
  sippName: string;
  marketName: string;
  pickupLocation: string;
  pickupDate: string;
  dropoffDate: string;
  rentalDays: number;
  retailPricePerDay: number;
  retailPriceTotal: number;
  bidPerDay: number;
  bidTotal: number;
  estimatedMarginPerDay: number;
  estimatedMarginTotal: number;
  status: string;
  opportunityStatus: string;
  biddingClosesAt: string;
  submittedAt: string;
  withdrawnAt: string | null;
  notes: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  won: "bg-green-900/50 text-green-300 border-green-700",
  lost: "bg-gray-800 text-gray-400 border-gray-700",
  withdrawn: "bg-red-900/30 text-red-400 border-red-800",
};

export default function OperatorBidsPage() {
  const router = useRouter();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchBids = useCallback(async () => {
    try {
      const res = await fetch("/api/operator/bids");
      if (res.status === 401) { router.push("/host/login"); return; }
      const data = await res.json();
      if (data.success) setBids(data.bids);
      else setError(data.error || "Failed to load bids.");
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchBids(); }, [fetchBids]);

  const handleWithdraw = async (bidId: number) => {
    if (!confirm("Are you sure you want to withdraw this bid? This cannot be undone.")) return;
    setWithdrawing(bidId);
    try {
      const res = await fetch(`/api/operator/bid?bidId=${bidId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBids((prev) => prev.map((b) => b.id === bidId ? { ...b, status: "withdrawn" } : b));
      } else {
        alert(data.error || "Failed to withdraw bid.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setWithdrawing(null);
    }
  };

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const filteredBids = filter === "all" ? bids : bids.filter((b) => b.status === filter);

  const stats = {
    total: bids.length,
    pending: bids.filter((b) => b.status === "pending").length,
    won: bids.filter((b) => b.status === "won").length,
    totalMarginWon: bids.filter((b) => b.status === "won").reduce((sum, b) => sum + b.estimatedMarginTotal, 0),
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/operator/opportunities" className="text-gray-400 hover:text-white text-sm">← Opportunities</Link>
            <h1 className="text-xl font-bold text-white">My Bids</h1>
          </div>
          <Link href="/operator/opportunities" className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
            Browse Opportunities
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bids", value: stats.total, color: "text-white" },
            { label: "Active Bids", value: stats.pending, color: "text-yellow-400" },
            { label: "Bids Won", value: stats.won, color: "text-green-400" },
            { label: "Margin Won", value: formatCurrency(stats.totalMarginWon), color: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "won", "lost", "withdrawn"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-red-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400">Loading your bids...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-center">{error}</div>
        )}

        {!loading && filteredBids.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-2">No Bids Found</h3>
            <p className="text-gray-400 mb-6">
              {filter === "all" ? "You haven't placed any bids yet." : `No ${filter} bids.`}
            </p>
            <Link href="/operator/opportunities" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors">
              Browse Opportunities
            </Link>
          </div>
        )}

        {!loading && filteredBids.length > 0 && (
          <div className="grid gap-4">
            {filteredBids.map((bid) => (
              <div key={bid.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-xs font-mono text-gray-500">{bid.opportunityReference}</span>
                      <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-bold">{bid.sippCode}</span>
                      <span className="text-gray-500 text-xs">{bid.sippName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded border font-bold capitalize ${STATUS_STYLES[bid.status] || "bg-gray-800 text-gray-400"}`}>
                        {bid.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Market</p>
                        <p className="text-white font-semibold text-sm">{bid.marketName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Pickup</p>
                        <p className="text-white font-semibold text-sm">{formatDate(bid.pickupDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Return</p>
                        <p className="text-white font-semibold text-sm">{formatDate(bid.dropoffDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Duration</p>
                        <p className="text-white font-semibold text-sm">{bid.rentalDays} days</p>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm">📍 {bid.pickupLocation}</p>
                    <p className="text-gray-600 text-xs mt-1">Submitted {formatDate(bid.submittedAt)}</p>
                  </div>

                  <div className="lg:w-72 grid grid-cols-2 gap-3">
                    <div className="bg-black rounded-lg p-3 border border-gray-800">
                      <p className="text-gray-500 text-xs mb-1">Retail total</p>
                      <p className="text-white font-bold">{formatCurrency(bid.retailPriceTotal)}</p>
                    </div>
                    <div className="bg-black rounded-lg p-3 border border-gray-800">
                      <p className="text-gray-500 text-xs mb-1">Your bid total</p>
                      <p className="text-red-400 font-bold">{formatCurrency(bid.bidTotal)}</p>
                    </div>
                    <div className="bg-black rounded-lg p-3 border border-gray-800">
                      <p className="text-gray-500 text-xs mb-1">Bid/day</p>
                      <p className="text-red-400 font-bold">{formatCurrency(bid.bidPerDay)}</p>
                    </div>
                    <div className="bg-black rounded-lg p-3 border border-green-900">
                      <p className="text-gray-500 text-xs mb-1">Est. margin</p>
                      <p className="text-green-400 font-bold">{formatCurrency(bid.estimatedMarginTotal)}</p>
                    </div>
                  </div>

                  {bid.status === "pending" && new Date(bid.biddingClosesAt) > new Date() && (
                    <div className="lg:w-36 flex items-center">
                      <button
                        onClick={() => handleWithdraw(bid.id)}
                        disabled={withdrawing === bid.id}
                        className="w-full bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-300 border border-gray-700 hover:border-red-700 text-sm font-medium py-2 px-3 rounded-lg transition-all disabled:opacity-50"
                      >
                        {withdrawing === bid.id ? "Withdrawing..." : "Withdraw"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
