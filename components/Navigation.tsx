"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/find-a-car", label: "Find A Car" },
  { href: "/become-a-partner", label: "Become A Drive Network Partner" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/protection-plans", label: "Protection Plans" },
  { href: "/why-we-exist", label: "Why We Exist" },
  { href: "/support", label: "Support" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      style={{
        backgroundColor: "#000000",
        borderBottom: "1px solid #1a1a1a",
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              color: "#DC2626",
              fontWeight: 900,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            DRIVE
          </span>
          <span
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "1.25rem",
              letterSpacing: "-0.02em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            CONNECT
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.125rem",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: pathname === link.href ? "#DC2626" : "#cccccc",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                padding: "0.5rem 0.625rem",
                borderRadius: "4px",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color =
                  pathname === link.href ? "#DC2626" : "#cccccc";
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/host-login"
            style={{
              marginLeft: "0.75rem",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
              transition: "background-color 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.backgroundColor = "#B91C1C";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.backgroundColor = "#DC2626";
            }}
          >
            Host Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            padding: "0.5rem",
          }}
          className="show-mobile"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: "#0a0a0a",
            borderTop: "1px solid #1a1a1a",
            padding: "1rem 1.5rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                color: pathname === link.href ? "#DC2626" : "#cccccc",
                textDecoration: "none",
                fontSize: "0.9375rem",
                fontWeight: 500,
                padding: "0.75rem 0",
                borderBottom: "1px solid #1a1a1a",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/host-login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              marginTop: "1rem",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "0.75rem 1.25rem",
              borderRadius: "6px",
              textAlign: "center",
            }}
          >
            Host Login
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 1025px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
