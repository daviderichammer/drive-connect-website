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
          MORE THAN A MARKETPLACE. AN ECOSYSTEM BUILT FOR PROFESSIONAL VEHICLE OPERATORS.
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
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
                marginBottom: "1rem",
              }}
            >
              The customer-facing marketplace of the Global Drive Holdings ecosystem. Built for professional operators and the full vehicle lifecycle.
            </p>
            <p
              style={{
                color: "#555555",
                fontSize: "0.75rem",
                lineHeight: 1.6,
                maxWidth: "240px",
              }}
            >
              Professional operators provide vehicles and customer service. Drive Connect connects demand with integrated technology, protection, service, and operational infrastructure.
            </p>
          </div>

          {/* For Renters */}
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
                { href: "/find-a-car", label: "Browse Vehicles" },
                { href: "/driver-verification", label: "Get Verified" },
                { href: "/protection-plan-terms", label: "Protection Plans" },
                { href: "/rental-terms", label: "Rental Terms" },
                { href: "/security-deposit-policy", label: "Security Deposits" },
                { href: "/claims-protection-policy", label: "Claims Process" },
                { href: "/support", label: "Support" },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      color: "#888888",
                      textDecoration: "none",
                      fontSize: "0.875rem",
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

          {/* For Operators */}
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
                { href: "/partner-application", label: "Apply As Operator" },
                { href: "/operator-agreement", label: "Operator Agreement" },
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

          {/* Philosophy */}
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
              Company & Ecosystem
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                { href: "/about", label: "About Drive Connect" },
                { href: "/why-we-exist", label: "Why We Exist" },
                { href: "/drive-philosophy", label: "Drive Philosophy" },
                { href: "/trust-infrastructure", label: "Trust Infrastructure" },
                { href: "/how-market-engine-works", label: "How The Market Works" },
                { href: "/future-markets", label: "Future Markets" },
                { href: "/why-we-built-this", label: "Why We Built This" },
                { href: "/market-principle", label: "The Market Principle" },
                { href: "/vision", label: "Our Vision" },
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      color: "#888888",
                      textDecoration: "none",
                      fontSize: "0.875rem",
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

          {/* Legal */}
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
              Legal
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
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
              ].map((link) => (
                <li key={link.href} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    style={{
                      color: "#888888",
                      textDecoration: "none",
                      fontSize: "0.875rem",
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

        {/* Payment administrator notice */}
        <div
          style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "8px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              color: "#555555",
              fontSize: "0.75rem",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            <strong style={{ color: "#888888" }}>Payment Administration Notice:</strong> Drive Connect acts as authorized payment administrator for participating professional operators and affiliated service providers. Participating operators provide vehicles and rental services. Protection Plans are provided by Drive Protection Inc., an independent protection plan provider. Drive Connect does not provide insurance and does not own or operate vehicles listed on the platform.
          </p>
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
            {[
              { href: "/terms-of-service", label: "Terms" },
              { href: "/privacy-policy", label: "Privacy" },
              { href: "/dispute-resolution", label: "Disputes" },
              { href: "/fraud-prevention", label: "Fraud Prevention" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "#555555",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "#DC2626";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = "#555555";
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
