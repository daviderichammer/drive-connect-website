"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FraudOverview {
  totalSignals: number;
  unreviewedSignals: number;
  criticalSignals: number;
  last7DaysSignals: number;
  last24hSignals: number;
  blacklistedCount: number;
  suspendedRenters: number;
  bannedRenters: number;
  trustedRenters: number;
}

interface Signal {
  id: number;
  signalType: string;
  severity: string;
  autoActionTaken: string;
  createdAt: string;
  renter: { id: number; firstName: string; lastName: string; email: string };
}

interface SignalByType { type: string; count: number }
interface SignalBySeverity { severity: string; count: number }
interface FlaggedIP { ipAddress: string; flagReason: string | null; timestamp: string }

const SEVERITY_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#DC2626",
};

function StatCard({ label, value, sub, color, href }: {
  label: string; value: number; sub?: string; color?: string; href?: string;
}) {
  const inner = (
    <div style={{
      backgroundColor: "#0a0a0a",
      border: `1px solid ${color ? color + "33" : "#1a1a1a"}`,
      borderRadius: "8px",
      padding: "20px 24px",
      cursor: href ? "pointer" : "default",
    }}>
      <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
        {label}
      </p>
      <p style={{ color: color || "#ffffff", fontSize: "26px", fontWeight: 700, margin: "0 0 4px" }}>
        {value}
      </p>
      {sub && <p style={{ color: "#444", fontSize: "11px", margin: 0 }}>{sub}</p>}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>;
  return inner;
}

export default function AdminFraudDashboard() {
  const router = useRouter();
  const [overview, setOverview] = useState<FraudOverview | null>(null);
  const [recentSignals, setRecentSignals] = useState<Signal[]>([]);
  const [signalsByType, setSignalsByType] = useState<SignalByType[]>([]);
  const [signalsBySeverity, setSignalsBySeverity] = useState<SignalBySeverity[]>([]);
  const [flaggedIPs, setFlaggedIPs] = useState<FlaggedIP[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/fraud");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.success) {
        setOverview(data.overview);
        setRecentSignals(data.recentSignals || []);
        setSignalsByType(data.signalsByType || []);
        setSignalsBySeverity(data.signalsBySeverity || []);
        setFlaggedIPs(data.flaggedIPs || []);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleReview(signalId: number) {
    setReviewingId(signalId);
    try {
      const res = await fetch(`/api/admin/fraud/signals/${signalId}/review`, { method: "POST" });
      if (res.ok) { await fetchData(); }
    } catch { /* ignore */ }
    finally { setReviewingId(null); }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#555", fontSize: "14px" }}>Loading fraud data...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Admin Nav */}
      <div style={{ backgroundColor: "#000", borderBottom: "1px solid #111", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0", height: "56px" }}>
          <Link href="/admin/dashboard" style={{ color: "#888", fontSize: "13px", textDecoration: "none", marginRight: "24px" }}>
            ← Dashboard
          </Link>
          <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700 }}>Fraud Prevention</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "16px" }}>
            {[
              { label: "Signals", href: "/admin/fraud/signals" },
              { label: "Blacklist", href: "/admin/fraud/blacklist" },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ color: "#888", fontSize: "12px", textDecoration: "none" }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Fraud Prevention Dashboard
          </h1>
          <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
            Monitor fraud signals, blacklisted renters, and suspicious activity
          </p>
        </div>

        {/* Overview Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          <StatCard label="Unreviewed Signals" value={overview?.unreviewedSignals || 0} color="#f59e0b" href="/admin/fraud/signals?unreviewed=true" />
          <StatCard label="Critical Signals" value={overview?.criticalSignals || 0} color="#DC2626" href="/admin/fraud/signals?severity=critical" />
          <StatCard label="Last 24 Hours" value={overview?.last24hSignals || 0} sub="new signals" />
          <StatCard label="Last 7 Days" value={overview?.last7DaysSignals || 0} sub="new signals" />
          <StatCard label="Blacklisted" value={overview?.blacklistedCount || 0} color="#DC2626" href="/admin/fraud/blacklist" />
          <StatCard label="Suspended" value={overview?.suspendedRenters || 0} color="#f97316" />
          <StatCard label="Banned" value={overview?.bannedRenters || 0} color="#DC2626" />
          <StatCard label="Trusted Renters" value={overview?.trustedRenters || 0} color="#10b981" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {/* Signals by Type */}
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px 24px" }}>
            <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Signals by Type (30 days)
            </h3>
            {signalsByType.length === 0 ? (
              <p style={{ color: "#444", fontSize: "13px", margin: 0 }}>No signals in last 30 days</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {signalsByType.map(s => (
                  <div key={s.type} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#888", fontSize: "12px", flex: 1, textTransform: "capitalize" }}>
                      {s.type.replace(/_/g, " ")}
                    </span>
                    <div style={{ width: "120px", height: "6px", backgroundColor: "#111", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{
                        width: `${Math.min(100, (s.count / (signalsByType[0]?.count || 1)) * 100)}%`,
                        height: "100%", backgroundColor: "#DC2626", borderRadius: "3px",
                      }} />
                    </div>
                    <span style={{ color: "#DC2626", fontSize: "12px", fontWeight: 700, minWidth: "24px", textAlign: "right" }}>
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signals by Severity */}
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px 24px" }}>
            <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Severity Breakdown (7 days)
            </h3>
            {signalsBySeverity.length === 0 ? (
              <p style={{ color: "#444", fontSize: "13px", margin: 0 }}>No signals in last 7 days</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {["critical", "high", "medium", "low"].map(sev => {
                  const entry = signalsBySeverity.find(s => s.severity === sev);
                  const count = entry?.count || 0;
                  return (
                    <div key={sev} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        backgroundColor: SEVERITY_COLORS[sev], flexShrink: 0,
                      }} />
                      <span style={{ color: "#888", fontSize: "12px", flex: 1, textTransform: "capitalize" }}>{sev}</span>
                      <span style={{ color: SEVERITY_COLORS[sev], fontSize: "14px", fontWeight: 700 }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Unreviewed Signals */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px 24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Unreviewed Signals
            </h3>
            <Link href="/admin/fraud/signals" style={{ color: "#DC2626", fontSize: "12px", textDecoration: "none" }}>
              View All →
            </Link>
          </div>
          {recentSignals.length === 0 ? (
            <p style={{ color: "#444", fontSize: "13px", margin: 0 }}>No unreviewed signals</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentSignals.map(signal => (
                <div key={signal.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px",
                  backgroundColor: "#111",
                  borderRadius: "6px",
                  border: `1px solid ${SEVERITY_COLORS[signal.severity]}22`,
                }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    backgroundColor: SEVERITY_COLORS[signal.severity], flexShrink: 0,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "#ccc", fontSize: "13px", textTransform: "capitalize" }}>
                        {signal.signalType.replace(/_/g, " ")}
                      </span>
                      <span style={{
                        color: SEVERITY_COLORS[signal.severity], fontSize: "10px",
                        fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>
                        {signal.severity}
                      </span>
                    </div>
                    <div style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>
                      {signal.renter.firstName} {signal.renter.lastName} · {signal.renter.email}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ color: "#444", fontSize: "11px" }}>
                      {new Date(signal.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/admin/renters/${signal.renter.id}/fraud`}
                      style={{
                        color: "#888", fontSize: "11px", textDecoration: "none",
                        padding: "4px 8px", border: "1px solid #222", borderRadius: "4px",
                      }}
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleReview(signal.id)}
                      disabled={reviewingId === signal.id}
                      style={{
                        backgroundColor: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        color: "#10b981", fontSize: "11px", padding: "4px 8px",
                        borderRadius: "4px", cursor: "pointer",
                      }}
                    >
                      {reviewingId === signal.id ? "..." : "Review"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flagged IPs */}
        {flaggedIPs.length > 0 && (
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px 24px" }}>
            <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Recent Flagged IPs
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {flaggedIPs.map((ip, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "8px 12px", backgroundColor: "#111", borderRadius: "6px",
                }}>
                  <span style={{ color: "#DC2626", fontSize: "12px", fontFamily: "monospace", minWidth: "120px" }}>
                    {ip.ipAddress}
                  </span>
                  <span style={{ color: "#888", fontSize: "12px", flex: 1 }}>
                    {ip.flagReason || "Flagged activity"}
                  </span>
                  <span style={{ color: "#444", fontSize: "11px" }}>
                    {new Date(ip.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
