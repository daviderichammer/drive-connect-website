"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
  profileCompleted: boolean;
  insuranceVerified: boolean;
  bankingInfoCompleted: boolean;
}

interface Stats {
  totalBookings: number;
  monthlyRevenue: number;
  revenueChange: number;
  activeVehicles: number;
  totalVehicles: number;
  averageRating: string;
  upcomingBookings: number;
  activeBookings: number;
  pendingBookings: number;
  pendingPayout: number;
  recentBookings: RecentBooking[];
}

interface RecentBooking {
  id: number;
  bookingReference: string;
  renterFirstName: string;
  renterLastName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  vehicle: { year: number; make: string; model: string };
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: "#111111",
        border: `1px solid ${highlight ? "rgba(193,18,31,0.3)" : "#1a1a1a"}`,
        borderRadius: "8px",
        padding: "20px 24px",
      }}
    >
      <p
        style={{
          color: "#555555",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          color: highlight ? "#C1121F" : "#ffffff",
          fontSize: "26px",
          fontWeight: 700,
          margin: "0 0 4px",
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ color: "#444444", fontSize: "11px", margin: 0 }}>{sub}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
    active: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
    completed: { bg: "rgba(100,100,100,0.1)", text: "#888888" },
    cancelled: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
    pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  };
  const c = colors[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span
      style={{
        backgroundColor: c.bg,
        color: c.text,
        padding: "3px 8px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {status}
    </span>
  );
}

export default function HostDashboardPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/host/me"),
      fetch("/api/host/dashboard/stats"),
    ]).then(async ([meRes, statsRes]) => {
      if (meRes.status === 401) {
        router.push("/host/login");
        return;
      }

      const meData = await meRes.json();
      if (!meData.authenticated) {
        router.push("/host/login");
        return;
      }

      if (!meData.host.onboardingCompleted) {
        router.push("/host/onboarding");
        return;
      }

      setHost(meData.host);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      setLoading(false);
    }).catch(() => router.push("/host/login"));
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555555",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  if (!host) return null;

  const firstName = host.ownerName.split(" ")[0];

  return (
    <DashboardShell
      hostName={host.ownerName}
      hostEmail={host.email}
      businessName={host.businessName}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>
          Welcome back, {firstName}
        </h2>
        <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>
          {host.businessName} · Drive Network Partner
        </p>
      </div>

      {/* Setup Banner */}
      {(!host.profileCompleted || !host.insuranceVerified || !host.bankingInfoCompleted) && (
        <div
          style={{
            backgroundColor: "rgba(193, 18, 31, 0.05)",
            border: "1px solid rgba(193, 18, 31, 0.2)",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>
              Complete Your Setup
            </p>
            <p style={{ color: "#888888", fontSize: "13px", margin: 0 }}>
              {!host.insuranceVerified ? "Insurance verification pending. " : ""}
              {!host.bankingInfoCompleted ? "Banking info needed for payouts. " : ""}
              {!host.profileCompleted ? "Business profile incomplete." : ""}
            </p>
          </div>
          <Link
            href="/host/dashboard/settings"
            style={{
              backgroundColor: "#C1121F",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Complete Setup
          </Link>
        </div>
      )}

      {/* Alerts */}
      {stats && stats.pendingBookings > 0 && (
        <div
          style={{
            backgroundColor: "rgba(255,180,0,0.05)",
            border: "1px solid rgba(255,180,0,0.2)",
            borderRadius: "8px",
            padding: "12px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ color: "#FFB400", fontSize: "13px", fontWeight: 600, margin: 0 }}>
            {stats.pendingBookings} booking{stats.pendingBookings > 1 ? "s" : ""} awaiting confirmation
          </p>
          <Link
            href="/host/dashboard/bookings?status=pending"
            style={{
              color: "#FFB400",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Review →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          label="Monthly Revenue"
          value={`$${(stats?.monthlyRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub={stats?.revenueChange !== 0 ? `${(stats?.revenueChange || 0) > 0 ? "+" : ""}${stats?.revenueChange}% vs last month` : "This month"}
          highlight
        />
        <StatCard
          label="Total Bookings"
          value={stats?.totalBookings || 0}
          sub={`${stats?.upcomingBookings || 0} upcoming`}
        />
        <StatCard
          label="Active Vehicles"
          value={stats?.activeVehicles || 0}
          sub={`of ${stats?.totalVehicles || 0} total`}
        />
        <StatCard
          label="Avg Rating"
          value={stats?.averageRating || "—"}
          sub="across all vehicles"
        />
      </div>

      {/* Second row stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          label="Active Trips"
          value={stats?.activeBookings || 0}
          sub="currently rented"
        />
        <StatCard
          label="Upcoming Trips"
          value={stats?.upcomingBookings || 0}
          sub="next 7 days"
        />
        <StatCard
          label="Pending Payout"
          value={`$${(stats?.pendingPayout || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub="awaiting release"
        />
      </div>

      {/* Recent Bookings */}
      <div
        style={{
          backgroundColor: "#111111",
          border: "1px solid #1a1a1a",
          borderRadius: "8px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>
            Recent Bookings
          </h3>
          <Link
            href="/host/dashboard/bookings"
            style={{
              color: "#C1121F",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            View All →
          </Link>
        </div>

        {!stats?.recentBookings?.length ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#555555" }}>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>No bookings yet.</p>
            <p style={{ fontSize: "13px" }}>
              Add vehicles to start accepting bookings.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                {["Reference", "Renter", "Vehicle", "Dates", "Total", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px",
                      textAlign: "left",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#444444",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((b) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: "1px solid #0d0d0d" }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <Link
                      href={`/host/dashboard/bookings/${b.id}`}
                      style={{
                        color: "#C1121F",
                        fontSize: "12px",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontFamily: "monospace",
                      }}
                    >
                      {b.bookingReference}
                    </Link>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px" }}>
                    {b.renterFirstName} {b.renterLastName}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#888888" }}>
                    {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#666666" }}>
                    {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {" — "}
                    {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 600 }}>
                    ${b.totalPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <StatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {[
          { title: "Add Vehicle", desc: "List a new vehicle", href: "/host/dashboard/vehicles?action=add" },
          { title: "View Bookings", desc: "Manage reservations", href: "/host/dashboard/bookings" },
          { title: "Earnings", desc: "Track your revenue", href: "/host/dashboard/earnings" },
          { title: "Messages", desc: "Renter communications", href: "/host/dashboard/messages" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            style={{
              backgroundColor: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              padding: "20px",
              cursor: "pointer",
              textDecoration: "none",
              display: "block",
              transition: "border-color 0.15s",
            }}
          >
            <h4
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 700,
                margin: "0 0 4px",
              }}
            >
              {item.title}
            </h4>
            <p style={{ color: "#555555", fontSize: "12px", margin: 0 }}>
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}
