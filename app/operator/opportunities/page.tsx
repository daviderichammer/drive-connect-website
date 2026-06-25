"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SippCode { code: string; name: string; category: string }
interface Market { marketName: string; marketCode: string }
interface MyBid {
  id: number;
  bidPerDay: number;
  bidTotal: number;
  estimatedMarginPerDay: number;
  estimatedMarginTotal: number;
  status: string;
  submittedAt: string;
}
interface Opportunity {
  id: number;
  opportunityReference: string;
  sippCode: SippCode;
  market: Market;
  pickupLocation: string;
  dropoffLocation: string | null;
  pickupDate: string;
  dropoffDate: string;
  rentalDays: number;
  retailPricePerDay: number;
  retailPriceTotal: number;
  minimumBidPerDay: number;
  minimumBidTotal: number;
  biddingClosesAt: string;
  status: string;
  myBid: MyBid | null;
}

function TimeRemaining({ closesAt }: { closesAt: string }) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(closesAt).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Closed"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [closesAt]);
  const isUrgent = new Date(closesAt).getTime() - Date.now() < 3600000;
  return (
    <span className={`font-mono text-sm font-bold ${isUrgent ? "text-red-500" : "text-green-400"}`}>
      {remaining}
    </span>
  );
}

export default function OperatorOpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOpportunities = useCallback(async () => {
    try {
      const res = await fetch("/api/operator/opportunities");
      if (res.status === 401) { router.push("/host/login"); return; }
      const data = await res.json();
      if (data.success) setOpportunities(data.opportunities);
      else setError(data.error || "Failed to load opportunities.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOpportunities();
    const interval = setInterval(fetchOpportunities, 30000);
    return () => clearInterval(interval);
  }, [fetchOpportunities]);

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/host/dashboard" className="text-gray-400 hover:text-white text-sm">← Dashboard</Link>
            <h1 className="text-xl font-bold text-white">Booking Opportunities</h1>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
              {opportunities.filter(o => !o.myBid).length} Available
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/operator/bids" className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">
              My Bids
            </Link>
            <button onClick={fetchOpportunities} className="text-gray-400 hover:text-white text-sm border border-gray-700 px-3 py-1.5 rounded">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
          <p className="text-gray-300 text-sm">
            <span className="text-red-500 font-bold">How bidding works:</span> Bids are sealed — you cannot see other operators&apos; bids.
            The lowest bid wins after the window closes. You keep the difference between the retail price and your bid as gross margin.
          </p>
        </div>

        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400">Loading opportunities...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 text-center">{error}</div>
        )}

        {!loading && !error && opportunities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-bold text-white mb-2">No Open Opportunities</h3>
            <p className="text-gray-400">Check back soon — new booking opportunities are posted regularly.</p>
          </div>
        )}

        {!loading && opportunities.length > 0 && (
          <div className="grid gap-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className={`bg-gray-900 border rounded-xl p-6 transition-all ${
                  opp.myBid ? "border-green-700 opacity-75" : "border-gray-700 hover:border-red-600"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left: Opportunity Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono text-gray-500">{opp.opportunityReference}</span>
                      <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-bold">
                        {opp.sippCode.code}
                      </span>
                      <span className="text-gray-500 text-xs">{opp.sippCode.name}</span>
                      {opp.myBid && (
                        <span className="bg-green-900 text-green-300 text-xs px-2 py-0.5 rounded font-bold">
                          BID PLACED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Market</p>
                        <p className="text-white font-semibold">{opp.market.marketName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Pickup</p>
                        <p className="text-white font-semibold">{formatDate(opp.pickupDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Return</p>
                        <p className="text-white font-semibold">{formatDate(opp.dropoffDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Duration</p>
                        <p className="text-white font-semibold">{opp.rentalDays} days</p>
                      </div>
                    </div>

                    <div className="text-gray-400 text-sm">
                      <span className="font-medium text-gray-300">📍</span> {opp.pickupLocation}
                    </div>
                  </div>

                  {/* Center: Pricing */}
                  <div className="lg:w-64 bg-black rounded-lg p-4 border border-gray-800">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Retail/day</p>
                        <p className="text-white font-bold text-lg">{formatCurrency(opp.retailPricePerDay)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Retail total</p>
                        <p className="text-white font-bold text-lg">{formatCurrency(opp.retailPriceTotal)}</p>
                      </div>
                      <div>
                        <p className="text-red-400 text-xs mb-1 font-bold">Min bid/day</p>
                        <p className="text-red-400 font-bold text-lg">{formatCurrency(opp.minimumBidPerDay)}</p>
                      </div>
                      <div>
                        <p className="text-red-400 text-xs mb-1 font-bold">Min bid total</p>
                        <p className="text-red-400 font-bold text-lg">{formatCurrency(opp.minimumBidTotal)}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-800 pt-3">
                      <p className="text-gray-500 text-xs mb-1">Max margin potential</p>
                      <p className="text-green-400 font-bold">
                        {formatCurrency(opp.retailPriceTotal - opp.minimumBidTotal)} total
                      </p>
                    </div>
                  </div>

                  {/* Right: Action */}
                  <div className="lg:w-48 flex flex-col gap-3">
                    <div className="text-center">
                      <p className="text-gray-500 text-xs mb-1">Closes in</p>
                      <TimeRemaining closesAt={opp.biddingClosesAt} />
                    </div>

                    {opp.myBid ? (
                      <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-center">
                        <p className="text-green-300 text-xs font-bold mb-1">YOUR BID</p>
                        <p className="text-green-400 font-bold text-lg">{formatCurrency(opp.myBid.bidPerDay)}/day</p>
                        <p className="text-green-300 text-sm">{formatCurrency(opp.myBid.bidTotal)} total</p>
                        <p className="text-gray-400 text-xs mt-1">
                          Est. margin: {formatCurrency(opp.myBid.estimatedMarginTotal)}
                        </p>
                      </div>
                    ) : (
                      <Link
                        href={`/operator/bid/${opp.id}`}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                      >
                        Place Bid
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
