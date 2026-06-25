"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Signal {
  id: number;
  signalType: string;
  severity: string;
  autoActionTaken: string;
  details: Record<string, unknown> | null;
  reviewedAt: string | null;
  createdAt: string;
  renter: { id: number; firstName: string; lastName: string; email: string; trustedStatus: string };
}

const SEVERITY_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#DC2626",
};

const ACTION_COLORS: Record<string, string> = {
  none: "#555",
  flagged: "#f59e0b",
  blocked: "#f97316",
  suspended: "#DC2626",
};

function AdminFraudSignalsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState(searchParams.get("severity") || "");
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "");
  const [unreviewedOnly, setUnreviewedOnly] = useState(searchParams.get("unreviewed") === "true");
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (severityFilter) params.set("severity", severityFilter);
      if (typeFilter) params.set("type", typeFilter);
      if (unreviewedOnly) params.set("unreviewed", "true");
      const res = await fetch(`/api/admin/fraud/signals?${params}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.success) {
        setSignals(data.signals || []);
        setTotal(data.pagination?.total || 0);
        setStats(data.stats || {});
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [router, page, severityFilter, typeFilter, unreviewedOnly]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleReview(signalId: number) {
    setReviewingId(signalId);
    try {
      const res = await fetch(`/api/admin/fraud/signals/${signalId}/review`, { method: "POST" });
      if (res.ok) { await fetchData(); }
    } catch { /* ignore */ }
    finally { setReviewingId(null); }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Nav */}
      <div style={{ backgroundColor: "#000", borderBottom: "1px solid #111", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", height: "56px" }}>
          <Link href="/admin/fraud" style={{ color: "#888", fontSize: "13px", textDecoration: "none", marginRight: "24px" }}>
            ← Fraud Dashboard
          </Link>
          <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700 }}>All Fraud Signals</span>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
            Fraud Signals
          </h1>
          <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
            {total} total signals
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["critical", "high", "medium", "low"].map(sev => (
            <div key={sev} style={{
              backgroundColor: "#0a0a0a", border: `1px solid ${SEVERITY_COLORS[sev]}33`,
              borderRadius: "8px", padding: "12px 18px", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: SEVERITY_COLORS[sev] }} />
              <span style={{ color: "#888", fontSize: "12px", textTransform: "capitalize" }}>{sev}</span>
              <span style={{ color: SEVERITY_COLORS[sev], fontSize: "16px", fontWeight: 700 }}>
                {stats[sev] || 0}
              </span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <select
            value={severityFilter}
            onChange={e => { setSeverityFilter(e.target.value); setPage(1); }}
            style={{
              backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px",
              padding: "8px 12px", color: "#fff", fontSize: "13px",
            }}
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            style={{
              backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "6px",
              padding: "8px 12px", color: "#fff", fontSize: "13px",
            }}
          >
            <option value="">All Types</option>
            <option value="multiple_failed_payments">Multiple Failed Payments</option>
            <option value="rapid_bookings">Rapid Bookings</option>
            <option value="blacklist_match">Blacklist Match</option>
            <option value="ip_anomaly">IP Anomaly</option>
            <option value="identity_mismatch">Identity Mismatch</option>
            <option value="suspicious_pattern">Suspicious Pattern</option>
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={unreviewedOnly}
              onChange={e => { setUnreviewedOnly(e.target.checked); setPage(1); }}
            />
            <span style={{ color: "#888", fontSize: "13px" }}>Unreviewed only</span>
          </label>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                {["Renter", "Signal Type", "Severity", "Action Taken", "Date", "Status", "Actions"].map(h => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    color: "#555", fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#444", fontSize: "13px" }}>Loading...</td></tr>
              ) : signals.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "#444", fontSize: "13px" }}>No signals found</td></tr>
              ) : signals.map(signal => (
                <tr key={signal.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div>
                      <div style={{ color: "#ccc", fontSize: "13px" }}>
                        {signal.renter.firstName} {signal.renter.lastName}
                      </div>
                      <div style={{ color: "#555", fontSize: "11px" }}>{signal.renter.email}</div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888", fontSize: "12px", textTransform: "capitalize" }}>
                    {signal.signalType.replace(/_/g, " ")}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      color: SEVERITY_COLORS[signal.severity],
                      fontSize: "11px", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      {signal.severity}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      color: ACTION_COLORS[signal.autoActionTaken] || "#555",
                      fontSize: "11px", textTransform: "capitalize",
                    }}>
                      {signal.autoActionTaken}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#555", fontSize: "12px" }}>
                    {new Date(signal.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {signal.reviewedAt ? (
                      <span style={{ color: "#10b981", fontSize: "11px" }}>Reviewed</span>
                    ) : (
                      <span style={{ color: "#f59e0b", fontSize: "11px" }}>Pending</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Link
                        href={`/admin/renters/${signal.renter.id}/fraud`}
                        style={{
                          color: "#888", fontSize: "11px", textDecoration: "none",
                          padding: "4px 8px", border: "1px solid #222", borderRadius: "4px",
                        }}
                      >
                        Profile
                      </Link>
                      {!signal.reviewedAt && (
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
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a",
                color: page === 1 ? "#333" : "#888", padding: "8px 16px",
                borderRadius: "6px", fontSize: "13px", cursor: page === 1 ? "default" : "pointer",
              }}
            >
              Previous
            </button>
            <span style={{ color: "#555", fontSize: "13px", padding: "8px 12px" }}>
              Page {page} of {Math.ceil(total / 20)}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= Math.ceil(total / 20)}
              style={{
                backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a",
                color: page >= Math.ceil(total / 20) ? "#333" : "#888", padding: "8px 16px",
                borderRadius: "6px", fontSize: "13px", cursor: page >= Math.ceil(total / 20) ? "default" : "pointer",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminFraudSignalsPage() {
  return (
    <Suspense fallback={<div style={{color:"#888",padding:"40px",textAlign:"center"}}>Loading...</div>}>
      <AdminFraudSignalsPageInner />
    </Suspense>
  );
}
