"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Philosophy Banner */}
      <div
        style={{
          backgroundColor: "#DC2626",
          padding: "1rem 1.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#ffffff",
            margin: 0,
          }}
        >
          DRIVE CONNECT — Economic Fairness Doctrine &nbsp;·&nbsp; Trust Infrastructure &nbsp;·&nbsp; Aligned Incentives &nbsp;·&nbsp; Shared Success
        </p>
      </div>

      {/* Main Footer */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 1.5rem 2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  color: "#DC2626",
                  fontWeight: 900,
                  fontSize: "1.375rem",
                  letterSpacing: "-0.02em",
                }}
              >
                DRIVE
              </span>
              <span
                style={{
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "1.375rem",
                  letterSpacing: "-0.02em",
                  marginLeft: "0.375rem",
                }}
              >
                CONNECT
              </span>
            </div>
            <p
              style={{
                color: "#888888",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                maxWidth: "240px",
              }}
            >
              Economic fairness doctrine applied to car rental. Trust infrastructure where every participant succeeds.
            </p>
          </div>

          {/* Renters */}
          <div>
            <h4
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.8125rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              For Renters
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { href: "/find-a-car", label: "Enter The Network" },
                { href: "/market-principle", label: "The Market Principle" },
                { href: "/protection-plans", label: "Trust Infrastructure" },
                { href: "/support", label: "Support" },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      color: "#888888",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLAnchorElement).style.color = "#DC2626";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLAnchorElement).style.color = "#888888";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Operators */}
          <div>
            <h4
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.8125rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              For Operators
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { href: "/become-a-partner", label: "Join The Network" },
                { href: "/partner-application", label: "Join As An Operator" },
                { href: "/host-login", label: "Operator Login" },
                { href: "/support", label: "Operator Support" },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      color: "#888888",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLAnchorElement).style.color = "#DC2626";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLAnchorElement).style.color = "#888888";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4
              style={{
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.8125rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "1rem",
              }}
            >
              Company
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { href: "/why-we-exist", label: "Why We Exist" },
                { href: "/why-we-built-this", label: "Why We Built This" },
                { href: "/market-principle", label: "The Market Principle" },
                { href: "/vision", label: "Our Vision" },
                { href: "/support", label: "Contact Us" },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      color: "#888888",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLAnchorElement).style.color = "#DC2626";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLAnchorElement).style.color = "#888888";
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <p
            style={{
              color: "#555555",
              fontSize: "0.8125rem",
              margin: 0,
            }}
          >
            &copy; {currentYear} Drive Connect. All rights reserved.
          </p>
          <p
            style={{
              color: "#555555",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Fairness · Integrity · Trust · Independence · Accountability · Shared Success
          </p>
        </div>
      </div>
    </footer>
  );
}
