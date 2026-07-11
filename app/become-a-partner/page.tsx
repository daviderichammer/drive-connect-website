import Link from "next/link";

export const metadata = {
  title: "Join Drive Connect — Built for Professional Vehicle Operators",
  description:
    "Connect your professional vehicle business with customer demand and the integrated technology, protection, service, parts, and operating infrastructure of the Global Drive Holdings ecosystem.",
};

const benefits = [
  {
    title: "Professional Customer Demand",
    description: "List operator-provided vehicles in a marketplace designed around professional hosts, rental companies, and fleet businesses.",
    icon: "01",
  },
  {
    title: "Connected Vehicle Intelligence",
    description: "Extend operational visibility through Drive KeZ capabilities including location, diagnostics, recovery, condition, and access workflows.",
    icon: "02",
  },
  {
    title: "Integrated Protection Support",
    description: "Connect transactions and vehicle operations with the protection resources available through the broader ecosystem.",
    icon: "03",
  },
  {
    title: "Service Coordination",
    description: "Support vehicle uptime through the Drive Service Network and an operating model built around the full vehicle lifecycle.",
    icon: "04",
  },
  {
    title: "Parts Access",
    description: "Participate in an ecosystem designed to coordinate parts sourcing and supply support as the network expands.",
    icon: "05",
  },
  {
    title: "Operating Visibility",
    description: "Use connected data and performance analytics to make more informed decisions across vehicles and fleet operations.",
    icon: "06",
  },
  {
    title: "Multiple Revenue Channels",
    description: "Create value across bookings, technology, protection, service, parts, and subscription relationships.",
    icon: "07",
  },
];

const comparisonData = [
  { feature: "Customer Demand", driveConnect: "Professional marketplace access", ecosystemSupport: "Booking and customer acquisition channel" },
  { feature: "Vehicle Intelligence", driveConnect: "Drive KeZ integration", ecosystemSupport: "GPS, diagnostics, recovery, and condition signals" },
  { feature: "Protection", driveConnect: "Ecosystem protection access", ecosystemSupport: "Connected support throughout the transaction" },
  { feature: "Service Coordination", driveConnect: "Drive Service Network", ecosystemSupport: "Lifecycle maintenance and service support" },
  { feature: "Parts Access", driveConnect: "Drive Parts Network", ecosystemSupport: "Connected parts sourcing infrastructure" },
  { feature: "Operating Visibility", driveConnect: "Drive Cloud", ecosystemSupport: "Vehicle data and performance analytics" },
  { feature: "Revenue Density", driveConnect: "Multiple ecosystem channels", ecosystemSupport: "Booking, technology, protection, service, parts, and subscriptions" },
];

