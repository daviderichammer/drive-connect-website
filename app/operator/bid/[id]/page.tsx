"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface SippCode { code: string; name: string; category: string }
interface Market { marketName: string; marketCode: string }
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
  priceBreakdown: string | null;
  myBid: {
    id: number;
    bidPerDay: number;
    bidTotal: number;
    estimatedMarginPerDay: number;
    estimatedMarginTotal: number;
    status: string;
  } | null;
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
    <span className={`font-mono font-bold text-2xl ${isUrgent ? "text-red-500" : "text-green-400"}`}>
      {remaining}
    </span>
  );
}

export default function PlaceBidPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params?.id as string;

  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidPerDay, setBidPerDay] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchOpportunity = useCallback(async () => {
    try {
      const res = await fetch("/api/operator/opportunities");
      if (res.status === 401) { router.push("/host/login"); return; }
      const data = await res.json();
      if (data.success) {
        const opp = data.opportunities.find((o: Opportunity) => o.id === parseInt(opportunityId));
        if (opp) setOpportunity(opp);
        else setError("Opportunity not found or no longer available.");
      } else {
        setError(data.error || "Failed to load opportunity.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [opportunityId, router]);

  useEffect(() => { fetchOpportunity(); }, [fetchOpportunity]);

  const bidAmount = parseFloat(bidPerDay) || 0;
  const bidTotal = opportunity ? bidAmount * opportunity.rentalDays : 0;
  const estimatedMarginPerDay = opportunity ? opportunity.retailPricePerDay - bidAmount : 0;
  const estimatedMarginTotal = opportunity ? estimatedMarginPerDay * opportunity.rentalDays : 0;
  const isValidBid = opportunity && bidAmount >= opportunity.minimumBidPerDay;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunity || !isValidBid) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/operator/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          bidPerDay: bidAmount,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push("/operator/bids"), 3000);
      } else {
        setSubmitError(data.error || "Failed to submit bid.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (n: number) => `$${n.toFixed(2)}`;
  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Opportunity not found."}</p>
          <Link href="/operator/opportunities" className="text-red-500 hover:text-red-400">← Back to Opportunities</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Bid Submitted!</h2>
          <p className="text-gray-400 mb-2">Your bid of {formatCurrency(bidAmount)}/day has been placed.</p>
          <p className="text-gray-500 text-sm">Redirecting to your bids...</p>
        </div>
      </div>
    );
  }

  if (opportunity.myBid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center bg-gray-900 border border-green-700 rounded-xl p-8 max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-white mb-2">Bid Already Placed</h2>
          <p className="text-gray-400 mb-4">You have already bid {formatCurrency(opportunity.myBid.bidPerDay)}/day on this opportunity.</p>
          <Link href="/operator/bids" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-block">
            View My Bids
          </Link>
        </div>
      </div>
    );
  }

  const breakdown = opportunity.priceBreakdown ? JSON.parse(opportunity.priceBreakdown) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/operator/opportunities" className="text-gray-400 hover:text-white text-sm">← Opportunities</Link>
          <h1 className="text-xl font-bold text-white">Place Bid</h1>
          <span className="text-xs font-mono text-gray-500">{opportunity.opportunityReference}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Opportunity Details */}
          <div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicle Class</span>
                  <span className="text-white font-semibold">{opportunity.sippCode.code} — {opportunity.sippCode.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market</span>
                  <span className="text-white font-semibold">{opportunity.market.marketName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pickup Date</span>
                  <span className="text-white font-semibold">{formatDate(opportunity.pickupDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Return Date</span>
                  <span className="text-white font-semibold">{formatDate(opportunity.dropoffDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rental Duration</span>
                  <span className="text-white font-semibold">{opportunity.rentalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pickup Location</span>
                  <span className="text-white font-semibold text-right max-w-48">{opportunity.pickupLocation}</span>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4">Retail Pricing</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base rate/day</span>
                  <span className="text-white">{breakdown ? formatCurrency(breakdown.baseRatePerDay) : "—"}</span>
                </div>
                {breakdown?.appliedRules?.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Adjustments</span>
                    <span className="text-yellow-400 text-sm text-right max-w-48">{breakdown.appliedRules.join(", ")}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                  <span className="text-gray-300 font-semibold">Retail rate/day</span>
                  <span className="text-white font-bold">{formatCurrency(opportunity.retailPricePerDay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 font-semibold">Retail total ({opportunity.rentalDays} days)</span>
                  <span className="text-white font-bold text-lg">{formatCurrency(opportunity.retailPriceTotal)}</span>
                </div>
              </div>
            </div>

            {/* Bidding Window */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-3">Bidding Window</h2>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Time Remaining</p>
                <TimeRemaining closesAt={opportunity.biddingClosesAt} />
              </div>
            </div>
          </div>

          {/* Right: Bid Form */}
          <div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-2">Minimum Bid</h2>
              <div className="bg-black rounded-lg p-4 border border-red-900 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Minimum bid/day</span>
                  <span className="text-red-400 font-bold text-xl">{formatCurrency(opportunity.minimumBidPerDay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum bid total</span>
                  <span className="text-red-400 font-bold">{formatCurrency(opportunity.minimumBidTotal)}</span>
                </div>
              </div>
              <p className="text-gray-500 text-xs">
                The minimum bid covers: customer acquisition cost, payment processing (2.9% + $0.30), platform servicing (5%), and platform profit margin (8%).
              </p>
            </div>

            {/* Live Margin Calculator */}
            {bidAmount > 0 && (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-bold text-white mb-4">Estimated Margin</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Retail total (renter pays)</span>
                    <span className="text-white">{formatCurrency(opportunity.retailPriceTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Your bid total (you pay DC)</span>
                    <span className="text-red-400">− {formatCurrency(bidTotal)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                    <span className="text-white font-bold">Your gross margin</span>
                    <span className={`font-bold text-lg ${estimatedMarginTotal >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatCurrency(estimatedMarginTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Margin per day</span>
                    <span className={`font-semibold ${estimatedMarginPerDay >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {formatCurrency(estimatedMarginPerDay)}/day
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bid Form */}
            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Your Bid</h2>

              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Bid per day (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    value={bidPerDay}
                    onChange={(e) => setBidPerDay(e.target.value)}
                    min={opportunity.minimumBidPerDay}
                    step="0.01"
                    placeholder={opportunity.minimumBidPerDay.toFixed(2)}
                    className="w-full bg-black border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-red-600 transition-colors"
                    required
                  />
                </div>
                {bidAmount > 0 && !isValidBid && (
                  <p className="text-red-400 text-sm mt-1">
                    Bid must be at least {formatCurrency(opportunity.minimumBidPerDay)}/day
                  </p>
                )}
                {isValidBid && (
                  <p className="text-green-400 text-sm mt-1">
                    ✓ Valid bid — total: {formatCurrency(bidTotal)}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes for this bid..."
                  rows={3}
                  className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors resize-none text-sm"
                />
              </div>

              {submitError && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-red-300 text-sm mb-4">
                  {submitError}
                </div>
              )}

              <div className="bg-gray-800 rounded-lg p-3 mb-4 text-xs text-gray-400">
                <strong className="text-gray-300">Sealed Bid Notice:</strong> Your bid is private. Other operators cannot see your bid amount.
                The lowest bid wins after the window closes. You cannot re-bid after submitting.
              </div>

              <button
                type="submit"
                disabled={submitting || !isValidBid}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg text-lg transition-colors"
              >
                {submitting ? "Submitting Bid..." : `Submit Bid — ${formatCurrency(bidTotal)} total`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
