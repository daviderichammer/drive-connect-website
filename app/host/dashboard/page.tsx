"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingStep: number;
  onboardingCompleted: boolean;
  profileCompleted: boolean;
  insuranceVerified: boolean;
  bankingInfoCompleted: boolean;
}

interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  dailyRate: number;
  status: string;
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div style={{
      padding: "10px 16px",
      borderRadius: "6px",
      backgroundColor: active ? "rgba(193, 18, 31, 0.1)" : "transparent",
      color: active ? "#C1121F" : "#888888",
      fontSize: "13px",
      fontWeight: active ? 700 : 500,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      letterSpacing: "0.02em",
    }}>
      {label}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      backgroundColor: "#111111",
      border: "1px solid #1a1a1a",
      borderRadius: "8px",
      padding: "20px 24px",
    }}>
      <p style={{ color: "#555555", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
        {label}
      </p>
      <p style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700, margin: "0 0 4px" }}>
        {value}
      </p>
      {sub && <p style={{ color: "#555555", fontSize: "12px", margin: 0 }}>{sub}</p>}
    </div>
  );
}

export default function HostDashboardPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/host/me"),
      fetch("/api/host/vehicles"),
    ]).then(async ([meRes, vehiclesRes]) => {
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

      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json();
        setVehicles(vehiclesData.vehicles || []);
      }

      setLoading(false);
    }).catch(() => router.push("/host/login"));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/host/logout", { method: "POST" });
    router.push("/host/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555555", fontFamily: "Inter, sans-serif" }}>
        Loading your dashboard...
      </div>
    );
  }

  if (!host) return null;

  const activeVehicles = vehicles.filter((v) => v.status === "active").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", fontFamily: "Inter, sans-serif", color: "#ffffff", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        flexShrink: 0,
        backgroundColor: "#000000",
        borderRight: "1px solid #111111",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
      }}>
        {/* Logo */}
        <div style={{ padding: "0 4px", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
              DRIVE CONNECT
            </h1>
          </Link>
          <p style={{ color: "#C1121F", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            Partner Portal
          </p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          <NavItem label="📊 Dashboard" active />
          <NavItem label="📬 Inbox" />
          <NavItem label="🚗 Vehicles" />
          <NavItem label="📅 Calendar" />
          <NavItem label="📋 Bookings" />
          <NavItem label="💰 Earnings" />
          <NavItem label="🛡️ Claims" />
          <NavItem label="⭐ Reviews" />
          <NavItem label="📈 Analytics" />
          <NavItem label="⚙️ Settings" />
        </nav>

        {/* User */}
        <div style={{ borderTop: "1px solid #111111", paddingTop: "16px" }}>
          <div style={{ padding: "0 4px", marginBottom: "12px" }}>
            <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {host.ownerName}
            </p>
            <p style={{ color: "#555555", fontSize: "11px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {host.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: "100%", backgroundColor: "transparent", border: "1px solid #222222", color: "#888888", padding: "8px", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>
            Welcome back, {host.ownerName.split(" ")[0]}
          </h2>
          <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>
            {host.businessName} · Drive Network Partner
          </p>
        </div>

        {/* Onboarding Progress Banner */}
        {(!host.profileCompleted || !host.insuranceVerified || !host.bankingInfoCompleted) && (
          <div style={{
            backgroundColor: "rgba(193, 18, 31, 0.05)",
            border: "1px solid rgba(193, 18, 31, 0.2)",
            borderRadius: "8px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>
                Complete Your Profile
              </p>
              <p style={{ color: "#888888", fontSize: "13px", margin: 0 }}>
                {!host.insuranceVerified ? "Insurance verification pending. " : ""}
                {!host.bankingInfoCompleted ? "Banking info needed for payouts." : ""}
              </p>
            </div>
            <Link
              href="/host/onboarding"
              style={{ backgroundColor: "#C1121F", color: "#ffffff", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              Continue Setup
            </Link>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
          <StatCard label="Active Vehicles" value={activeVehicles} sub="in your fleet" />
          <StatCard label="Total Vehicles" value={vehicles.length} sub="listed" />
          <StatCard label="Upcoming Trips" value={0} sub="this week" />
          <StatCard label="Monthly Revenue" value="$0" sub="payouts pending" />
        </div>

        {/* Vehicles Table */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>Your Vehicles</h3>
            <Link
              href="/host/onboarding"
              style={{ backgroundColor: "#C1121F", color: "#ffffff", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              + Add Vehicle
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#555555" }}>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>No vehicles listed yet.</p>
              <p style={{ fontSize: "13px" }}>Add your first vehicle to start accepting bookings.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                  {["Vehicle", "Daily Rate", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#555555", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} style={{ borderBottom: "1px solid #111111" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "14px" }}>
                      ${Number(vehicle.dailyRate).toFixed(2)}/day
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        backgroundColor: vehicle.status === "active" ? "rgba(0, 200, 100, 0.1)" : "rgba(255, 255, 255, 0.05)",
                        color: vehicle.status === "active" ? "#00C864" : "#888888",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button style={{ backgroundColor: "transparent", border: "1px solid #333333", color: "#888888", padding: "6px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { title: "Inbox", desc: "View messages from renters", icon: "📬" },
            { title: "Bookings", desc: "Manage your reservations", icon: "📋" },
            { title: "Earnings", desc: "Track your revenue", icon: "💰" },
          ].map((item) => (
            <div key={item.title} style={{
              backgroundColor: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              padding: "20px",
              cursor: "pointer",
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
              <h4 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>{item.title}</h4>
              <p style={{ color: "#555555", fontSize: "12px", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#222222", fontSize: "11px", marginTop: "48px", fontStyle: "italic" }}>
          Drive Connect IS Principled — Fairness · Integrity · Trust · Independence · Accountability · Shared Success
        </p>
      </main>
    </div>
  );
}
