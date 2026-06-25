"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HostData {
  id: number;
  email: string;
  name: string;
  onboardingComplete: boolean;
  onboardingStep: number;
  businessProfile: {
    businessName: string;
    description: string | null;
    serviceAreas: string | null;
    phone: string | null;
    logoUrl: string | null;
    bankingComplete: boolean;
  } | null;
}

export default function HostDashboardPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/host/me");
        if (!res.ok) {
          router.push("/host-login");
          return;
        }
        const data = await res.json();
        setHost(data.host);

        // Redirect to onboarding if not complete
        if (!data.host.onboardingComplete) {
          const step = data.host.onboardingStep;
          if (step === 0) router.push("/host/onboarding/welcome");
          else if (step === 1) router.push("/host/onboarding/profile");
          else if (step === 2) router.push("/host/onboarding/vehicle");
          else if (step === 3) router.push("/host/onboarding/insurance");
          else if (step === 4) router.push("/host/onboarding/banking");
          return;
        }
      } catch {
        router.push("/host-login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/host/logout", { method: "POST" });
    router.push("/host-login");
  }

  if (loading || !host) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555" }}>Loading your dashboard...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/host/dashboard", active: true },
    { label: "Inbox", href: "#", active: false },
    { label: "Vehicles", href: "#", active: false },
    { label: "Calendar", href: "#", active: false },
    { label: "Bookings", href: "#", active: false },
    { label: "Earnings", href: "#", active: false },
    { label: "Claims", href: "#", active: false },
    { label: "Ratings & Reviews", href: "#", active: false },
    { label: "Tax Information", href: "#", active: false },
    { label: "Customer Support", href: "#", active: false },
    { label: "Business Analytics", href: "#", active: false },
    { label: "Account Settings", href: "#", active: false },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", fontFamily: "Inter, sans-serif", display: "flex" }}>
      {/* Left Nav Rail */}
      <div style={{ width: "240px", backgroundColor: "#0a0a0a", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid #1a1a1a" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ color: "#ffffff", fontSize: "1rem", fontWeight: 900, letterSpacing: "0.15em" }}>DRIVE CONNECT</div>
          </Link>
          <div style={{ color: "#DC2626", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.25rem" }}>Partner Portal</div>
        </div>

        <nav style={{ flex: 1, padding: "1rem 0" }}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: "block",
                padding: "0.75rem 1.5rem",
                color: item.active ? "#ffffff" : "#555555",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: item.active ? 700 : 400,
                backgroundColor: item.active ? "#1a1a1a" : "transparent",
                borderLeft: item.active ? "3px solid #DC2626" : "3px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: "1rem", borderTop: "1px solid #1a1a1a" }}>
          <button
            onClick={handleLogout}
            style={{ width: "100%", backgroundColor: "transparent", border: "1px solid #333333", color: "#555555", padding: "0.625rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8125rem", fontFamily: "Inter, sans-serif" }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Top Bar */}
        <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>Dashboard</h1>
            <p style={{ margin: 0, color: "#555555", fontSize: "0.8125rem" }}>
              Welcome back, {host.name}
              {host.businessProfile && ` — ${host.businessProfile.businessName}`}
            </p>
          </div>
          <div style={{ fontSize: "0.75rem", color: "#555555" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        <div style={{ padding: "2rem" }}>
          {/* Alert Banner */}
          <div style={{ backgroundColor: "#0a0500", border: "1px solid #f59e0b", borderRadius: "8px", padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#f59e0b", fontSize: "1.25rem" }}>⚡</span>
            <div>
              <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.875rem" }}>Phase 4 Coming Soon</div>
              <div style={{ color: "#888888", fontSize: "0.8125rem" }}>Full host dashboard with bookings, calendar, earnings, and vehicle management is being built in Phase 4.</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Upcoming Reservations", value: "—", color: "#60a5fa" },
              { label: "Vehicles Currently Rented", value: "—", color: "#22c55e" },
              { label: "Pending Payments", value: "—", color: "#f59e0b" },
              { label: "New Messages", value: "—", color: "#a78bfa" },
              { label: "Monthly Revenue", value: "—", color: "#DC2626" },
              { label: "Total Active Vehicles", value: "—", color: "#ffffff" },
            ].map((stat) => (
              <div key={stat.label} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.5rem" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: stat.color, marginBottom: "0.25rem" }}>{stat.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Profile Summary */}
          {host.businessProfile && (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem", marginTop: 0 }}>Your Business Profile</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.6875rem", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Business Name</div>
                  <div style={{ fontSize: "0.9375rem", color: "#ffffff" }}>{host.businessProfile.businessName}</div>
                </div>
                {host.businessProfile.serviceAreas && (
                  <div>
                    <div style={{ fontSize: "0.6875rem", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Service Areas</div>
                    <div style={{ fontSize: "0.9375rem", color: "#ffffff" }}>{host.businessProfile.serviceAreas}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: "0.6875rem", color: "#555555", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Banking Setup</div>
                  <div style={{ fontSize: "0.9375rem", color: host.businessProfile.bankingComplete ? "#22c55e" : "#f59e0b" }}>
                    {host.businessProfile.bankingComplete ? "✓ Complete" : "Pending"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.5rem" }}>
            <h2 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem", marginTop: 0 }}>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
              {[
                { label: "Add Vehicle", href: "#", icon: "🚗" },
                { label: "View Calendar", href: "#", icon: "📅" },
                { label: "Check Earnings", href: "#", icon: "💰" },
                { label: "Message Renters", href: "#", icon: "💬" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1rem",
                    backgroundColor: "#111111",
                    border: "1px solid #1a1a1a",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: "#cccccc",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    transition: "border-color 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{action.icon}</span>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
