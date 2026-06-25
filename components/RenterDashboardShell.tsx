"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
interface RenterDashboardShellProps {
  children: React.ReactNode;
  renterName: string;
  renterEmail: string;
}
const NAV_ITEMS = [
  { label: "Dashboard", href: "/renter/dashboard", icon: "◈" },
  { label: "My Trips", href: "/renter/dashboard/trips", icon: "◈" },
  { label: "Messages", href: "/renter/dashboard/messages", icon: "◈" },
  { label: "Favorites", href: "/renter/dashboard/favorites", icon: "◈" },
  { label: "Reviews", href: "/renter/dashboard/reviews", icon: "◈" },
  { label: "Trust Status", href: "/renter/trust", icon: "◈" },
  { label: "Deposits", href: "/renter/deposits", icon: "◈" },
  { label: "Claims", href: "/renter/claims", icon: "◈" },
  { label: "Settings", href: "/renter/dashboard/settings", icon: "◈" },
];
export default function RenterDashboardShell({
  children,
  renterName,
  renterEmail,
}: RenterDashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = async () => {
    await fetch("/api/renter/logout", { method: "POST" });
    router.push("/renter/login");
  };
  const isActive = (href: string) => {
    if (href === "/renter/dashboard") return pathname === href;
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
          <h1 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            DRIVE CONNECT
          </h1>
        </Link>
        <p style={{ color: "#C1121F", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
          Renter Portal
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
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: active ? 700 : 500,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "8px" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      {/* User info */}
      <div style={{ borderTop: "1px solid #111111", paddingTop: "16px", marginTop: "16px" }}>
        <div style={{ padding: "0 4px", marginBottom: "12px" }}>
          <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {renterName}
          </p>
          <p style={{ color: "#555555", fontSize: "11px", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {renterEmail}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "9px 16px",
            backgroundColor: "transparent",
            border: "1px solid #222222",
            borderRadius: "6px",
            color: "#666666",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#050505", fontFamily: "Inter, sans-serif" }}>
      {/* Desktop sidebar */}
      <div style={{ display: "none" }} className="desktop-sidebar">
        {sidebar}
      </div>
      {/* Mobile header */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 200,
        backgroundColor: "#000000",
        borderBottom: "1px solid #111111",
        padding: "0 1rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "13px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            DRIVE CONNECT
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "20px" }}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 150, backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Mobile sidebar */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, bottom: 0,
        zIndex: 160,
        transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        width: "220px",
      }}>
        {sidebar}
      </div>
      {/* Main content */}
      <main style={{
        flex: 1,
        padding: "2rem",
        paddingTop: "calc(56px + 2rem)",
        maxWidth: "100%",
        overflowX: "hidden",
      }}>
        {children}
      </main>
      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: block !important; }
          main { padding-top: 2rem !important; }
          div[style*="position: fixed"][style*="height: 56px"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
