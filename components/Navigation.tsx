"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/find-a-car", label: "Find A Vehicle" },
  { href: "/become-a-partner", label: "List Vehicles" },
  {
    label: "Ecosystem",
    dropdown: [
      { href: "/about", label: "About Drive Connect" },
      { href: "/why-we-exist", label: "Why Drive Connect Exists" },
      { href: "/how-market-engine-works", label: "Connected Operator Model" },
      { href: "/trust-infrastructure", label: "Ecosystem Infrastructure" },
      { href: "/drive-philosophy", label: "Drive Philosophy" },
      { href: "/future-markets", label: "Future Markets" },
      { href: "/market-principle", label: "The Market Principle" },
      { href: "/why-we-built-this", label: "Why We Built This" },
      { href: "/vision", label: "Our Vision" },
    ],
  },
  {
    label: "Legal",
    dropdown: [
      { href: "/terms-of-service", label: "Terms of Service" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/operator-agreement", label: "Operator Agreement" },
      { href: "/rental-terms", label: "Rental Terms" },
      { href: "/protection-plan-terms", label: "Protection Plan Terms" },
      { href: "/security-deposit-policy", label: "Security Deposit Policy" },
      { href: "/claims-protection-policy", label: "Claims & Protection" },
      { href: "/dispute-resolution", label: "Dispute Resolution" },
      { href: "/fraud-prevention", label: "Fraud Prevention" },
      { href: "/driver-verification", label: "Driver Verification" },
    ],
  },
  { href: "/support", label: "Support" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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
          {navLinks.map((link) => {
            if ("dropdown" in link && link.dropdown) {
              return (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#cccccc",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                      padding: "0.5rem 0.625rem",
                      borderRadius: "4px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.label}
                    <ChevronDown size={12} />
                  </button>
                  {openDropdown === link.label && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        backgroundColor: "#0a0a0a",
                        border: "1px solid #1a1a1a",
                        borderRadius: "8px",
                        padding: "0.5rem 0",
                        minWidth: "220px",
                        zIndex: 100,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                      }}
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          style={{
                            display: "block",
                            color: pathname === item.href ? "#DC2626" : "#cccccc",
                            textDecoration: "none",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            padding: "0.5rem 1rem",
                            transition: "color 0.2s ease, background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.target as HTMLAnchorElement;
                            el.style.color = "#ffffff";
                            el.style.backgroundColor = "#1a1a1a";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.target as HTMLAnchorElement;
                            el.style.color = pathname === item.href ? "#DC2626" : "#cccccc";
                            el.style.backgroundColor = "transparent";
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={(link as { href: string; label: string }).href}
                href={(link as { href: string; label: string }).href}
                style={{
                  color: pathname === (link as { href: string; label: string }).href ? "#DC2626" : "#cccccc",
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
                    pathname === (link as { href: string; label: string }).href ? "#DC2626" : "#cccccc";
                }}
              >
                {link.label}
              </Link>
            );
          })}
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
            Operator Login
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
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          {navLinks.map((link) => {
            if ("dropdown" in link && link.dropdown) {
              return (
                <div key={link.label}>
                  <p
                    style={{
                      color: "#DC2626",
                      fontWeight: 700,
                      fontSize: "0.6875rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      padding: "0.75rem 0 0.375rem 0",
                      borderBottom: "1px solid #1a1a1a",
                      margin: 0,
                    }}
                  >
                    {link.label}
                  </p>
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "block",
                        color: pathname === item.href ? "#DC2626" : "#aaaaaa",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        padding: "0.5rem 0 0.5rem 0.75rem",
                        borderBottom: "1px solid #111111",
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              );
            }
            return (
              <Link
                key={(link as { href: string; label: string }).href}
                href={(link as { href: string; label: string }).href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  color: pathname === (link as { href: string; label: string }).href ? "#DC2626" : "#cccccc",
                  textDecoration: "none",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                {link.label}
              </Link>
            );
          })}
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
            Operator Login
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
