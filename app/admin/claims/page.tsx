"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface DepositClaim {
  id: number;
  claimReference: string;
  bookingId: number;
  claimType: string;
  amount: number;
  description: string;
  status: string;
  filedAt: string;
  resolvedAt: string | null;
  messageCount: number;
  booking: {
    bookingReference: string;
    renterFirstName: string;
    renterLastName: string;
    renterEmail: string;
    vehicle: { year: number; make: string; model: string };
  } | null;
  operator: { businessName: string; ownerName: string } | null;
}

interface ClaimStats {
  status: string;
  count: number;
  totalAmount: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  filed: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  acknowledged: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
  disputed: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
  resolved: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
};

const CLAIM_TYPE_LABELS: Record<string, string> = {
  smoking: "Smoking", tire: "Tire Damage", interior: "Interior Damage",
  exterior: "Exterior Damage", fuel: "Fuel Charge", cleaning: "Cleaning Fee",
  missing_accessory: "Missing Accessory", late_return: "Late Return",
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

export default function AdminClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<DepositClaim[]>([]);
  const [stats, setStats] = useState<ClaimStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/claims?status=${filter}`, {
        headers: { "x-admin-auth": "admin_authenticated" },
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (res.ok) {
        const data = await res.json();
        setClaims(data.claims || []);
        setStats(data.stats || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [router, filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalClaims = stats.reduce((sum, s) => sum + s.count, 0);
  const totalAmount = stats.reduce((sum, s) => sum + s.totalAmount, 0);
  const disputedCount = stats.find(s => s.status === "disputed")?.count || 0;
  const openCount = (stats.find(s => s.status === "filed")?.count || 0) + disputedCount;

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888" }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff" }}>
      {/* Admin Nav */}
      <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span style={{ color: "#DC2626", fontWeight: 800, fontSize: "16px" }}>DRIVE CONNECT</span>
          <span style={{ color: "#555", fontSize: "12px" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Deposits", href: "/admin/deposits" },
            { label: "Claims", href: "/admin/claims" },
            { label: "Applications", href: "/admin/applications" },
          ].map(item => (
            <a key={item.href} href={item.href}
              style={{ color: item.href === "/admin/claims" ? "#DC2626" : "#666", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: 0 }}>Claims Monitoring</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "6px" }}>
            Read-only monitoring dashboard. Drive Connect does not adjudicate claims.
          </p>
        </div>

        {/* Policy Banner */}
        <div style={{ backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px" }}>
          <h3 style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700, margin: "0 0 8px 0" }}>Admin Monitoring Policy</h3>
          <div style={{ color: "#888", fontSize: "13px", lineHeight: "1.6" }}>
            This dashboard is for monitoring claim patterns and identifying potential abuse only. Drive Connect does <strong style={{ color: "#aaa" }}>not</strong> resolve disputes, adjudicate claims, or make decisions on behalf of either party. All claim resolution is between operators and renters directly. Admin may flag accounts for review if abuse patterns are detected.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: "Total Claims", value: totalClaims, color: "#fff" },
            { label: "Open", value: openCount, color: "#FFB400" },
            { label: "Disputed", value: disputedCount, color: "#FF3232" },
            { label: "Resolved", value: stats.find(s => s.status === "resolved")?.count || 0, color: "#00C864" },
            { label: "Total Claimed", value: `$${totalAmount.toFixed(2)}`, color: "#DC2626" },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "18px" }}>
              <div style={{ color: stat.color, fontSize: "22px", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Claim Type Breakdown */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
          <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: "0 0 14px 0" }}>Claims by Type</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.entries(CLAIM_TYPE_LABELS).map(([type, label]) => {
              const count = claims.filter(c => c.claimType === type).length;
              return (
                <div key={type} style={{ backgroundColor: "#111", borderRadius: "6px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#aaa", fontSize: "13px" }}>{label}</span>
                  <span style={{ backgroundColor: count > 0 ? "rgba(220,38,38,0.2)" : "rgba(100,100,100,0.2)", color: count > 0 ? "#DC2626" : "#555", fontSize: "12px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["all", "filed", "acknowledged", "disputed", "resolved"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ backgroundColor: filter === f ? "#DC2626" : "transparent", color: filter === f ? "#fff" : "#666", border: `1px solid ${filter === f ? "#DC2626" : "#222"}`, borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Claims List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {claims.length === 0 ? (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "40px", textAlign: "center", color: "#555", fontSize: "14px" }}>
              No claims found.
            </div>
          ) : (
            claims.map(claim => (
              <div key={claim.id} style={{ backgroundColor: "#0a0a0a", border: `1px solid ${claim.status === "disputed" ? "rgba(255,50,50,0.3)" : "#1a1a1a"}`, borderRadius: "10px", overflow: "hidden" }}>
                <div
                  onClick={() => setExpandedClaim(expandedClaim === claim.id ? null : claim.id)}
                  style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700 }}>{claim.claimReference}</span>
                    <StatusBadge status={claim.status} />
                    <span style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#aaa", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>
                      {CLAIM_TYPE_LABELS[claim.claimType] || claim.claimType}
                    </span>
                    {claim.status === "disputed" && (
                      <span style={{ backgroundColor: "rgba(255,50,50,0.1)", color: "#FF3232", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: 700 }}>
                        ⚠ DISPUTED
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#fff", fontSize: "16px", fontWeight: 700 }}>${claim.amount.toFixed(2)}</div>
                      <div style={{ color: "#555", fontSize: "11px" }}>{new Date(claim.filedAt).toLocaleDateString()}</div>
                    </div>
                    <span style={{ color: "#555", fontSize: "16px" }}>{expandedClaim === claim.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {expandedClaim === claim.id && (
                  <div style={{ borderTop: "1px solid #1a1a1a", padding: "16px 20px", backgroundColor: "#050505" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "14px" }}>
                      <div>
                        <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>Operator</div>
                        <div style={{ color: "#aaa", fontSize: "13px" }}>{claim.operator?.businessName || "—"}</div>
                      </div>
                      <div>
                        <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>Renter</div>
                        <div style={{ color: "#aaa", fontSize: "13px" }}>{claim.booking ? `${claim.booking.renterFirstName} ${claim.booking.renterLastName}` : "—"}</div>
                        <div style={{ color: "#555", fontSize: "11px" }}>{claim.booking?.renterEmail}</div>
                      </div>
                      <div>
                        <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>Vehicle</div>
                        <div style={{ color: "#aaa", fontSize: "13px" }}>
                          {claim.booking?.vehicle ? `${claim.booking.vehicle.year} ${claim.booking.vehicle.make} ${claim.booking.vehicle.model}` : "—"}
                        </div>
                      </div>
                    </div>
                    <div style={{ backgroundColor: "#111", borderRadius: "8px", padding: "12px", marginBottom: "10px" }}>
                      <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>Description</div>
                      <div style={{ color: "#ddd", fontSize: "13px", lineHeight: "1.5" }}>{claim.description}</div>
                    </div>
                    <div style={{ color: "#555", fontSize: "12px" }}>
                      {claim.messageCount} message{claim.messageCount !== 1 ? "s" : ""} in thread
                      {claim.resolvedAt && ` · Resolved ${new Date(claim.resolvedAt).toLocaleDateString()}`}
                    </div>
                    <div style={{ marginTop: "10px", padding: "8px 12px", backgroundColor: "rgba(100,100,100,0.05)", borderRadius: "6px", color: "#555", fontSize: "12px" }}>
                      Admin note: This is a read-only view. Drive Connect does not intervene in claim resolution.
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