export default function BecomeAPartnerPage() {
  return (
    <>
      {/* ============================================================ */}
      {/* OPERATOR SOVEREIGNTY DECLARATION */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "5rem 1.5rem",
          borderBottom: "4px solid #DC2626",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              marginBottom: "1rem",
              textTransform: "uppercase",
            }}
          >
            BUILT FOR PROFESSIONAL VEHICLE OPERATORS.
          </h1>
          <h2
            style={{
              color: "#DC2626",
              fontWeight: 900,
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "2.5rem",
              textTransform: "uppercase",
            }}
          >
            CONNECTED TO MORE THAN CUSTOMER DEMAND.
          </h2>
          <p
            style={{
              color: "#cccccc",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "760px",
              marginBottom: "2rem",
            }}
          >
            Drive Connect gives professional hosts, independent rental companies, franchise operators, and fleet owners a customer-facing marketplace connected to the broader Global Drive Holdings ecosystem.
          </p>
          <p
            style={{
              color: "#888888",
              fontSize: "1rem",
              lineHeight: 1.8,
              maxWidth: "760px",
              marginBottom: "3rem",
            }}
          >
            Reach customers through Drive Connect while connecting your vehicles to intelligence, protection, service, parts, analytics, and operational support designed around the full vehicle lifecycle.
          </p>

          {/* Three primary CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link
              href="/partner-application"
              style={{
                backgroundColor: "#DC2626",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1.125rem 2.5rem",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              JOIN THE NETWORK
            </Link>
            <Link
              href="/partner-application"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1.125rem 2.5rem",
                borderRadius: "6px",
                border: "2px solid #555555",
                display: "inline-block",
              }}
            >
              ACCESS THE ECOSYSTEM
            </Link>
            <Link
              href="/partner-application"
              style={{
                backgroundColor: "transparent",
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1.125rem 2.5rem",
                borderRadius: "6px",
                border: "2px solid #DC2626",
                display: "inline-block",
              }}
            >
              GROW YOUR VEHICLE BUSINESS
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#000000",
          padding: "5rem 1.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.375rem 1rem",
              borderRadius: "4px",
              marginBottom: "1.5rem",
            }}
          >
            Drive Network Partners
          </div>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2rem, 5.5vw, 3.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            Independent Operators.{" "}
            <span style={{ color: "#DC2626" }}>Real Businesses.</span>
          </h2>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Drive Connect provides the infrastructure. You build the business. Operator autonomy is not a feature — it is the founding principle of this platform.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BENEFITS */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#ffffff", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "#000000",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              What Operator Independence Means
            </h2>
            <p style={{ color: "#666666", fontSize: "1.0625rem", maxWidth: "600px", margin: "0 auto" }}>
              These are not marketing promises. These are structural properties of the Drive Connect platform.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  padding: "2rem",
                  border: "1px solid #e5e7eb",
                  borderTop: "3px solid #DC2626",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{benefit.icon}</div>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 800,
                    color: "#000000",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {benefit.title}
                </h3>
                <p style={{ fontSize: "0.9375rem", color: "#555555", lineHeight: 1.7 }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* COMPARISON TABLE */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#000000", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Marketplace Access Connected to Lifecycle Support
            </h2>
            <p style={{ color: "#888888", fontSize: "1rem" }}>
              Drive Connect brings customer demand and the broader operating ecosystem into one professional-operator relationship.
            </p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      color: "#888888",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #1a1a1a",
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      color: "#DC2626",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #1a1a1a",
                    }}
                  >
                    Drive Connect
                  </th>
                  <th
                    style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      color: "#555555",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      borderBottom: "1px solid #1a1a1a",
                    }}
                  >
                    Ecosystem Support
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr
                    key={row.feature}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#0a0a0a" : "#000000",
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "#aaaaaa",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        borderBottom: "1px solid #111111",
                      }}
                    >
                      {row.feature}
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "#ffffff",
                        fontSize: "0.9375rem",
                        borderBottom: "1px solid #111111",
                      }}
                    >
                      ✓ {row.driveConnect}
                    </td>
                    <td
                      style={{
                        padding: "1rem 1.5rem",
                        color: "#555555",
                        fontSize: "0.9375rem",
                        borderBottom: "1px solid #111111",
                      }}
                    >
                      {row.ecosystemSupport}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW TO JOIN */}
      {/* ============================================================ */}
      <section style={{ backgroundColor: "#f5f5f5", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "#000000",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              How Operators Join The Network
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              { step: "01", title: "Submit Application", desc: "Tell us about your fleet, your experience, and your operations. We review all applications personally." },
              { step: "02", title: "Verification", desc: "We verify your business, your vehicles, your insurance, and your credentials. Approval typically takes 2–3 business days." },
              { step: "03", title: "List Your Fleet", desc: "Add your vehicles to the marketplace. Set your pricing, availability, delivery options, and vehicle rules. Full control from day one." },
              { step: "04", title: "Operate Independently", desc: "Receive booking requests from verified renters. Manage your business through the operator dashboard. Build your reputation and your revenue." },
            ].map((step) => (
              <div
                key={step.step}
                style={{
                  backgroundColor: "#000000",
                  borderRadius: "10px",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    color: "#DC2626",
                    fontWeight: 900,
                    fontSize: "2rem",
                    letterSpacing: "-0.03em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: "#888888", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FINAL CTA */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#DC2626",
          padding: "5rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            Build Your Business Directly
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            Reach customers through Drive Connect while connecting your vehicles to intelligence, protection, service, parts, analytics, and operational support designed around the full vehicle lifecycle.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/partner-application"
              style={{
                backgroundColor: "#ffffff",
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
              }}
            >
              JOIN THE NETWORK
            </Link>
            <Link
              href="/operator-agreement"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              REVIEW OPERATOR AGREEMENT
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
