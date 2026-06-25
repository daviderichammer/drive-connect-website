"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Settlement {
  id: number;
  settlementReference: string;
  opportunityReference: string;
  sippCode: string;
  sippName: string;
  marketName: string;
  pickupDate: string;
  dropoffDate: string;
  rentalDays: number;
  operatorId: number;
  operatorName: string;
  operatorEmail: string;
  retailPriceTotal: number;
  winningBidTotal: number;
  operatorMarginTotal: number;
  platformRevenue: number;
  paymentProcessingFee: number;
  acquisitionCost: number;
  status: string;
  operatorNotifiedAt: string | null;
  chargedAt: string | null;
  completedAt: string | null;
  adminNotes: string | null;
  createdAt: string;
}

interface Stats {
  total: number;
  totalPending: number;
  totalSettled: number;
  totalRevenue: number;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  charged: "bg-blue-900/50 text-blue-300 border-blue-700",
  completed: "bg-green-900/50 text-green-300 border-green-700",
  disputed: "bg-orange-900/50 text-orange-300 border-orange-700",
  refunded: "bg-red-900/30 text-red-400 border-red-800",
};

export default function AdminSettlementsPage() {
  const router = useRouter();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [notes, setNotes] = useState("");

  const fetchSettlements = useCallback(async () => {
    try {
      const url = statusFilter === "all" ? "/api/admin/settlements" : `/api/admin/settlements?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.success) {
        setSettlements(data.settlements);
        setStats(data.stats);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [statusFilter, router]);

  useEffect(() => { fetchSettlements(); }, [fetchSettlements]);

  const handleAction = async (settlementId: number, action: string) => {
    setUpdating(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settlementId, action, adminNotes: notes || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Settlement ${action}d successfully.`);
        fetchSettlements();
        setSelectedSettlement(null);
      } else {
        setMessage(data.error || "Failed.");
      }
    } catch { setMessage("Network error."); }
    finally { setUpdating(false); }
  };

  const formatCurrency = (n: number) => `$${Number(n).toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
            <h1 className="text-xl font-bold text-white">Settlements</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/pricing" className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">Pricing</Link>
            <Link href="/admin/bidding" className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">Bidding</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Settlements", value: stats.total, color: "text-white" },
              { label: "Pending", value: stats.totalPending, color: "text-yellow-400" },
              { label: "Completed", value: stats.totalSettled, color: "text-green-400" },
              { label: "Platform Revenue", value: formatCurrency(stats.totalRevenue), color: "text-green-400" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-900/30 text-green-300 border border-green-700" : "bg-red-900/30 text-red-300 border border-red-700"}`}>
            {message}
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "charged", "completed", "disputed", "refunded"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded text-sm font-medium capitalize transition-colors ${
                statusFilter === f ? "bg-red-600 text-white" : "bg-gray-900 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {!loading && settlements.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-2">No Settlements Yet</h3>
            <p className="text-gray-400">Settlements appear here after bids are accepted.</p>
          </div>
        )}

        {!loading && settlements.length > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  {["Reference", "Operator", "Market / SIPP", "Dates", "Retail", "Bid", "Platform Rev.", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left text-gray-400 text-xs font-bold px-3 py-3 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {settlements.map((s) => (
                  <tr key={s.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <td className="px-3 py-3">
                      <p className="font-mono text-xs text-gray-400">{s.settlementReference}</p>
                      <p className="font-mono text-xs text-gray-600">{s.opportunityReference}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-white text-sm font-semibold">{s.operatorName}</p>
                      <p className="text-gray-500 text-xs">{s.operatorEmail}</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-white text-sm">{s.marketName}</p>
                      <span className="bg-gray-800 text-gray-300 text-xs px-1.5 py-0.5 rounded font-bold">{s.sippCode}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-300 text-xs whitespace-nowrap">
                      {formatDate(s.pickupDate)} –<br />{formatDate(s.dropoffDate)}
                    </td>
                    <td className="px-3 py-3 text-white font-bold text-sm">{formatCurrency(s.retailPriceTotal)}</td>
                    <td className="px-3 py-3 text-red-400 font-bold text-sm">{formatCurrency(s.winningBidTotal)}</td>
                    <td className="px-3 py-3 text-green-400 font-bold text-sm">{formatCurrency(s.platformRevenue)}</td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded border font-bold capitalize ${STATUS_STYLES[s.status] || "bg-gray-800 text-gray-400"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => { setSelectedSettlement(s); setNotes(s.adminNotes || ""); }}
                        className="text-blue-400 hover:text-blue-300 text-xs"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settlement Management Modal */}
      {selectedSettlement && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold text-white mb-4">Manage Settlement</h3>
            <p className="font-mono text-xs text-gray-500 mb-4">{selectedSettlement.settlementReference}</p>

            <div className="space-y-2 mb-4">
              {[
                ["Operator", selectedSettlement.operatorName],
                ["Retail Total", formatCurrency(selectedSettlement.retailPriceTotal)],
                ["Winning Bid", formatCurrency(selectedSettlement.winningBidTotal)],
                ["Operator Margin", formatCurrency(selectedSettlement.operatorMarginTotal)],
                ["Platform Revenue", formatCurrency(selectedSettlement.platformRevenue)],
                ["Current Status", selectedSettlement.status],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 text-xs mb-1">Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600 resize-none"
                placeholder="Add notes..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {selectedSettlement.status === "pending" && (
                <button onClick={() => handleAction(selectedSettlement.id, "charge")} disabled={updating}
                  className="bg-blue-700 hover:bg-blue-600 disabled:bg-gray-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  Mark Charged
                </button>
              )}
              {(selectedSettlement.status === "pending" || selectedSettlement.status === "charged") && (
                <button onClick={() => handleAction(selectedSettlement.id, "complete")} disabled={updating}
                  className="bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  Mark Complete
                </button>
              )}
              {selectedSettlement.status !== "disputed" && selectedSettlement.status !== "refunded" && (
                <button onClick={() => handleAction(selectedSettlement.id, "dispute")} disabled={updating}
                  className="bg-orange-700 hover:bg-orange-600 disabled:bg-gray-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  Mark Disputed
                </button>
              )}
              {selectedSettlement.status !== "refunded" && (
                <button onClick={() => handleAction(selectedSettlement.id, "refund")} disabled={updating}
                  className="bg-red-700 hover:bg-red-600 disabled:bg-gray-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                  Mark Refunded
                </button>
              )}
              <button onClick={() => handleAction(selectedSettlement.id, "notes")} disabled={updating}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white text-sm font-bold py-2 rounded-lg transition-colors">
                Save Notes
              </button>
            </div>

            <button
              onClick={() => setSelectedSettlement(null)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
