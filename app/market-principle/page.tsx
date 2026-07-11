import Link from "next/link";

export const metadata = {
  title: "The Market Principle | Drive Connect",
  description: "Drive Connect's foundational economic doctrine: aligned incentives, transparent pricing, and trust infrastructure that creates genuine market efficiency.",
};

const principles = [
  {
    number: "I",
    title: "Professional Operators Are the Foundation",
    body: "Drive Connect is designed around professional hosts, independent rental companies, franchise operators, and fleet owners. Operators provide the vehicles and customer experience; the marketplace connects them with demand.",
  },
  {
    number: "II",
    title: "Clear Information Creates Stronger Transactions",
    body: "Vehicle details, pricing, availability, operator responsibilities, and customer expectations should be understandable throughout the reservation process. Clarity supports confidence for every participant.",
  },
  {
    number: "III",
    title: "The Vehicle Lifecycle Extends Beyond the Booking",
    body: "Professional vehicle businesses also require intelligence, protection, service coordination, parts access, analytics, and operating visibility. Drive Connect connects the reservation to this broader lifecycle infrastructure.",
  },
  {
    number: "IV",
    title: "Trust Must Be Supported by Systems",
    body: "Verification, connected vehicle signals, protection resources, clear responsibilities, and structured support help create a more dependable environment for operators and customers.",
  },
  {
    number: "V",
    title: "Connected Data Improves Decisions",
    body: "Drive KeZ and Drive Cloud are intended to connect location, diagnostics, recovery, condition, access, and performance data with the workflows professional operators manage every day.",
  },
  {
    number: "VI",
    title: "Participation Creates Capital-Efficient Scale",
    body: "Drive Connect can expand through professional operator inventory, technology, strategic relationships, and ecosystem services without requiring centralized ownership of a national fleet.",
  },
];

const marketComparisons = [
  {
    category: "Customer Demand",
    traditional: "Professional operator inventory and renter discovery",
    driveConnect: "Marketplace access and reservation infrastructure",
  },
  {
    category: "Vehicle Intelligence",
    traditional: "Location, diagnostics, recovery, condition, and access signals",
    driveConnect: "Drive KeZ connected-vehicle integration",
  },
  {
    category: "Operating Visibility",
    traditional: "Vehicle and fleet performance information",
    driveConnect: "Drive Cloud data and analytics layer",
  },
  {
    category: "Protection Support",
    traditional: "Connected resources across the transaction lifecycle",
    driveConnect: "Drive Protection ecosystem access",
  },
  {
    category: "Service and Parts",
    traditional: "Lifecycle maintenance, repair, and sourcing support",
    driveConnect: "Drive Service Network and Drive Parts Network",
  },
  {
    category: "Revenue Density",
    traditional: "Bookings, technology, protection, service, parts, and subscriptions",
    driveConnect: "Multiple channels across one operator relationship",
  },
];

export default function MarketPrinciplePage() {
  return (
    <>
      {/* HERO */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.375rem 1.25rem",
              borderRadius: "4px",
              marginBottom: "2rem",
            }}
          >
            Economic Doctrine
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              marginBottom: "2rem",
            }}
          >
            The Market{" "}
            <span style={{ color: "#DC2626" }}>Principle.</span>
          </h1>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "680px",
              margin: "0 auto 1.5rem",
            }}
          >
            Drive Connect was not built to be a better car rental marketplace.
            It was built to demonstrate that markets function better when
            incentives are aligned, pricing is transparent, and participants
            retain their independence.
          </p>
          <p
            style={{
              color: "#DC2626",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            This is the foundational doctrine.
          </p>
        </div>
      </section>

      {/* DOCTRINE STATEMENT */}
      <section
        style={{
          backgroundColor: "#DC2626",
          padding: "3rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              color: "#ffffff",
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              fontWeight: 700,
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            &ldquo;Professional operators create the supply. Connected infrastructure helps turn that supply into durable customer and lifecycle value.&rdquo;
          </p>
        </div>
      </section>

      {/* SIX PRINCIPLES */}
      <section style={{ backgroundColor: "#ffffff", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "#000000",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
              }}
            >
              Six Principles of Market Design
            </h2>
            <p style={{ color: "#666666", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              These are not aspirations. They are structural properties of how
              Drive Connect was built.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {principles.map((principle, i) => (
              <div
                key={principle.number}
                style={{
                  display: "grid",
                  gridTemplateColumns: "5rem 1fr",
                  gap: "2rem",
                  padding: "3rem 0",
                  borderBottom: i < principles.length - 1 ? "1px solid #e5e7eb" : "none",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 900,
                    color: "#DC2626",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    fontFamily: "Georgia, serif",
                    paddingTop: "0.25rem",
                  }}
                >
                  {principle.number}
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#000000",
                      letterSpacing: "-0.02em",
                      marginBottom: "1rem",
                      lineHeight: 1.3,
                    }}
                  >
                    {principle.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: "#444444",
                      lineHeight: 1.8,
                      margin: 0,
                    }}
                  >
                    {principle.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET COMPARISON */}
      <section style={{ backgroundColor: "#000000", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
              }}
            >
              The Connected Operating Model
            </h2>
            <p style={{ color: "#888888", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              The marketplace and ecosystem layers supporting each professional operator relationship.
            </p>
          </div>

          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #1a1a1a" }}>
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                backgroundColor: "#111111",
                padding: "1.25rem 1.5rem",
                gap: "1rem",
              }}
            >
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#555555", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Operator Need
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#DC2626", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
                Drive Connect
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#555555", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
                Connected Support
              </span>
            </div>
            {marketComparisons.map((row, i) => (
              <div
                key={row.category}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "1.25rem 1.5rem",
                  gap: "1rem",
                  backgroundColor: i % 2 === 0 ? "#0a0a0a" : "#000000",
                  borderTop: "1px solid #1a1a1a",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#888888", fontWeight: 600 }}>
                  {row.category}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#ffffff", lineHeight: 1.6 }}>
                  <span style={{ color: "#DC2626", marginRight: "0.375rem", fontWeight: 700 }}>✓</span>
                  {row.driveConnect}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#555555", lineHeight: 1.6 }}>
                  {row.traditional}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CONCLUSION */}
      <section style={{ backgroundColor: "#F5F5F5", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "#000000",
              letterSpacing: "-0.03em",
              marginBottom: "2rem",
              lineHeight: 1.1,
            }}
          >
            More Than A Marketplace.
            <br />
            <span style={{ color: "#DC2626" }}>A Connected Operating Ecosystem.</span>
          </h2>
          <p
            style={{
              color: "#444444",
              fontSize: "1.0625rem",
              lineHeight: 1.9,
              marginBottom: "1.5rem",
            }}
          >
            Drive Connect was built around the operating reality that a professional vehicle business needs more than reservations. It needs customer demand connected with technology, protection, service, parts, analytics, and lifecycle support.
          </p>
          <p
            style={{
              color: "#444444",
              fontSize: "1.0625rem",
              lineHeight: 1.9,
              marginBottom: "3rem",
            }}
          >
            As the customer-facing marketplace of Global Drive Holdings, Drive Connect brings those capabilities into one coordinated operator ecosystem designed to support durable vehicle businesses and professional customer experiences.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/find-a-car"
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
              }}
            >
              FIND A VEHICLE
            </Link>
            <Link
              href="/why-we-built-this"
              style={{
                backgroundColor: "transparent",
                color: "#000000",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1.125rem 2.5rem",
                borderRadius: "6px",
                border: "2px solid #000000",
              }}
            >
              WHY WE BUILT THIS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
