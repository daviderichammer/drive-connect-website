"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
}

interface ChartPoint { date: string; revenue: number; }
interface VehicleBreakdown { vehicleId: number; vehicle: string; revenue: number; bookings: number; }
interface Transaction {
  id: number;
  bookingReference: string;
  vehicle: string;
  renterName: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  platformFee: number;
  operatorNet: number;
  status: string;
  paymentStatus: string;
  payoutStatus: string;
  createdAt: string;
}
interface Summary {
  totalRevenue: number;
  totalPlatformFees: number;
  totalOperatorNet: number;
  pendingPayout: number;
  totalBookings: number;
}

interface EarningsData {
  chartData: ChartPoint[];
  vehicleBreakdown: VehicleBreakdown[];
  transactions: Transaction[];
  summary: Summary;
}

const PERIODS = [
  { key: "daily", label: "Daily (30 days)" },
  { key: "weekly", label: "Weekly (12 weeks)" },
  { key: "monthly", label: "Monthly (12 months)" },
];

function MiniBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span style={{ color: "#888", fontSize: "11px" }}>{label}</span>
        <span style={{ color: "#fff", fontSize: "11px", fontWeight: 600 }}>${value.toFixed(0)}</span>
      </div>
      <div style={{ backgroundColor: "#1a1a1a", borderRadius: "2px", height: "4px" }}>
        <div style={{ backgroundColor: "#C1121F", borderRadius: "2px", height: "4px", width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
    active: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
    completed: { bg: "rgba(100,100,100,0.1)", text: "#888888" },
    cancelled: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
    pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
    paid: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
  };
  const c = colors[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

export default function EarningsPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const [exporting, setExporting] = useState(false);

  const fetchEarnings = useCallback(async (p: string) => {
    const res = await fetch(`/api/host/dashboard/earnings?period=${p}`);
    if (res.ok) {
      const d = await res.json();
      setData(d);
    }
  }, []);

  useEffect(() => {
    fetch("/api/host/me").then(async (res) => {
      if (res.status === 401) { router.push("/host/login"); return; }
      const d = await res.json();
      if (!d.authenticated || !d.host.onboardingCompleted) { router.push("/host/login"); return; }
      setHost(d.host);
      await fetchEarnings(period);
      setLoading(false);
    }).catch(() => router.push("/host/login"));
  }, [router, period, fetchEarnings]);

  const handleExport = async () => {
    setExporting(true);
    const res = await fetch("/api/host/dashboard/earnings/export");
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `earnings-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setExporting(false);
  };

  const formatDate = (d: string) => {
    if (d.length === 7) {
      const [y, m] = d.split("-");
      return new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>
        Loading earnings...
      </div>
    );
  }

  if (!host) return null;

  const maxRevenue = data ? Math.max(...data.chartData.map((c) => c.revenue), 1) : 1;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Earnings & Payouts</h2>
          <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>Revenue tracking and payout history</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          style={{ backgroundColor: "transparent", border: "1px solid #333", color: "#888", padding: "9px 18px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Total Revenue", value: `$${(data?.summary.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: "All time" },
          { label: "Platform Fees", value: `$${(data?.summary.totalPlatformFees || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: "15% of revenue" },
          { label: "Your Net Earnings", value: `$${(data?.summary.totalOperatorNet || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: "After platform fee", highlight: true },
          { label: "Pending Payout", value: `$${(data?.summary.pendingPayout || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: "Awaiting release" },
        ].map(({ label, value, sub, highlight }) => (
          <div key={label} style={{ backgroundColor: "#111111", border: `1px solid ${highlight ? "rgba(193,18,31,0.3)" : "#1a1a1a"}`, borderRadius: "8px", padding: "20px 24px" }}>
            <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>{label}</p>
            <p style={{ color: highlight ? "#C1121F" : "#fff", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>{value}</p>
            <p style={{ color: "#444", fontSize: "11px", margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>Revenue Over Time</h3>
          <div style={{ display: "flex", gap: "8px" }}>
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{ backgroundColor: period === p.key ? "#C1121F" : "transparent", color: period === p.key ? "#fff" : "#555", border: `1px solid ${period === p.key ? "#C1121F" : "#222"}`, padding: "5px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {!data?.chartData.length ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#555", fontSize: "13px" }}>
            No revenue data for this period.
          </div>
        ) : (
          <div>
            {/* Simple bar chart */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "160px", padding: "0 0 8px" }}>
              {data.chartData.map((point) => {
                const pct = maxRevenue > 0 ? (point.revenue / maxRevenue) * 100 : 0;
                return (
                  <div
                    key={point.date}
                    title={`${formatDate(point.date)}: $${point.revenue.toFixed(2)}`}
                    style={{
                      flex: 1,
                      backgroundColor: "#C1121F",
                      height: `${Math.max(pct, 2)}%`,
                      borderRadius: "2px 2px 0 0",
                      opacity: 0.8,
                      cursor: "default",
                      minWidth: "4px",
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ color: "#444", fontSize: "10px" }}>{formatDate(data.chartData[0]?.date || "")}</span>
              <span style={{ color: "#444", fontSize: "10px" }}>{formatDate(data.chartData[data.chartData.length - 1]?.date || "")}</span>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Breakdown */}
      {data?.vehicleBreakdown && data.vehicleBreakdown.length > 0 && (
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 20px" }}>Revenue by Vehicle</h3>
          {data.vehicleBreakdown.map((v) => (
            <MiniBar key={v.vehicleId} label={`${v.vehicle} (${v.bookings} bookings)`} value={v.revenue} max={data.vehicleBreakdown[0]?.revenue || 1} />
          ))}
        </div>
      )}

      {/* Transaction History */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>Transaction History</h3>
        </div>

        {!data?.transactions.length ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#555", fontSize: "13px" }}>
            No transactions yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {["Reference", "Vehicle", "Renter", "Dates", "Gross", "Fee", "Net", "Status"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #0d0d0d" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ color: "#C1121F", fontSize: "11px", fontWeight: 700, fontFamily: "monospace" }}>
                        {t.bookingReference}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#888" }}>{t.vehicle}</td>
                    <td style={{ padding: "12px 16px", fontSize: "12px" }}>{t.renterName}</td>
                    <td style={{ padding: "12px 16px", fontSize: "11px", color: "#666" }}>
                      {new Date(t.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" — "}
                      {new Date(t.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "13px" }}>${t.totalRevenue.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", fontSize: "12px", color: "#666" }}>-${t.platformFee.toFixed(2)}</td>
                    <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: "#00C864" }}>
                      ${t.operatorNet.toFixed(2)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
