"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BlacklistEntry {
  id: number;
  renterId: number | null;
  email: string | null;
  phone: string | null;
  licenseNumber: string | null;
  reason: string;
  addedBy: number | null;
  addedAt: string;
  expiresAt: string | null;
  notes: string | null;
  isActive: boolean;
}

const REASON_LABELS: Record<string, string> = {
  fraud: "Fraud",
  stolen_identity: "Stolen Identity",
  repeated_claims: "Repeated Claims",
  chargebacks: "Chargebacks",
  banned_by_operator: "Banned by Operator",
};

const REASON_COLORS: Record<string, string> = {
  fraud: "#DC2626",
  stolen_identity: "#DC2626",
  repeated_claims: "#f97316",
  chargebacks: "#f59e0b",
  banned_by_operator: "#888",
};

export default function AdminBlacklistPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    email: "", phone: "", licenseNumber: "", renterId: "",
    reason: "fraud", notes: "", expiresAt: "",
  });

  const fetchData = useCallback(async (searchTerm = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: "1", limit: "20" });
      if (searchTerm) params.set("search", searchTerm);
      const res = await fetch(`/api/admin/fraud/blacklist?${params}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries || []);
        setTotal(data.pagination?.total || 0);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleRemove(id: number) {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/fraud/blacklist/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Entry removed from blacklist");
        await fetchData(search);
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(-1);
    setMessage("");
    try {
      const res = await fetch("/api/admin/fraud/blacklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          renterId: form.renterId || undefined,
          expiresAt: form.expiresAt || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Entry added to blacklist");
        setShowAddForm(false);
        setForm({ email: "", phone: "", licenseNumber: "", renterId: "", reason: "fraud", notes: "", expiresAt: "" });
        await fetchData(search);
      } else {
        setMessage(data.error || "Failed to add entry");
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Nav */}
      <div style={{ backgroundColor: "#000", borderBottom: "1px solid #111", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0", height: "56px" }}>
          <Link href="/admin/fraud" style={{ color: "#888", fontSize: "13px", textDecoration: "none", marginRight: "24px" }}>
            ← Fraud Dashboard
          </Link>
          <span style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700 }}>Blacklist Management</span>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1100px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Blacklist Database
            </h1>
            <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
              {total} active entries
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              backgroundColor: "#DC2626", color: "#fff", border: "none",
              padding: "10px 20px", borderRadius: "6px", fontSize: "13px",
              fontWeight: 700, cursor: "pointer",
            }}
          >
            + Add to Blacklist
          </button>
        </div>

        {message && (
          <div style={{
            backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "6px", padding: "10px 14px", marginBottom: "16px",
            color: "#10b981", fontSize: "13px",
          }}>
            {message}
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div style={{
            backgroundColor: "#0a0a0a", border: "1px solid #DC262633",
            borderRadius: "10px", padding: "24px", marginBottom: "24px",
          }}>
            <h3 style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Add Blacklist Entry
            </h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                {[
                  { label: "Email", key: "email", type: "email", placeholder: "renter@example.com" },
                  { label: "Phone", key: "phone", type: "text", placeholder: "+1 555 000 0000" },
                  { label: "License Number", key: "licenseNumber", type: "text", placeholder: "DL12345678" },
                  { label: "Renter ID (optional)", key: "renterId", type: "number", placeholder: "123" },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ color: "#888", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      style={{
                        width: "100%", backgroundColor: "#111", border: "1px solid #222",
                        borderRadius: "6px", padding: "8px 12px", color: "#fff",
                        fontSize: "13px", boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <label style={{ color: "#888", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                    Reason *
                  </label>
                  <select
                    value={form.reason}
                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    required
                    style={{
                      width: "100%", backgroundColor: "#111", border: "1px solid #222",
                      borderRadius: "6px", padding: "8px 12px", color: "#fff",
                      fontSize: "13px", boxSizing: "border-box",
                    }}
                  >
                    {Object.entries(REASON_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                    Expires At (leave blank for permanent)
                  </label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    style={{
                      width: "100%", backgroundColor: "#111", border: "1px solid #222",
                      borderRadius: "6px", padding: "8px 12px", color: "#fff",
                      fontSize: "13px", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ color: "#888", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}>
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  placeholder="Additional context..."
                  style={{
                    width: "100%", backgroundColor: "#111", border: "1px solid #222",
                    borderRadius: "6px", padding: "8px 12px", color: "#fff",
                    fontSize: "13px", boxSizing: "border-box", resize: "vertical",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  disabled={actionLoading === -1}
                  style={{
                    backgroundColor: "#DC2626", color: "#fff", border: "none",
                    padding: "10px 20px", borderRadius: "6px", fontSize: "13px",
                    fontWeight: 700, cursor: "pointer",
                  }}
                >
                  {actionLoading === -1 ? "Adding..." : "Add to Blacklist"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    backgroundColor: "transparent", color: "#888", border: "1px solid #222",
                    padding: "10px 20px", borderRadius: "6px", fontSize: "13px", cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by email, phone, or license..."
            value={search}
            onChange={e => { setSearch(e.target.value); fetchData(e.target.value); }}
            style={{
              width: "100%", maxWidth: "400px", backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a", borderRadius: "6px", padding: "10px 14px",
              color: "#fff", fontSize: "13px", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                {["Identifier", "Reason", "Added", "Expires", "Notes", "Actions"].map(h => (
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
                <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#444", fontSize: "13px" }}>Loading...</td></tr>
              ) : entries.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#444", fontSize: "13px" }}>No blacklist entries found</td></tr>
              ) : entries.map(entry => (
                <tr key={entry.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {entry.email && <span style={{ color: "#ccc", fontSize: "12px" }}>{entry.email}</span>}
                      {entry.phone && <span style={{ color: "#888", fontSize: "11px" }}>{entry.phone}</span>}
                      {entry.licenseNumber && <span style={{ color: "#888", fontSize: "11px" }}>DL: {entry.licenseNumber}</span>}
                      {entry.renterId && <span style={{ color: "#555", fontSize: "11px" }}>ID: {entry.renterId}</span>}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      color: REASON_COLORS[entry.reason] || "#888",
                      fontSize: "11px", fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.05em",
                    }}>
                      {REASON_LABELS[entry.reason] || entry.reason}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888", fontSize: "12px" }}>
                    {new Date(entry.addedAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px", color: entry.expiresAt ? "#888" : "#555", fontSize: "12px" }}>
                    {entry.expiresAt ? new Date(entry.expiresAt).toLocaleDateString() : "Permanent"}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#555", fontSize: "12px", maxWidth: "200px" }}>
                    {entry.notes ? (
                      <span title={entry.notes}>{entry.notes.substring(0, 40)}{entry.notes.length > 40 ? "..." : ""}</span>
                    ) : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => handleRemove(entry.id)}
                      disabled={actionLoading === entry.id}
                      style={{
                        backgroundColor: "transparent", color: "#DC2626",
                        border: "1px solid rgba(220,38,38,0.3)",
                        padding: "5px 10px", borderRadius: "4px",
                        fontSize: "11px", cursor: "pointer",
                      }}
                    >
                      {actionLoading === entry.id ? "..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
