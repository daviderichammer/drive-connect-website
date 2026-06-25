"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface DepositClaim {
  id: number;
  claimReference: string;
  bookingId: number;
  claimType: string;
  amount: number;
  description: string;
  evidenceUrls: string[];
  status: string;
  resolutionNotes: string | null;
  filedAt: string;
  resolvedAt: string | null;
  messages: { id: number; senderRole: string; message: string; sentAt: string }[];
  booking: {
    bookingReference: string;
    startDate: string;
    endDate: string;
    vehicle: { year: number; make: string; model: string };
  } | null;
  operator: { businessName: string; ownerName: string } | null;
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

export default function RenterClaimsPage() {
  const router = useRouter();
  const [renter, setRenter] = useState<RenterData | null>(null);
  const [claims, setClaims] = useState<DepositClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      const [renterRes, claimsRes] = await Promise.all([
        fetch("/api/renter/me"),
        fetch("/api/renter/claims"),
      ]);
      if (!renterRes.ok) { router.push("/renter/login"); return; }
      const renterData = await renterRes.json();
      setRenter(renterData.renter);
      if (claimsRes.ok) {
        const c = await claimsRes.json();
        setClaims(c.claims || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888" }}>Loading claims...</div>
    </div>
  );

  if (!renter) return null;

  const filtered = filter === "all" ? claims : claims.filter(c => c.status === filter);
  const openCount = claims.filter(c => c.status === "filed").length;

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ padding: "32px", maxWidth: "900px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: 0 }}>Claims Against You</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "6px" }}>
            Review and respond to any damage or fee claims filed by operators.
          </p>
        </div>

        {/* Notice */}
        <div style={{ backgroundColor: "rgba(255,180,0,0.05)", border: "1px solid rgba(255,180,0,0.2)", borderRadius: "10px", padding: "16px 20px", marginBottom: "24px" }}>
          <h3 style={{ color: "#FFB400", fontSize: "13px", fontWeight: 700, margin: "0 0 8px 0" }}>Your Rights Regarding Claims</h3>
          <div style={{ color: "#888", fontSize: "13px", lineHeight: "1.6" }}>
            You have the right to acknowledge or dispute any claim. Drive Connect provides this communication platform but does <strong style={{ color: "#aaa" }}>not</strong> adjudicate disputes — resolution is handled directly between you and the operator. If you believe a claim is unfair, use the messaging thread to communicate your position.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Awaiting Response", value: openCount, color: "#FFB400" },
            { label: "Total Claims", value: claims.length, color: "#fff" },
            { label: "Resolved", value: claims.filter(c => c.status === "resolved").length, color: "#00C864" },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
              <div style={{ color: stat.color, fontSize: "24px", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.length === 0 ? (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "40px", textAlign: "center", color: "#555", fontSize: "14px" }}>
              {filter === "all" ? "No claims against you. You're in good standing!" : `No ${filter} claims.`}
            </div>
          ) : (
            filtered.map(claim => (
              <div key={claim.id} style={{ backgroundColor: "#0a0a0a", border: `1px solid ${claim.status === "filed" ? "rgba(255,180,0,0.3)" : "#1a1a1a"}`, borderRadius: "10px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700 }}>{claim.claimReference}</span>
                      <StatusBadge status={claim.status} />
                      <span style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#aaa", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>
                        {CLAIM_TYPE_LABELS[claim.claimType] || claim.claimType}
                      </span>
                    </div>
                    <div style={{ color: "#666", fontSize: "12px" }}>
                      From: <span style={{ color: "#aaa" }}>{claim.operator?.businessName || "Operator"}</span>
                      {claim.booking && <> · Booking <span style={{ color: "#DC2626" }}>{claim.booking.bookingReference}</span></>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>${claim.amount.toFixed(2)}</div>
                    <div style={{ color: "#555", fontSize: "11px" }}>{new Date(claim.filedAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <div style={{ color: "#aaa", fontSize: "13px", marginBottom: "12px", lineHeight: "1.5" }}>{claim.description}</div>

                {claim.status === "filed" && (
                  <div style={{ backgroundColor: "rgba(255,180,0,0.05)", border: "1px solid rgba(255,180,0,0.2)", borderRadius: "6px", padding: "10px 14px", marginBottom: "12px" }}>
                    <span style={{ color: "#FFB400", fontSize: "13px" }}>⚠ This claim requires your response. Please review and acknowledge or dispute.</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ color: "#555", fontSize: "12px" }}>{claim.messages.length} message{claim.messages.length !== 1 ? "s" : ""} in thread</div>
                  <Link href={`/renter/claims/${claim.id}`}
                    style={{ color: "#DC2626", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
                    {claim.status === "filed" ? "Respond to Claim →" : "View Details →"}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </RenterDashboardShell>
  );
}
