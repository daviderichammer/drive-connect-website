"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
  hostName: string;
  hostEmail: string;
  businessName: string;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/host/dashboard", icon: "▪" },
  { label: "Vehicles", href: "/host/dashboard/vehicles", icon: "▪" },
  { label: "Bookings", href: "/host/dashboard/bookings", icon: "▪" },
  { label: "Earnings", href: "/host/dashboard/earnings", icon: "▪" },
  { label: "Messages", href: "/host/dashboard/messages", icon: "▪" },
  { label: "Claims", href: "/host/dashboard/claims", icon: "▪" },
  { label: "Deposits", href: "/operator/deposits", icon: "▪" },
  { label: "Damage Claims", href: "/operator/claims", icon: "▪" },
  { label: "Settings", href: "/host/dashboard/settings", icon: "▪" },
];

export default function DashboardShell({
  children,
  hostName,
  hostEmail,
  businessName,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/host/logout", { method: "POST" });
    router.push("/host/login");
  };

  const isActive = (href: string) => {
    if (href === "/host/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebar = (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        backgroundColor: "#000000",
        borderRight: "1px solid #111111",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 4px", marginBottom: "32px" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 4px",
            }}
          >
            DRIVE CONNECT
          </h1>
        </Link>
        <p
          style={{
            color: "#C1121F",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Partner Portal
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
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
                textDecoration: "none",
                borderLeft: active ? "2px solid #C1121F" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ borderTop: "1px solid #111111", paddingTop: "16px" }}>
        <div style={{ padding: "0 4px", marginBottom: "12px" }}>
          <p
            style={{
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              margin: "0 0 2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {hostName}
          </p>
          <p
            style={{
              color: "#444444",
              fontSize: "10px",
              margin: "0 0 2px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {businessName}
          </p>
          <p
            style={{
              color: "#333333",
              fontSize: "10px",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {hostEmail}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            border: "1px solid #222222",
            color: "#666666",
            padding: "8px",
            borderRadius: "6px",
            fontSize: "11px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Log Out
        </button>
      </div>
    </aside>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        fontFamily: "Inter, -apple-system, sans-serif",
        color: "#ffffff",
        display: "flex",
      }}
    >
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: "none",
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 100,
          backgroundColor: "#C1121F",
          border: "none",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "18px",
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        style={{
          display: mobileOpen ? "flex" : undefined,
          position: mobileOpen ? "fixed" : undefined,
          zIndex: mobileOpen ? 99 : undefined,
          top: 0,
          left: 0,
          bottom: 0,
        }}
        className="sidebar-wrapper"
      >
        {sidebar}
      </div>

      {/* Desktop sidebar always visible */}
      <div className="desktop-sidebar">{sidebar}</div>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: "32px",
          overflow: "auto",
          minWidth: 0,
        }}
      >
        {children}
        <p
          style={{
            textAlign: "center",
            color: "#1a1a1a",
            fontSize: "11px",
            marginTop: "48px",
            fontStyle: "italic",
          }}
        >
          Drive Connect IS Principled — Fairness · Integrity · Trust · Independence · Accountability · Shared Success
        </p>
      </main>

      <style>{`
        .desktop-sidebar { display: flex; }
        .sidebar-wrapper { display: none; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none; }
          .mobile-menu-btn { display: block !important; }
          .sidebar-wrapper { display: flex; }
        }
      `}</style>
    </div>
  );
}
