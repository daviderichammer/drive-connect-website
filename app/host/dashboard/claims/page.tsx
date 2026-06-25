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

interface Claim {
  id: number;
  claimReference: string;
  description: string;
  estimatedCost: number | null;
  status: string;
  photos: string[];
  createdAt: string;
  booking: {
    bookingReference: string;
    renterFirstName: string;
    renterLastName: string;
    renterEmail: string;
  };
  vehicle: { year: number; make: string; model: string };
}

interface Booking {
  id: number;
  bookingReference: string;
  renterFirstName: string;
  renterLastName: string;
  status: string;
  vehicle: { year: number; make: string; model: string };
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    open: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
    under_review: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
    resolved: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
    denied: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
  };
  const c = colors[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function ClaimsPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bookingId: "", description: "", estimatedCost: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchClaims = useCallback(async () => {
    const res = await fetch("/api/host/dashboard/claims");
    if (res.ok) {
      const data = await res.json();
      setClaims(data.claims || []);
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/host/me"),
      fetch("/api/host/dashboard/claims"),
      fetch("/api/host/dashboard/bookings?status=completed&limit=100"),
    ]).then(async ([meRes, cRes, bRes]) => {
      if (meRes.status === 401) { router.push("/host/login"); return; }
      const meData = await meRes.json();
      if (!meData.authenticated || !meData.host.onboardingCompleted) { router.push("/host/login"); return; }
      setHost(meData.host);

      if (cRes.ok) {
        const cData = await cRes.json();
        setClaims(cData.claims || []);
      }
      if (bRes.ok) {
        const bData = await bRes.json();
        setCompletedBookings(bData.bookings || []);
      }
      setLoading(false);
    }).catch(() => router.push("/host/login"));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const res = await fetch("/api/host/dashboard/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookingId: parseInt(form.bookingId),
        description: form.description,
        estimatedCost: form.estimatedCost ? parseFloat(form.estimatedCost) : null,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setMessage({ type: "error", text: data.error || "Failed to submit claim." });
      return;
    }

    setMessage({ type: "success", text: `Claim ${data.claim.claimReference} submitted successfully.` });
    setShowForm(false);
    setForm({ bookingId: "", description: "", estimatedCost: "" });
    await fetchClaims();
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>
        Loading claims...
      </div>
    );
  }

  if (!host) return null;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Claims & Incidents</h2>
          <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>Report and track damage or incident claims</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
        >
          + File Claim
        </button>
      </div>

      {message.text && (
        <div style={{ backgroundColor: message.type === "error" ? "rgba(193,18,31,0.1)" : "rgba(0,200,100,0.1)", border: `1px solid ${message.type === "error" ? "rgba(193,18,31,0.3)" : "rgba(0,200,100,0.3)"}`, borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: message.type === "error" ? "#C1121F" : "#00C864", fontSize: "13px" }}>
          {message.text}
        </div>
      )}

      {/* Claim Form */}
      {showForm && (
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 20px" }}>File New Claim</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "11px", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Booking *
              </label>
              <select
                value={form.bookingId}
                onChange={(e) => setForm((p) => ({ ...p, bookingId: e.target.value }))}
                required
                style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "10px 14px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif" }}
              >
                <option value="">Select a completed booking...</option>
                {completedBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bookingReference} — {b.vehicle.year} {b.vehicle.make} {b.vehicle.model} — {b.renterFirstName} {b.renterLastName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "11px", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Description of Incident *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
                rows={4}
                placeholder="Describe the damage or incident in detail..."
                style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "10px 14px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", color: "#666", fontSize: "11px", fontWeight: 700, marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Estimated Cost ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={form.estimatedCost}
                onChange={(e) => setForm((p) => ({ ...p, estimatedCost: e.target.value }))}
                placeholder="Optional"
                style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "10px 14px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ backgroundColor: "transparent", border: "1px solid #333", color: "#888", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Claims List */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
        {claims.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "#555" }}>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>No claims filed.</p>
            <p style={{ fontSize: "13px" }}>File a claim if a vehicle was damaged during a rental.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                {["Claim Ref", "Vehicle", "Booking", "Renter", "Est. Cost", "Status", "Filed"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #0d0d0d" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ color: "#C1121F", fontSize: "12px", fontWeight: 700, fontFamily: "monospace" }}>
                      {c.claimReference}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                    {c.vehicle.year} {c.vehicle.make} {c.vehicle.model}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ color: "#666", fontSize: "11px", fontFamily: "monospace" }}>
                      {c.booking.bookingReference}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px" }}>
                    {c.booking.renterFirstName} {c.booking.renterLastName}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>
                    {c.estimatedCost ? `$${c.estimatedCost.toFixed(2)}` : "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <StatusBadge status={c.status} />
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "12px", color: "#555" }}>
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}
