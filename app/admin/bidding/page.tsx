"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SippCode { code: string; name: string }
interface Market { marketName: string }
interface Settlement { id: number; status: string; winningBidTotal: number }
interface Opportunity {
  id: number;
  opportunityReference: string;
  sippCode: SippCode;
  market: Market;
  pickupLocation: string;
  pickupDate: string;
  dropoffDate: string;
  rentalDays: number;
  retailPricePerDay: number;
  retailPriceTotal: number;
  minimumBidPerDay: number;
  minimumBidTotal: number;
  biddingClosesAt: string;
  status: string;
  _count: { bids: number };
  settlement: Settlement | null;
}

interface Bid {
  id: number;
  operatorId: number;
  bidPerDay: number;
  bidTotal: number;
  estimatedMarginPerDay: number;
  estimatedMarginTotal: number;
  status: string;
  submittedAt: string;
  operator: { id: number; businessName: string; email: string; ownerName: string };
}

const STATUS_COLORS: Record<string, string> = {
  open: "bg-green-900/50 text-green-300 border-green-700",
  closed: "bg-gray-800 text-gray-400 border-gray-700",
  awarded: "bg-blue-900/50 text-blue-300 border-blue-700",
  cancelled: "bg-red-900/30 text-red-400 border-red-800",
};

