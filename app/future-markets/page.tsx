import Link from "next/link";

export const metadata = {
  title: "Future Markets | Drive Connect",
  description:
    "The connected operating model established in automotive is designed to extend into additional professional asset and mobility markets.",
};

const futureMarkets = [
  {
    market: "Marine",
    description: "Boat and watercraft rentals can benefit from connected customer demand, asset intelligence, protection, service coordination, and professional operator support.",
    status: "Roadmap",
    icon: "⛵",
  },
  {
    market: "RV & Motorhome",
    description: "Recreational vehicle rentals. High-value assets, complex insurance requirements, and significant trust challenges. Exactly the market conditions where Drive Connect's infrastructure creates the most value.",
    status: "Roadmap",
    icon: "🚐",
  },
  {
    market: "Equipment",
    description: "Construction, agricultural, and industrial equipment. Operators own expensive assets that sit idle. Renters need access without ownership. The trust infrastructure model creates a functioning market.",
    status: "Future",
    icon: "🏗️",
  },
  {
    market: "Luxury & Specialty",
    description: "High-value vehicles, exotic cars, and specialty assets. The trust requirements are higher. The verification standards are more demanding. Drive Connect's infrastructure is designed to scale to these requirements.",
    status: "Active",
    icon: "🏎️",
  },
  {
    market: "Commercial Fleet",
    description: "Business vehicle rentals for commercial operators. Fleet management, multi-vehicle bookings, and enterprise-level trust infrastructure. The Drive Connect model extends naturally to commercial markets.",
    status: "Roadmap",
    icon: "🚚",
  },
  {
    market: "Adjacent Services",
    description: "Connected professional services can extend the ecosystem around operators, assets, and customers. The infrastructure adapts while the operating model remains coordinated.",
    status: "Future",
    icon: "🔧",
  },
];

export default function FutureMarketsPage() {
  return (
    <>
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
          borderBottom: "4px solid #DC2626",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <p
            style={{
              color: "#DC2626",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Ecosystem Vision
          </p>
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.0,
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            Automotive Is The Proof Of Concept.
          </h1>
          <h2
            style={{
              color: "#DC2626",
              fontWeight: 900,
              fontSize: "clamp(1.25rem, 3.5vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "2.5rem",
              textTransform: "uppercase",
            }}
          >
            The Model Is Designed To Scale.
          </h2>
          <p
            style={{
              color: "#888888",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "760px",
            }}
          >
            The connected operating model established in automotive can extend to additional professional asset markets. The starting point is vehicles; the long-term opportunity is coordinated customer demand, intelligence, protection, service, parts, and analytics across multiple asset categories.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* THE DOCTRINE APPLIES EVERYWHERE */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#0a0a0a",
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            The Connected Model Can Extend
          </h2>
          <div
            style={{
              borderLeft: "4px solid #DC2626",
              paddingLeft: "2rem",
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                color: "#cccccc",
                fontSize: "1.125rem",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              Professional asset markets share recurring operating needs: customer acquisition, asset intelligence, protection, service coordination, parts access, performance data, and reliable transaction infrastructure. The Global Drive Holdings model is designed to coordinate those needs around operators and their assets.
            </p>
            <p
              style={{
                color: "#888888",
                fontSize: "1rem",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              Drive Connect serves as the customer-facing demand layer. Connected technology, protection, service, parts, analytics, and operating support provide the broader framework. Automotive is the first implementation of an infrastructure model intended to adapt to other professionally operated asset markets.
            </p>
            <p
              style={{
                color: "#888888",
                fontSize: "1rem",
                lineHeight: 1.9,
              }}
            >
              The asset class, verification requirements, protection structures, and operating mechanics will change by market. The core approach remains consistent: connect customer demand with professional operators and coordinated lifecycle infrastructure.
            </p>
          </div>

          {/* The three conditions */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            {[
              {
                title: "Condition 1",
                subtitle: "Independent providers own assets",
                desc: "The market has independent operators who own the assets being transacted — vehicles, equipment, property, services.",
              },
              {
                title: "Condition 2",
                subtitle: "Consumers need access without ownership",
                desc: "The market has consumers who need access to those assets without owning them — renters, users, short-term customers.",
              },
              {
                title: "Condition 3",
                subtitle: "Trust is the missing layer",
                desc: "The market currently lacks the trust infrastructure that would allow these parties to transact with confidence and efficiency.",
              },
            ].map((cond) => (
              <div
                key={cond.title}
                style={{
                  backgroundColor: "#000000",
                  border: "1px solid #1a1a1a",
                  borderRadius: "8px",
                  padding: "2rem",
                  borderTop: "3px solid #DC2626",
                }}
              >
                <p
                  style={{
                    color: "#DC2626",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  {cond.title}
                </p>
                <h3
                  style={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {cond.subtitle}
                </h3>
                <p style={{ color: "#888888", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  {cond.desc}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              backgroundColor: "#DC2626",
              borderRadius: "8px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "1.125rem",
                letterSpacing: "-0.01em",
              }}
            >
              If all three conditions are present, the Drive Connect model applies.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FUTURE MARKETS */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              Markets On The Horizon
            </h2>
            <p
              style={{
                color: "#888888",
                fontSize: "1rem",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.8,
              }}
            >
              These are the markets where Drive Connect's trust infrastructure model will be applied next. The doctrine is the same. The implementation adapts.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {futureMarkets.map((market) => (
              <div
                key={market.market}
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #1a1a1a",
                  borderRadius: "10px",
                  padding: "2rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "2rem" }}>{market.icon}</div>
                  <span
                    style={{
                      backgroundColor:
                        market.status === "Active"
                          ? "#DC2626"
                          : market.status === "Roadmap"
                          ? "#1a1a1a"
                          : "#0a0a0a",
                      color:
                        market.status === "Active"
                          ? "#ffffff"
                          : market.status === "Roadmap"
                          ? "#888888"
                          : "#555555",
                      border:
                        market.status === "Roadmap"
                          ? "1px solid #333333"
                          : market.status === "Future"
                          ? "1px solid #1a1a1a"
                          : "none",
                      fontSize: "0.6875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                    }}
                  >
                    {market.status}
                  </span>
                </div>
                <h3
                  style={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  {market.market}
                </h3>
                <p style={{ color: "#888888", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  {market.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* THE LONG GAME */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#0a0a0a",
          padding: "5rem 1.5rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            The Long Game
          </h2>
          <p
            style={{
              color: "#888888",
              fontSize: "1.0625rem",
              lineHeight: 1.9,
              marginBottom: "1.5rem",
              maxWidth: "720px",
              margin: "0 auto 1.5rem",
            }}
          >
            Drive Connect is building the customer-facing marketplace layer of a broader operating ecosystem. The model begins with professional vehicle operators and is designed to extend where connected demand and lifecycle infrastructure can create durable value.
          </p>
          <p
            style={{
              color: "#DC2626",
              fontSize: "1.25rem",
              fontWeight: 800,
              lineHeight: 1.6,
              maxWidth: "720px",
              margin: "0 auto 3rem",
              letterSpacing: "-0.01em",
            }}
          >
            The automotive market is where we prove the model. Every market after that is where we scale it.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/drive-philosophy"
              style={{
                backgroundColor: "#DC2626",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
              }}
            >
              THE DRIVE PHILOSOPHY
            </Link>
            <Link
              href="/why-we-exist"
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
                border: "2px solid #333333",
              }}
            >
              WHY WE EXIST
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
