"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Application {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  primaryCity: string;
  numberOfVehicles: number;
  vehicleTypes: string;
  currentPlatforms: string;
  turoProfileUrl: string | null;
  offersAirportDelivery: boolean;
  offersHomeDelivery: boolean;
  hasCommercialInsurance: boolean;
  supportsSameDayBookings: boolean;
  operates24x7: boolean;
  wouldUseDCSupport: boolean;
  status: string;
  createdAt: string;
  hostAccount: { id: number; email: string; onboardingComplete: boolean; onboardingStep: number } | null;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
  totalHosts: number;
  onboardingComplete: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/applications?status=${statusFilter}`),
        fetch("/api/admin/stats"),
      ]);

      if (appsRes.status === 401 || statsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const appsData = await appsRes.json();
      const statsData = await statsRes.json();

      setApplications(appsData.applications || []);
      setStats(statsData.stats || null);
    } catch {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleAction(appId: number, action: "approve" | "reject") {
    setActionLoading(true);
    setActionMessage("");
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes: reviewNotes }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(
          action === "approve"
            ? `✓ Application approved. Registration link sent to operator.${data.emailSent ? "" : " (Email delivery failed — check SMTP config)"}`
            : `✓ Application rejected. Notification sent.`
        );
        setSelectedApp(null);
        setReviewNotes("");
        fetchData();
      } else {
        setActionMessage(`Error: ${data.error}`);
      }
    } catch {
      setActionMessage("Action failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      pending: { bg: "#1a1200", color: "#f59e0b" },
      approved: { bg: "#001a00", color: "#22c55e" },
      rejected: { bg: "#1a0000", color: "#ef4444" },
    };
    const c = colors[status] || { bg: "#111", color: "#888" };
    return (
      <span style={{ backgroundColor: c.bg, color: c.color, padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 900, letterSpacing: "0.15em" }}>DRIVE CONNECT</span>
          </Link>
          <span style={{ color: "#DC2626", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginLeft: "1rem" }}>Admin Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: "transparent", border: "1px solid #333333", color: "#888888", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8125rem", fontFamily: "Inter, sans-serif" }}
        >
          Log Out
        </button>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        {/* Stats */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Pending Review", value: stats.pending, color: "#f59e0b" },
              { label: "Approved", value: stats.approved, color: "#22c55e" },
              { label: "Rejected", value: stats.rejected, color: "#ef4444" },
              { label: "Total Applications", value: stats.total, color: "#ffffff" },
              { label: "Active Hosts", value: stats.totalHosts, color: "#60a5fa" },
              { label: "Onboarding Complete", value: stats.onboardingComplete, color: "#a78bfa" },
            ].map((stat) => (
              <div key={stat.label} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.25rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.25rem" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {actionMessage && (
          <div style={{ backgroundColor: actionMessage.startsWith("Error") ? "#1a0000" : "#001a00", border: `1px solid ${actionMessage.startsWith("Error") ? "#DC2626" : "#22c55e"}`, borderRadius: "6px", padding: "0.875rem 1rem", marginBottom: "1.5rem" }}>
            <p style={{ color: actionMessage.startsWith("Error") ? "#DC2626" : "#22c55e", margin: 0, fontSize: "0.875rem" }}>{actionMessage}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: statusFilter === s ? "#DC2626" : "#333333",
                backgroundColor: statusFilter === s ? "#DC2626" : "transparent",
                color: statusFilter === s ? "#ffffff" : "#888888",
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontWeight: 600,
                textTransform: "capitalize",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {s === "all" ? "All Applications" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #1a1a1a" }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#ffffff" }}>Partner Applications</h2>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#555555" }}>Loading applications...</div>
          ) : applications.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "#555555" }}>No applications found.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["ID", "Business", "Owner", "City", "Vehicles", "Insurance", "Status", "Submitted", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.6875rem", fontWeight: 700, color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} style={{ borderBottom: "1px solid #111111" }}>
                      <td style={{ padding: "1rem", fontSize: "0.8125rem", color: "#555555" }}>#{app.id}</td>
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#ffffff" }}>{app.businessName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#555555" }}>{app.email}</div>
                      </td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#cccccc" }}>{app.ownerName}</td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#cccccc" }}>{app.primaryCity}</td>
                      <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#cccccc" }}>{app.numberOfVehicles}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ color: app.hasCommercialInsurance ? "#22c55e" : "#ef4444", fontSize: "0.8125rem" }}>
                          {app.hasCommercialInsurance ? "✓ Yes" : "✗ No"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem" }}>{statusBadge(app.status)}</td>
                      <td style={{ padding: "1rem", fontSize: "0.75rem", color: "#555555" }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        <button
                          onClick={() => { setSelectedApp(app); setReviewNotes(""); setActionMessage(""); }}
                          style={{ backgroundColor: "#1a1a1a", border: "1px solid #333333", color: "#ffffff", padding: "0.375rem 0.875rem", borderRadius: "4px", cursor: "pointer", fontSize: "0.8125rem", fontFamily: "Inter, sans-serif" }}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", width: "100%", maxWidth: "700px", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700 }}>Application #{selectedApp.id} — {selectedApp.businessName}</h2>
              <button onClick={() => setSelectedApp(null)} style={{ background: "none", border: "none", color: "#888888", fontSize: "1.5rem", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                {[
                  ["Business Name", selectedApp.businessName],
                  ["Owner Name", selectedApp.ownerName],
                  ["Email", selectedApp.email],
                  ["Phone", selectedApp.phone],
                  ["Primary City", selectedApp.primaryCity],
                  ["Number of Vehicles", selectedApp.numberOfVehicles.toString()],
                  ["Vehicle Types", selectedApp.vehicleTypes],
                  ["Current Platforms", selectedApp.currentPlatforms],
                  ["Turo Profile URL", selectedApp.turoProfileUrl || "N/A"],
                  ["Status", selectedApp.status],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: "0.6875rem", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{label}</div>
                    <div style={{ fontSize: "0.9375rem", color: "#ffffff" }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>Operational Capabilities</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {[
                    ["Airport Delivery", selectedApp.offersAirportDelivery],
                    ["Home Delivery", selectedApp.offersHomeDelivery],
                    ["Commercial Insurance", selectedApp.hasCommercialInsurance],
                    ["Same-Day Bookings", selectedApp.supportsSameDayBookings],
                    ["24/7 Operations", selectedApp.operates24x7],
                    ["Would Use DC Support", selectedApp.wouldUseDCSupport],
                  ].map(([label, val]) => (
                    <div key={String(label)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ color: val ? "#22c55e" : "#ef4444", fontSize: "1rem" }}>{val ? "✓" : "✗"}</span>
                      <span style={{ fontSize: "0.875rem", color: "#cccccc" }}>{String(label)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApp.status === "pending" && (
                <>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Review Notes (optional)
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Internal notes or rejection reason..."
                      rows={3}
                      style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #333333", borderRadius: "6px", backgroundColor: "#1a1a1a", color: "#ffffff", fontSize: "0.875rem", fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      onClick={() => handleAction(selectedApp.id, "approve")}
                      disabled={actionLoading}
                      style={{ flex: 1, backgroundColor: "#15803d", color: "#ffffff", border: "none", borderRadius: "6px", padding: "0.875rem", fontWeight: 700, fontSize: "0.9375rem", cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
                    >
                      {actionLoading ? "Processing..." : "✓ Approve"}
                    </button>
                    <button
                      onClick={() => handleAction(selectedApp.id, "reject")}
                      disabled={actionLoading}
                      style={{ flex: 1, backgroundColor: "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "0.875rem", fontWeight: 700, fontSize: "0.9375rem", cursor: actionLoading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}
                    >
                      {actionLoading ? "Processing..." : "✗ Reject"}
                    </button>
                  </div>
                </>
              )}

              {selectedApp.status !== "pending" && (
                <div style={{ backgroundColor: "#111111", borderRadius: "6px", padding: "1rem", textAlign: "center" }}>
                  <p style={{ color: "#555555", margin: 0, fontSize: "0.875rem" }}>
                    This application has already been {selectedApp.status}.
                    {selectedApp.hostAccount && ` Host account created (ID: ${selectedApp.hostAccount.id}).`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
