"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface RenterInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  licenseNumber: string | null;
  trustedStatus: string;
  trustedSince: string | null;
  trustScore: number;
  verificationStatus: string;
  isActive: boolean;
  createdAt: string;
}

interface Signal {
  id: number;
  signalType: string;
  severity: string;
  autoActionTaken: string;
  details: Record<string, unknown> | null;
  reviewedAt: string | null;
  createdAt: string;
}

interface ActivityLog {
  id: number;
  ipAddress: string;
  action: string;
  flagged: boolean;
  flagReason: string | null;
  timestamp: string;
}

interface BlacklistEntry {
  id: number;
  reason: string;
  addedAt: string;
  isActive: boolean;
  notes: string | null;
}

interface Summary {
  totalSignals: number;
  criticalSignals: number;
  highSignals: number;
  unreviewedSignals: number;
  isBlacklisted: boolean;
}

const SEVERITY_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#DC2626",
};

const STATUS_COLORS: Record<string, string> = {
  unverified: "#888",
  pending: "#f59e0b",
  trusted: "#10b981",
  suspended: "#f97316",
  banned: "#DC2626",
};

export default function AdminRenterFraudPage() {
  const router = useRouter();
  const params = useParams();
  const renterId = params?.id as string;

  const [renter, setRenter] = useState<RenterInfo | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [blacklistEntries, setBlacklistEntries] = useState<BlacklistEntry[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trustScore, setTrustScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [showSuspendForm, setShowSuspendForm] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/renters/${renterId}/signals`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.success) {
        setRenter(data.renter);
        setSignals(data.signals || []);
        setActivityLogs(data.activityLogs || []);
        setBlacklistEntries(data.blacklistEntries || []);
        setSummary(data.summary);
        setTrustScore(data.trustScore);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [router, renterId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSuspend(permanent = false) {
    setActionLoading("suspend");
    try {
      const res = await fetch(`/api/admin/renters/${renterId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: suspendReason, permanent }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setShowSuspendForm(false);
        await fetchData();
      } else {
        setMessage(data.error || "Action failed");
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  }

  async function handleReinstate() {
    setActionLoading("reinstate");
    try {
      const res = await fetch(`/api/admin/renters/${renterId}/reinstate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Admin reinstatement" }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        await fetchData();
      } else {
        setMessage(data.error || "Action failed");
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  }

  async function handleReviewSignal(signalId: number) {
    try {
      await fetch(`/api/admin/fraud/signals/${signalId}/review`, { method: "POST" });
      await fetchData();
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#555", fontSize: "14px" }}>Loading renter fraud profile...</div>
      </div>
    );
  }

  if (!renter) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#DC2626", fontSize: "14px" }}>Renter not found</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Nav */}
      <div style={{ backgroundColor: "#000", borderBottom: "1px solid #111", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", height: "56px" }}>
          <Link href="/admin/fraud" style={{ color: "#888", fontSize: "13px", textDecoration: "none", marginRight: "24px" }}>
            ← Fraud Dashboard
          </Link>
          <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700 }}>
            Renter Fraud Profile
          </span>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1100px" }}>
        {message && (
          <div style={{
            backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "6px", padding: "10px 14px", marginBottom: "16px",
            color: "#10b981", fontSize: "13px",
          }}>
            {message}
          </div>
        )}

        {/* Renter Header */}
        <div style={{
          backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a",
          borderRadius: "12px", padding: "24px", marginBottom: "24px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 800, margin: "0 0 4px" }}>
                {renter.firstName} {renter.lastName}
              </h1>
              <p style={{ color: "#555", fontSize: "13px", margin: "0 0 12px" }}>{renter.email}</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <span style={{
                  backgroundColor: STATUS_COLORS[renter.trustedStatus] + "22",
                  color: STATUS_COLORS[renter.trustedStatus],
                  padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>
                  {renter.trustedStatus}
                </span>
                {summary?.isBlacklisted && (
                  <span style={{
                    backgroundColor: "rgba(220,38,38,0.15)", color: "#DC2626",
                    padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    BLACKLISTED
                  </span>
                )}
                <span style={{ color: "#555", fontSize: "12px" }}>
                  Trust Score: <strong style={{ color: trustScore >= 70 ? "#10b981" : trustScore >= 40 ? "#f59e0b" : "#DC2626" }}>{trustScore}/100</strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {(renter.trustedStatus === "suspended" || renter.trustedStatus === "unverified" || renter.trustedStatus === "pending") && (
                <button
                  onClick={handleReinstate}
                  disabled={actionLoading === "reinstate"}
                  style={{
                    backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                    color: "#10b981", padding: "8px 16px", borderRadius: "6px",
                    fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {actionLoading === "reinstate" ? "..." : "Reinstate"}
                </button>
              )}
              {renter.trustedStatus !== "banned" && renter.trustedStatus !== "suspended" && (
                <button
                  onClick={() => setShowSuspendForm(!showSuspendForm)}
                  style={{
                    backgroundColor: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)",
                    color: "#f97316", padding: "8px 16px", borderRadius: "6px",
                    fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Suspend
                </button>
              )}
              {renter.trustedStatus !== "banned" && (
                <button
                  onClick={() => { setSuspendReason("Permanent ban"); handleSuspend(true); }}
                  disabled={actionLoading === "suspend"}
                  style={{
                    backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
                    color: "#DC2626", padding: "8px 16px", borderRadius: "6px",
                    fontSize: "12px", fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {actionLoading === "suspend" ? "..." : "Ban"}
                </button>
              )}
            </div>
          </div>

          {/* Suspend Form */}
          {showSuspendForm && (
            <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #1a1a1a" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "#888", fontSize: "11px", fontWeight: 700, display: "block", marginBottom: "6px" }}>
                    Suspension Reason
                  </label>
                  <input
                    type="text"
                    value={suspendReason}
                    onChange={e => setSuspendReason(e.target.value)}
                    placeholder="Enter reason for suspension..."
                    style={{
                      width: "100%", backgroundColor: "#111", border: "1px solid #222",
                      borderRadius: "6px", padding: "8px 12px", color: "#fff",
                      fontSize: "13px", boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  onClick={() => handleSuspend(false)}
                  disabled={actionLoading === "suspend"}
                  style={{
                    backgroundColor: "#f97316", color: "#fff", border: "none",
                    padding: "8px 16px", borderRadius: "6px", fontSize: "12px",
                    fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  {actionLoading === "suspend" ? "..." : "Confirm Suspend"}
                </button>
              </div>
            </div>
          )}

          {/* Summary Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px", marginTop: "20px" }}>
            {[
              { label: "Total Signals", value: summary?.totalSignals || 0 },
              { label: "Critical", value: summary?.criticalSignals || 0, color: "#DC2626" },
              { label: "High", value: summary?.highSignals || 0, color: "#f97316" },
              { label: "Unreviewed", value: summary?.unreviewedSignals || 0, color: "#f59e0b" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ color: stat.color || "#fff", fontSize: "22px", fontWeight: 700 }}>{stat.value}</div>
                <div style={{ color: "#555", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fraud Signals */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px 24px", marginBottom: "24px" }}>
          <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Fraud Signals ({signals.length})
          </h3>
          {signals.length === 0 ? (
            <p style={{ color: "#444", fontSize: "13px", margin: 0 }}>No fraud signals for this renter</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {signals.map(signal => (
                <div key={signal.id} style={{
                  padding: "12px 14px", backgroundColor: "#111", borderRadius: "6px",
                  border: `1px solid ${SEVERITY_COLORS[signal.severity]}22`,
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    backgroundColor: SEVERITY_COLORS[signal.severity], flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ color: "#ccc", fontSize: "13px", textTransform: "capitalize" }}>
                        {signal.signalType.replace(/_/g, " ")}
                      </span>
                      <span style={{ color: SEVERITY_COLORS[signal.severity], fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
                        {signal.severity}
                      </span>
                      {signal.autoActionTaken !== "none" && (
                        <span style={{ color: "#f59e0b", fontSize: "10px", textTransform: "capitalize" }}>
                          → {signal.autoActionTaken}
                        </span>
                      )}
                    </div>
                    {signal.details && (
                      <div style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>
                        {JSON.stringify(signal.details).substring(0, 100)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ color: "#444", fontSize: "11px" }}>
                      {new Date(signal.createdAt).toLocaleDateString()}
                    </span>
                    {signal.reviewedAt ? (
                      <span style={{ color: "#10b981", fontSize: "11px" }}>✓ Reviewed</span>
                    ) : (
                      <button
                        onClick={() => handleReviewSignal(signal.id)}
                        style={{
                          backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
                          color: "#10b981", fontSize: "11px", padding: "3px 8px",
                          borderRadius: "4px", cursor: "pointer",
                        }}
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Blacklist Entries */}
        {blacklistEntries.length > 0 && (
          <div style={{ backgroundColor: "rgba(220,38,38,0.05)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "20px 24px", marginBottom: "24px" }}>
            <h3 style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Blacklist Entries ({blacklistEntries.length})
            </h3>
            {blacklistEntries.map(entry => (
              <div key={entry.id} style={{ padding: "10px 12px", backgroundColor: "#111", borderRadius: "6px", marginBottom: "6px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ color: "#DC2626", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
                    {entry.reason.replace(/_/g, " ")}
                  </span>
                  <span style={{ color: "#555", fontSize: "11px" }}>
                    Added {new Date(entry.addedAt).toLocaleDateString()}
                  </span>
                  <span style={{ color: entry.isActive ? "#DC2626" : "#555", fontSize: "11px" }}>
                    {entry.isActive ? "Active" : "Removed"}
                  </span>
                </div>
                {entry.notes && <div style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}>{entry.notes}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Recent Activity */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px 24px" }}>
          <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Recent Activity Logs
          </h3>
          {activityLogs.length === 0 ? (
            <p style={{ color: "#444", fontSize: "13px", margin: 0 }}>No activity logs</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {activityLogs.map(log => (
                <div key={log.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "8px 12px", backgroundColor: "#111", borderRadius: "6px",
                  border: log.flagged ? "1px solid rgba(220,38,38,0.2)" : "1px solid transparent",
                }}>
                  {log.flagged && <span style={{ color: "#DC2626", fontSize: "12px" }}>⚠</span>}
                  <span style={{ color: "#888", fontSize: "12px", fontFamily: "monospace", minWidth: "120px" }}>
                    {log.ipAddress}
                  </span>
                  <span style={{ color: "#ccc", fontSize: "12px", textTransform: "capitalize", flex: 1 }}>
                    {log.action.replace(/_/g, " ")}
                  </span>
                  {log.flagReason && (
                    <span style={{ color: "#DC2626", fontSize: "11px" }}>{log.flagReason.substring(0, 50)}</span>
                  )}
                  <span style={{ color: "#444", fontSize: "11px" }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