export default function AdminBiddingPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [accepting, setAccepting] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    sippCode: "ECAR", marketCode: "MIA", pickupDate: "", dropoffDate: "",
    pickupLocation: "", dropoffLocation: "", renterName: "", renterEmail: "",
    biddingWindowHours: 4, demandLevel: "normal",
  });
  const [creating, setCreating] = useState(false);

  const fetchOpportunities = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/bids?status=${statusFilter}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.success) setOpportunities(data.opportunities);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [statusFilter, router]);

  useEffect(() => { fetchOpportunities(); }, [fetchOpportunities]);

  const fetchBids = async (opp: Opportunity) => {
    setSelectedOpp(opp);
    setBidsLoading(true);
    try {
      const res = await fetch(`/api/admin/bids?opportunityId=${opp.id}`);
      const data = await res.json();
      if (data.success) setBids(data.bids);
    } catch (e) { console.error(e); }
    finally { setBidsLoading(false); }
  };

  const handleAccept = async (opportunityId: number, bidId: number) => {
    setAccepting(bidId);
    setMessage("");
    try {
      const res = await fetch("/api/admin/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept", opportunityId, bidId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Winning bid accepted. Settlement created.");
        fetchOpportunities();
        if (selectedOpp) fetchBids(selectedOpp);
      } else {
        setMessage(data.error || "Failed to accept bid.");
      }
    } catch { setMessage("Network error."); }
    finally { setAccepting(null); }
  };

  const handleAutoAccept = async (opportunityId: number) => {
    setMessage("");
    try {
      const res = await fetch("/api/admin/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "auto_accept", opportunityId }),
      });
      const data = await res.json();
      setMessage(data.success ? "Lowest bid auto-accepted." : data.error || "Failed.");
      if (data.success) { fetchOpportunities(); if (selectedOpp) fetchBids(selectedOpp); }
    } catch { setMessage("Network error."); }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_opportunity", ...createForm }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Opportunity created successfully.");
        setShowCreateForm(false);
        fetchOpportunities();
      } else {
        setMessage(data.error || "Failed to create opportunity.");
      }
    } catch { setMessage("Network error."); }
    finally { setCreating(false); }
  };

  const formatCurrency = (n: number) => `$${Number(n).toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
            <h1 className="text-xl font-bold text-white">Bidding Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/pricing" className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">Pricing</Link>
            <Link href="/admin/settlements" className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">Settlements</Link>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-1.5 rounded-lg transition-colors"
            >
              + New Opportunity
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes("success") || message.includes("accepted") || message.includes("created") ? "bg-green-900/30 text-green-300 border border-green-700" : "bg-red-900/30 text-red-300 border border-red-700"}`}>
            {message}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {["all", "open", "closed", "awarded", "cancelled"].map((f) => (
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Opportunities List */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">
              Opportunities <span className="text-gray-500 text-sm font-normal">({opportunities.length})</span>
            </h2>

            {loading && (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}

            <div className="space-y-3">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => fetchBids(opp)}
                  className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition-all ${
                    selectedOpp?.id === opp.id ? "border-red-600" : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono text-gray-500">{opp.opportunityReference}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-bold">{opp.sippCode.code}</span>
                        <span className="text-gray-400 text-sm">{opp.market.marketName}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded border font-bold capitalize ${STATUS_COLORS[opp.status] || "bg-gray-800 text-gray-400"}`}>
                      {opp.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Dates</p>
                      <p className="text-white text-xs">{formatDate(opp.pickupDate)} – {formatDate(opp.dropoffDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Retail</p>
                      <p className="text-white font-bold">{formatCurrency(opp.retailPriceTotal)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Bids</p>
                      <p className={`font-bold ${opp._count.bids > 0 ? "text-green-400" : "text-gray-400"}`}>
                        {opp._count.bids}
                      </p>
                    </div>
                  </div>
                  {opp.status === "open" && (
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAutoAccept(opp.id); }}
                        className="text-xs bg-blue-900/50 hover:bg-blue-800 text-blue-300 border border-blue-700 px-2 py-1 rounded transition-colors"
                      >
                        Auto-Accept Lowest
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bids Panel */}
          <div>
            {selectedOpp ? (
              <>
                <h2 className="text-lg font-bold text-white mb-4">
                  Bids for {selectedOpp.opportunityReference}
                  <span className="text-gray-500 text-sm font-normal ml-2">({bids.length} bids)</span>
                </h2>

                {bidsLoading && (
                  <div className="text-center py-8">
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                )}

                {!bidsLoading && bids.length === 0 && (
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                    <p className="text-gray-400">No bids placed yet.</p>
                  </div>
                )}

                {!bidsLoading && bids.length > 0 && (
                  <div className="space-y-3">
                    {bids.map((bid, index) => (
                      <div
                        key={bid.id}
                        className={`bg-gray-900 border rounded-xl p-4 ${
                          bid.status === "won" ? "border-green-700" :
                          bid.status === "lost" ? "border-gray-800 opacity-60" :
                          index === 0 ? "border-yellow-700" : "border-gray-700"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-white font-bold">{bid.operator.businessName}</p>
                            <p className="text-gray-400 text-xs">{bid.operator.email}</p>
                          </div>
                          <div className="text-right">
                            {index === 0 && bid.status === "pending" && (
                              <span className="text-xs bg-yellow-900/50 text-yellow-300 border border-yellow-700 px-2 py-0.5 rounded font-bold mr-2">
                                LOWEST
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded border font-bold capitalize ${
                              bid.status === "won" ? "bg-green-900/50 text-green-300 border-green-700" :
                              bid.status === "lost" ? "bg-gray-800 text-gray-400 border-gray-700" :
                              "bg-yellow-900/50 text-yellow-300 border-yellow-700"
                            }`}>
                              {bid.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div>
                            <p className="text-gray-500 text-xs">Bid/day</p>
                            <p className="text-red-400 font-bold">{formatCurrency(bid.bidPerDay)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Bid total</p>
                            <p className="text-red-400 font-bold">{formatCurrency(bid.bidTotal)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Operator margin</p>
                            <p className="text-green-400 font-bold">{formatCurrency(bid.estimatedMarginTotal)}</p>
                          </div>
                        </div>

                        {bid.status === "pending" && selectedOpp.status === "open" && (
                          <button
                            onClick={() => handleAccept(selectedOpp.id, bid.id)}
                            disabled={accepting === bid.id}
                            className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-700 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                          >
                            {accepting === bid.id ? "Accepting..." : "Accept This Bid"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400">Select an opportunity to view bids.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Opportunity Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">Create Booking Opportunity</h3>
            <form onSubmit={handleCreateOpportunity} className="space-y-3">
              {[
                { key: "sippCode", label: "SIPP Code", type: "text", placeholder: "ECAR" },
                { key: "marketCode", label: "Market Code", type: "text", placeholder: "MIA" },
                { key: "pickupDate", label: "Pickup Date", type: "date" },
                { key: "dropoffDate", label: "Return Date", type: "date" },
                { key: "pickupLocation", label: "Pickup Location", type: "text", placeholder: "Miami International Airport (MIA)" },
                { key: "dropoffLocation", label: "Dropoff Location", type: "text", placeholder: "Same as pickup" },
                { key: "renterName", label: "Renter Name", type: "text", placeholder: "Optional" },
                { key: "renterEmail", label: "Renter Email", type: "email", placeholder: "Optional" },
                { key: "biddingWindowHours", label: "Bidding Window (hours)", type: "number" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-gray-400 text-xs mb-1">{label}</label>
                  <input
                    type={type}
                    value={String(createForm[key as keyof typeof createForm])}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, [key]: type === "number" ? parseInt(e.target.value) : e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-red-600"
                    required={["sippCode", "marketCode", "pickupDate", "dropoffDate", "pickupLocation"].includes(key)}
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-400 text-xs mb-1">Demand Level</label>
                <select
                  value={createForm.demandLevel}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, demandLevel: e.target.value }))}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="low">Low (-10%)</option>
                  <option value="normal">Normal</option>
                  <option value="high">High (+15%)</option>
                  <option value="very_high">Very High (+25%)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={creating} className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-2 rounded-lg transition-colors">
                  {creating ? "Creating..." : "Create Opportunity"}
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold py-2 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
