"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
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
    renterFirstName: string;
    renterLastName: string;
    renterEmail: string;
    startDate: string;
    endDate: string;
    vehicle: { year: number; make: string; model: string };
  } | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  filed: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  acknowledged: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
  disputed: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
  resolved: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
};

const CLAIM_TYPE_LABELS: Record<string, string> = {
  smoking: "Smoking", tire: "Tire Damage", interior: "Interior Damage",
  exterior: "Exterior Damage", fuel: "Fuel", cleaning: "Cleaning Fee",
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

export default function OperatorClaimsPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [claims, setClaims] = useState<DepositClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      const [hostRes, claimsRes] = await Promise.all([
        fetch("/api/host/me"),
        fetch("/api/operator/claims"),
      ]);
      if (!hostRes.ok) { router.push("/host/login"); return; }
      const hostData = await hostRes.json();
      setHost(hostData.host);
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
      <div style={{ color: "#888", fontSize: "14px" }}>Loading claims...</div>
    </div>
  );

  if (!host) return null;

  const filtered = filter === "all" ? claims : claims.filter(c => c.status === filter);
  const openCount = claims.filter(c => c.status === "filed" || c.status === "disputed").length;
  const totalAmount = claims.reduce((sum, c) => sum + c.amount, 0);

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      <div style={{ padding: "32px", maxWidth: "1100px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: 0 }}>Claims</h1>
            <p style={{ color: "#666", fontSize: "14px", marginTop: "6px" }}>
              File and manage damage or fee claims with renters. Drive Connect provides the communication platform only.
            </p>
          </div>
          <Link href="/operator/claims/new"
            style={{ backgroundColor: "#DC2626", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 600 }}>
            + File New Claim
          </Link>
        </div>

        {/* Notice */}
        <div style={{ backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px" }}>
          <span style={{ color: "#888", fontSize: "13px" }}>
            <strong style={{ color: "#DC2626" }}>Note:</strong> Drive Connect does not adjudicate claims. This platform facilitates communication between you and the renter. Resolution is between both parties.
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Open Claims", value: openCount, color: "#FFB400" },
            { label: "Total Claims", value: claims.length, color: "#fff" },
            { label: "Total Claimed", value: `$${totalAmount.toFixed(2)}`, color: "#DC2626" },
          ].map((stat) => (
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
              {filter === "all" ? "No claims filed yet. Use the button above to file a claim." : `No ${filter} claims.`}
            </div>
          ) : (
            filtered.map((claim) => (
              <div key={claim.id} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700 }}>{claim.claimReference}</span>
                    <StatusBadge status={claim.status} />
                    <span style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#aaa", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" }}>
                      {CLAIM_TYPE_LABELS[claim.claimType] || claim.claimType}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>${claim.amount.toFixed(2)}</div>
                    <div style={{ color: "#555", fontSize: "11px" }}>{new Date(claim.filedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ color: "#aaa", fontSize: "13px", marginBottom: "12px" }}>{claim.description}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ color: "#555", fontSize: "12px" }}>
                    {claim.booking ? (
                      <>Booking: <span style={{ color: "#DC2626" }}>{claim.booking.bookingReference}</span> — {claim.booking.renterFirstName} {claim.booking.renterLastName}</>
                    ) : `Booking #${claim.bookingId}`}
                    {" · "}{claim.messages.length} message{claim.messages.length !== 1 ? "s" : ""}
                  </div>
                  <Link href={`/operator/claims/${claim.id}`}
                    style={{ color: "#DC2626", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
                    View Details →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
