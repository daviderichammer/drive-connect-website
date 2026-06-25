"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface DepositRecord {
  id: number;
  bookingId: number;
  amountRequired: number;
  amountCollected: number | null;
  collectionMethod: string | null;
  status: string;
  collectedAt: string | null;
  returnedAt: string | null;
  booking: {
    bookingReference: string;
    renterFirstName: string;
    renterLastName: string;
    renterEmail: string;
    vehicle: { year: number; make: string; model: string };
  } | null;
  operator: { businessName: string; ownerName: string } | null;
}

interface DepositTier {
  id: number;
  vehicleClass: string;
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
}

interface StatEntry {
  status: string;
  count: number;
  totalCollected: number;
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
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function AdminDepositsPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [tiers, setTiers] = useState<DepositTier[]>([]);
  const [stats, setStats] = useState<StatEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingTier, setEditingTier] = useState<DepositTier | null>(null);
  const [tierForm, setTierForm] = useState({ minAmount: "", maxAmount: "", defaultAmount: "" });
  const [savingTier, setSavingTier] = useState(false);
  const [tierError, setTierError] = useState("");
  const [tierSuccess, setTierSuccess] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/deposits?status=${filter}`, {
        headers: { "x-admin-auth": "admin_authenticated" },
      });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.deposits || []);
        setTiers(data.tiers || []);
        setStats(data.stats || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [router, filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveTier = async () => {
    if (!editingTier) return;
    setSavingTier(true);
    setTierError("");
    try {
      const res = await fetch("/api/admin/deposits/tiers", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-auth": "admin_authenticated" },
        body: JSON.stringify({
          vehicleClass: editingTier.vehicleClass,
          minAmount: parseFloat(tierForm.minAmount),
          maxAmount: parseFloat(tierForm.maxAmount),
          defaultAmount: parseFloat(tierForm.defaultAmount),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setTierError(data.error || "Failed."); return; }
      setTierSuccess(`${editingTier.vehicleClass} tier updated.`);
      setEditingTier(null);
      fetchData();
    } catch { setTierError("Network error."); }
    finally { setSavingTier(false); }
  };

  const totalCollected = stats.reduce((sum, s) => sum + s.totalCollected, 0);
  const totalCount = stats.reduce((sum, s) => sum + s.count, 0);

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
              style={{ color: item.href === "/admin/deposits" ? "#DC2626" : "#666", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: 0 }}>Deposit Overview</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "6px" }}>
            Monitoring only — Drive Connect does not hold or process deposits.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Records", value: totalCount, color: "#fff" },
            { label: "Total Tracked", value: `$${totalCollected.toFixed(2)}`, color: "#DC2626" },
            { label: "Collected", value: stats.find(s => s.status === "collected")?.count || 0, color: "#00C864" },
            { label: "Pending", value: stats.find(s => s.status === "pending")?.count || 0, color: "#FFB400" },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
              <div style={{ color: stat.color, fontSize: "24px", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Deposit Tiers Management */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px", marginBottom: "28px" }}>
          <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: "0 0 16px 0" }}>Deposit Tier Configuration</h3>
          {tierSuccess && <div style={{ color: "#00C864", fontSize: "13px", marginBottom: "12px" }}>{tierSuccess}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {tiers.map(tier => (
              <div key={tier.vehicleClass} style={{ backgroundColor: "#111", borderRadius: "8px", padding: "14px" }}>
                <div style={{ color: "#DC2626", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px" }}>{tier.vehicleClass}</div>
                {editingTier?.vehicleClass === tier.vehicleClass ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { label: "Min", key: "minAmount" as const },
                      { label: "Max", key: "maxAmount" as const },
                      { label: "Default", key: "defaultAmount" as const },
                    ].map(field => (
                      <div key={field.key}>
                        <label style={{ color: "#555", fontSize: "10px", display: "block", marginBottom: "2px" }}>{field.label} ($)</label>
                        <input
                          type="number"
                          value={tierForm[field.key]}
                          onChange={e => setTierForm(f => ({ ...f, [field.key]: e.target.value }))}
                          style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #333", borderRadius: "4px", padding: "6px 8px", color: "#fff", fontSize: "12px", boxSizing: "border-box" }}
                        />
                      </div>
                    ))}
                    {tierError && <div style={{ color: "#DC2626", fontSize: "11px" }}>{tierError}</div>}
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={handleSaveTier} disabled={savingTier}
                        style={{ flex: 1, backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: "4px", padding: "6px", fontSize: "11px", cursor: "pointer" }}>
                        Save
                      </button>
                      <button onClick={() => setEditingTier(null)}
                        style={{ flex: 1, backgroundColor: "transparent", color: "#666", border: "1px solid #333", borderRadius: "4px", padding: "6px", fontSize: "11px", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>${tier.defaultAmount}</div>
                    <div style={{ color: "#555", fontSize: "11px", marginBottom: "10px" }}>${tier.minAmount} – ${tier.maxAmount}</div>
                    <button onClick={() => { setEditingTier(tier); setTierForm({ minAmount: String(tier.minAmount), maxAmount: String(tier.maxAmount), defaultAmount: String(tier.defaultAmount) }); setTierError(""); setTierSuccess(""); }}
                      style={{ backgroundColor: "transparent", color: "#DC2626", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", padding: "5px 10px", fontSize: "11px", cursor: "pointer", width: "100%" }}>
                      Edit
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {["all", "pending", "collected", "returned", "disputed"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ backgroundColor: filter === f ? "#DC2626" : "transparent", color: filter === f ? "#fff" : "#666", border: `1px solid ${filter === f ? "#DC2626" : "#222"}`, borderRadius: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Deposits Table */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          {deposits.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#555", fontSize: "14px" }}>No deposit records found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["Booking", "Renter", "Operator", "Vehicle", "Amount", "Method", "Status"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#555", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deposits.map(dep => (
                    <tr key={dep.id} style={{ borderBottom: "1px solid #111" }}>
                      <td style={{ padding: "14px 16px", color: "#DC2626", fontSize: "13px", fontWeight: 600 }}>
                        {dep.booking?.bookingReference || `#${dep.bookingId}`}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "#fff", fontSize: "13px" }}>{dep.booking ? `${dep.booking.renterFirstName} ${dep.booking.renterLastName}` : "—"}</div>
                        <div style={{ color: "#555", fontSize: "11px" }}>{dep.booking?.renterEmail}</div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#aaa", fontSize: "13px" }}>{dep.operator?.businessName || "—"}</td>
                      <td style={{ padding: "14px 16px", color: "#aaa", fontSize: "13px" }}>
                        {dep.booking?.vehicle ? `${dep.booking.vehicle.year} ${dep.booking.vehicle.make} ${dep.booking.vehicle.model}` : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>${dep.amountRequired.toFixed(2)}</div>
                        {dep.amountCollected && <div style={{ color: "#00C864", fontSize: "11px" }}>${dep.amountCollected.toFixed(2)} collected</div>}
                      </td>
                      <td style={{ padding: "14px 16px", color: "#aaa", fontSize: "13px", textTransform: "capitalize" }}>{dep.collectionMethod || "—"}</td>
                      <td style={{ padding: "14px 16px" }}><StatusBadge status={dep.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
