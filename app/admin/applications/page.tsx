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
  status: string;
  createdAt: string;
  hasCommercialInsurance: boolean;
  turoProfileUrl: string | null;
  hostAccount: { id: number; onboardingCompleted: boolean } | null;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(255, 165, 0, 0.1)", text: "#FFA500" },
  approved: { bg: "rgba(0, 200, 100, 0.1)", text: "#00C864" },
  rejected: { bg: "rgba(193, 18, 31, 0.1)", text: "#C1121F" },
};

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  const fetchApplications = useCallback(async (status: string, page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?status=${status}&page=${page}&limit=20`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setApplications(data.applications || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1 });
    } catch {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchStats = useCallback(async () => {
    try {
      const [pendingRes, approvedRes, rejectedRes, allRes] = await Promise.all([
        fetch("/api/admin/applications?status=pending&limit=1"),
        fetch("/api/admin/applications?status=approved&limit=1"),
        fetch("/api/admin/applications?status=rejected&limit=1"),
        fetch("/api/admin/applications?status=all&limit=1"),
      ]);
      const [pending, approved, rejected, all] = await Promise.all([
        pendingRes.json(), approvedRes.json(), rejectedRes.json(), allRes.json(),
      ]);
      setStats({
        pending: pending.pagination?.total || 0,
        approved: approved.pagination?.total || 0,
        rejected: rejected.pagination?.total || 0,
        total: all.pagination?.total || 0,
      });
    } catch {
      console.error("Failed to fetch stats");
    }
  }, []);

  useEffect(() => {
    fetchApplications(filter, 1);
    fetchStats();
  }, [filter, fetchApplications, fetchStats]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      fontFamily: "Inter, Arial, sans-serif",
      color: "#ffffff",
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#000000",
        borderBottom: "1px solid #1a1a1a",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <h1 style={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: 0,
          }}>
            DRIVE CONNECT
          </h1>
          <span style={{
            backgroundColor: "#C1121F",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "4px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Admin
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #333333",
            color: "#888888",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            cursor: "pointer",
            fontFamily: "Inter, Arial, sans-serif",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ padding: "32px" }}>
        {/* Page Title */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>
            Partner Applications
          </h2>
          <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>
            Review and manage Drive Network Partner applications
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}>
          {[
            { label: "Total", value: stats.total, color: "#ffffff" },
            { label: "Pending", value: stats.pending, color: "#FFA500" },
            { label: "Approved", value: stats.approved, color: "#00C864" },
            { label: "Rejected", value: stats.rejected, color: "#C1121F" },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              padding: "20px 24px",
            }}>
              <p style={{ color: "#555555", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
                {stat.label}
              </p>
              <p style={{ color: stat.color, fontSize: "32px", fontWeight: 700, margin: 0 }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: "flex",
          gap: "4px",
          marginBottom: "24px",
          backgroundColor: "#111111",
          padding: "4px",
          borderRadius: "8px",
          width: "fit-content",
        }}>
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                backgroundColor: filter === status ? "#C1121F" : "transparent",
                color: filter === status ? "#ffffff" : "#888888",
                border: "none",
                padding: "8px 20px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "Inter, Arial, sans-serif",
                textTransform: "capitalize",
                letterSpacing: "0.02em",
                transition: "all 0.15s ease",
              }}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        <div style={{
          backgroundColor: "#111111",
          border: "1px solid #1a1a1a",
          borderRadius: "8px",
          overflow: "hidden",
        }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#555555" }}>
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#555555" }}>
              No applications found.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {["ID", "Business", "Owner", "City", "Vehicles", "Insurance", "Submitted", "Status", "Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#555555",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app.id} style={{
                    borderBottom: idx < applications.length - 1 ? "1px solid #1a1a1a" : "none",
                    transition: "background-color 0.1s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#161616")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", color: "#555555", fontSize: "13px" }}>
                      #{app.id}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>{app.businessName}</div>
                      <div style={{ color: "#555555", fontSize: "12px" }}>{app.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px" }}>{app.ownerName}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#888888" }}>{app.primaryCity}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", textAlign: "center" }}>{app.numberOfVehicles}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center" }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: app.hasCommercialInsurance ? "#00C864" : "#555555",
                      }}>
                        {app.hasCommercialInsurance ? "✓ Yes" : "✗ No"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888888" }}>
                      {formatDate(app.createdAt)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        backgroundColor: statusColors[app.status]?.bg || "rgba(255,255,255,0.05)",
                        color: statusColors[app.status]?.text || "#ffffff",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        letterSpacing: "0.05em",
                      }}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link
                        href={`/admin/applications/${app.id}`}
                        style={{
                          backgroundColor: "#C1121F",
                          color: "#ffffff",
                          padding: "6px 14px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textDecoration: "none",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "24px",
          }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => fetchApplications(filter, page)}
                style={{
                  backgroundColor: pagination.page === page ? "#C1121F" : "#111111",
                  color: "#ffffff",
                  border: "1px solid #1a1a1a",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "Inter, Arial, sans-serif",
                }}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
