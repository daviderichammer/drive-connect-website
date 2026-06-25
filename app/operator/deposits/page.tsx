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

interface DepositRecord {
  id: number;
  bookingId: number;
  amountRequired: number;
  amountCollected: number | null;
  collectionMethod: string | null;
  status: string;
  collectedAt: string | null;
  returnedAt: string | null;
  notes: string | null;
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
  pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  collected: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
  returned: { bg: "rgba(100,100,100,0.1)", text: "#888888" },
  partial_return: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
  disputed: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function OperatorDepositsPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRecord | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [confirmForm, setConfirmForm] = useState({ bookingId: "", amountCollected: "", collectionMethod: "cash", notes: "" });
  const [returnForm, setReturnForm] = useState({ depositId: "", amountReturned: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tiers, setTiers] = useState<{ vehicleClass: string; defaultAmount: number }[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [hostRes, depositsRes, tiersRes] = await Promise.all([
        fetch("/api/host/me"),
        fetch("/api/operator/deposits"),
        fetch("/api/deposits/tiers"),
      ]);
      if (!hostRes.ok) { router.push("/host/login"); return; }
      const hostData = await hostRes.json();
      setHost(hostData.host);
      if (depositsRes.ok) {
        const d = await depositsRes.json();
        setDeposits(d.deposits || []);
      }
      if (tiersRes.ok) {
        const t = await tiersRes.json();
        setTiers(t.tiers || []);
      }
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleConfirmDeposit = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/operator/deposits/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: confirmForm.bookingId,
          amountCollected: parseFloat(confirmForm.amountCollected),
          collectionMethod: confirmForm.collectionMethod,
          notes: confirmForm.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed."); return; }
      setSuccess("Deposit confirmed successfully.");
      setShowConfirmModal(false);
      setConfirmForm({ bookingId: "", amountCollected: "", collectionMethod: "cash", notes: "" });
      fetchData();
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  const handleReturnDeposit = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/operator/deposits/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositId: returnForm.depositId,
          amountReturned: returnForm.amountReturned ? parseFloat(returnForm.amountReturned) : undefined,
          notes: returnForm.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed."); return; }
      setSuccess("Deposit marked as returned.");
      setShowReturnModal(false);
      setReturnForm({ depositId: "", amountReturned: "", notes: "" });
      fetchData();
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888", fontSize: "14px" }}>Loading deposits...</div>
    </div>
  );

  if (!host) return null;

  const pendingCount = deposits.filter(d => d.status === "pending").length;
  const collectedCount = deposits.filter(d => d.status === "collected").length;
  const totalCollected = deposits.filter(d => d.amountCollected).reduce((sum, d) => sum + (d.amountCollected || 0), 0);

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      <div style={{ padding: "32px", maxWidth: "1100px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: 0 }}>Security Deposits</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "6px" }}>
            Deposits are paid directly by renters to you at pickup. Drive Connect tracks status only.
          </p>
        </div>

        {/* Notice Banner */}
        <div style={{ backgroundColor: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", padding: "14px 18px", marginBottom: "28px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <span style={{ color: "#DC2626", fontSize: "18px", flexShrink: 0 }}>ℹ</span>
          <div>
            <div style={{ color: "#DC2626", fontWeight: 700, fontSize: "13px", marginBottom: "4px" }}>Important: Direct Payment Policy</div>
            <div style={{ color: "#aaa", fontSize: "13px" }}>Security deposits are collected directly by you from the renter at pickup or delivery. Drive Connect does not process or hold deposit funds — we only track the status for your records.</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Pending Collection", value: pendingCount, color: "#FFB400" },
            { label: "Deposits Collected", value: collectedCount, color: "#00C864" },
            { label: "Total Held", value: `$${totalCollected.toFixed(2)}`, color: "#DC2626" },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
              <div style={{ color: stat.color, fontSize: "24px", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Deposit Tiers Reference */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px", marginBottom: "28px" }}>
          <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: "0 0 14px 0" }}>Deposit Tier Reference</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {tiers.map((tier) => (
              <div key={tier.vehicleClass} style={{ backgroundColor: "#111", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <div style={{ color: "#DC2626", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>{tier.vehicleClass}</div>
                <div style={{ color: "#fff", fontSize: "18px", fontWeight: 700 }}>${tier.defaultAmount}</div>
                <div style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>default</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {error && <div style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#DC2626", fontSize: "13px" }}>{error}</div>}
        {success && <div style={{ backgroundColor: "rgba(0,200,100,0.1)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", color: "#00C864", fontSize: "13px" }}>{success}</div>}

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <button
            onClick={() => setShowConfirmModal(true)}
            style={{ backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
          >
            + Confirm Deposit Collected
          </button>
        </div>

        {/* Deposits Table */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: 0 }}>Deposit History</h3>
          </div>
          {deposits.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#555", fontSize: "14px" }}>
              No deposit records yet. Confirm deposits after collecting them from renters.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["Booking", "Renter", "Vehicle", "Amount", "Method", "Status", "Date", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#555", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((dep) => (
                    <tr key={dep.id} style={{ borderBottom: "1px solid #111" }}>
                      <td style={{ padding: "14px 16px", color: "#DC2626", fontSize: "13px", fontWeight: 600 }}>
                        {dep.booking?.bookingReference || `#${dep.bookingId}`}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "#fff", fontSize: "13px" }}>{dep.booking ? `${dep.booking.renterFirstName} ${dep.booking.renterLastName}` : "—"}</div>
                        <div style={{ color: "#555", fontSize: "11px" }}>{dep.booking?.renterEmail}</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#aaa", fontSize: "13px" }}>
                        {dep.booking?.vehicle ? `${dep.booking.vehicle.year} ${dep.booking.vehicle.make} ${dep.booking.vehicle.model}` : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>${dep.amountRequired.toFixed(2)}</div>
                        {dep.amountCollected && <div style={{ color: "#00C864", fontSize: "11px" }}>Collected: ${dep.amountCollected.toFixed(2)}</div>}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#aaa", fontSize: "13px", textTransform: "capitalize" }}>
                        {dep.collectionMethod || "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={dep.status} />
                      </td>
                      <td style={{ padding: "14px 16px", color: "#555", fontSize: "12px" }}>
                        {dep.collectedAt ? new Date(dep.collectedAt).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {dep.status === "collected" && (
                          <button
                            onClick={() => { setReturnForm({ depositId: String(dep.id), amountReturned: String(dep.amountCollected || dep.amountRequired), notes: "" }); setShowReturnModal(true); }}
                            style={{ backgroundColor: "transparent", border: "1px solid #333", color: "#aaa", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", cursor: "pointer" }}
                          >
                            Mark Returned
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "460px" }}>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: "0 0 20px 0" }}>Confirm Deposit Collected</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>BOOKING ID</label>
                  <input
                    type="number"
                    value={confirmForm.bookingId}
                    onChange={e => setConfirmForm(f => ({ ...f, bookingId: e.target.value }))}
                    placeholder="Enter booking ID"
                    style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>AMOUNT COLLECTED ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={confirmForm.amountCollected}
                    onChange={e => setConfirmForm(f => ({ ...f, amountCollected: e.target.value }))}
                    placeholder="e.g. 300.00"
                    style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>COLLECTION METHOD</label>
                  <select
                    value={confirmForm.collectionMethod}
                    onChange={e => setConfirmForm(f => ({ ...f, collectionMethod: e.target.value }))}
                    style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
                  >
                    {["cash", "card", "venmo", "zelle", "paypal", "other"].map(m => (
                      <option key={m} value={m} style={{ backgroundColor: "#111" }}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>NOTES (optional)</label>
                  <textarea
                    value={confirmForm.notes}
                    onChange={e => setConfirmForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Any additional notes..."
                    rows={2}
                    style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              {error && <div style={{ color: "#DC2626", fontSize: "13px", marginTop: "12px" }}>{error}</div>}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button onClick={handleConfirmDeposit} disabled={saving || !confirmForm.bookingId || !confirmForm.amountCollected}
                  style={{ flex: 1, backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Saving..." : "Confirm Collected"}
                </button>
                <button onClick={() => { setShowConfirmModal(false); setError(""); }}
                  style={{ flex: 1, backgroundColor: "transparent", color: "#aaa", border: "1px solid #333", borderRadius: "8px", padding: "12px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return Modal */}
        {showReturnModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "420px" }}>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: "0 0 20px 0" }}>Mark Deposit Returned</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>AMOUNT RETURNED ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={returnForm.amountReturned}
                    onChange={e => setReturnForm(f => ({ ...f, amountReturned: e.target.value }))}
                    style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px" }}>NOTES (optional)</label>
                  <textarea
                    value={returnForm.notes}
                    onChange={e => setReturnForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="e.g. Full deposit returned at drop-off"
                    rows={2}
                    style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              {error && <div style={{ color: "#DC2626", fontSize: "13px", marginTop: "12px" }}>{error}</div>}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button onClick={handleReturnDeposit} disabled={saving}
                  style={{ flex: 1, backgroundColor: "#00C864", color: "#000", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving..." : "Mark Returned"}
                </button>
                <button onClick={() => { setShowReturnModal(false); setError(""); }}
                  style={{ flex: 1, backgroundColor: "transparent", color: "#aaa", border: "1px solid #333", borderRadius: "8px", padding: "12px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
