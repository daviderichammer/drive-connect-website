import Link from "next/link";

export const metadata = {
  title: "The Drive Philosophy | Drive Connect",
  description:
    "TRUST → DRIVE → CONNECT. The structural doctrine behind Drive Connect's market infrastructure model.",
};

export default function DrivePhilosophyPage() {
  return (
    <>
      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
          textAlign: "center",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
            Institutional Doctrine
          </p>
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 7vw, 5rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.0,
              marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            The Drive Philosophy
          </h1>
          <p
            style={{
              color: "#888888",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            Every page on this platform teaches philosophy, not merely functionality. This is the structural reasoning behind every decision Drive Connect makes.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST → DRIVE → CONNECT VISUAL SEQUENCE */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* TRUST */}
          <div
            style={{
              marginBottom: "0",
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
                padding: "3.5rem",
                marginBottom: "0",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 auto" }}>
                  <div
                    style={{
                      color: "#DC2626",
                      fontWeight: 900,
                      fontSize: "clamp(3rem, 8vw, 6rem)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    TRUST
                  </div>
                  <p
                    style={{
                      color: "#555555",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: "0.5rem",
                    }}
                  >
                    Step One
                  </p>
                </div>
                <div style={{ flex: "1 1 300px" }}>
                  <h2
                    style={{
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      letterSpacing: "-0.02em",
                      marginBottom: "1rem",
                    }}
                  >
                    Verification Creates Certainty
                  </h2>
                  <p
                    style={{
                      color: "#888888",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    Trust is not assumed in a healthy market — it is engineered. Before any transaction occurs on Drive Connect, every participant is verified. Identity is confirmed. Insurance is validated. Fraud signals are checked. History is recorded. This is not a feature. This is the foundation.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      "Government ID verification",
                      "Facial match confirmation",
                      "Insurance policy validation",
                      "Fraud detection screening",
                      "Blacklist database checks",
                      "Duplicate identity detection",
                      "Operator credential verification",
                      "Vehicle documentation review",
                      "Permanent transaction history",
                      "Security deposit authorization",
                    ].map((point) => (
                      <div
                        key={point}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#cccccc",
                          fontSize: "0.875rem",
                        }}
                      >
                        <span style={{ color: "#DC2626", fontWeight: 700 }}>→</span>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Arrow connector */}
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem 0",
                color: "#DC2626",
                fontSize: "2rem",
                fontWeight: 900,
              }}
            >
              ↓
            </div>
          </div>

          {/* DRIVE */}
          <div style={{ marginBottom: "0" }}>
            <div
              style={{
                backgroundColor: "#DC2626",
                borderRadius: "12px",
                padding: "3.5rem",
                marginBottom: "0",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 auto" }}>
                  <div
                    style={{
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: "clamp(3rem, 8vw, 6rem)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    DRIVE
                  </div>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: "0.5rem",
                    }}
                  >
                    Step Two
                  </p>
                </div>
                <div style={{ flex: "1 1 300px" }}>
                  <h2
                    style={{
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      letterSpacing: "-0.02em",
                      marginBottom: "1rem",
                    }}
                  >
                    Economic Activity Moves Freely
                  </h2>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    When trust is established, transactions happen. The Drive Connect market engine removes the friction — excessive fees, opaque pricing, platform interference — that slows economic activity. Operators set prices. Renters book directly. The auction engine creates genuine price discovery. Value flows to the participants who create it.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      "Operators set their own pricing",
                      "Auction engine for price discovery",
                      "Lower platform fees than alternatives",
                      "Direct booking relationships",
                      "No artificial geographic restrictions",
                      "Transparent fee structure",
                      "Operator retains majority of revenue",
                      "Renters pay market-clearing prices",
                      "Settlement architecture is published",
                      "No hidden charges at checkout",
                    ].map((point) => (
                      <div
                        key={point}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "0.875rem",
                        }}
                      >
                        <span style={{ color: "#ffffff", fontWeight: 700 }}>→</span>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Arrow connector */}
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem 0",
                color: "#DC2626",
                fontSize: "2rem",
                fontWeight: 900,
              }}
            >
              ↓
            </div>
          </div>

          {/* CONNECT */}
          <div>
            <div
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
                padding: "3.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ flex: "0 0 auto" }}>
                  <div
                    style={{
                      color: "#ffffff",
                      fontWeight: 900,
                      fontSize: "clamp(3rem, 8vw, 6rem)",
                      letterSpacing: "-0.04em",
                      lineHeight: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    CONNECT
                  </div>
                  <p
                    style={{
                      color: "#555555",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginTop: "0.5rem",
                    }}
                  >
                    Step Three
                  </p>
                </div>
                <div style={{ flex: "1 1 300px" }}>
                  <h2
                    style={{
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      letterSpacing: "-0.02em",
                      marginBottom: "1rem",
                    }}
                  >
                    Healthy Markets Emerge Naturally
                  </h2>
                  <p
                    style={{
                      color: "#888888",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    When professional operators, clear customer experiences, connected vehicle intelligence, and lifecycle support work together, a stronger operating market can emerge. Operators build durable businesses, customers access professionally managed vehicles, and each ecosystem relationship can support multiple channels of value. This is the Drive Connect model—and it is designed to scale beyond automotive.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {[
                      "Operators build durable vehicle businesses",
                      "Customers access professional vehicle experiences",
                      "Network participation expands supply and demand",
                      "Connected infrastructure supports every lifecycle stage",
                      "Drive KeZ extends vehicle intelligence",
                      "Drive Cloud improves operating visibility",
                      "Protection, service, and parts are coordinated",
                      "Multiple channels strengthen each relationship",
                      "Capital-efficient participation supports scale",
                      "The model can extend to adjacent markets",
                    ].map((point) => (
                      <div
                        key={point}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          color: "#cccccc",
                          fontSize: "0.875rem",
                        }}
                      >
                        <span style={{ color: "#DC2626", fontWeight: 700 }}>→</span>
                        {point}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PHILOSOPHY STATEMENTS */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "3rem",
              textTransform: "uppercase",
            }}
          >
            The Doctrine, Stated Plainly
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              "Markets work best when trust exists.",
              "Markets work best when information is transparent.",
              "Markets work best when incentives are aligned.",
              "Markets work best when no participant has leverage over another participant.",
              "The problem is rarely capitalism.",
              "The problem is inefficient markets.",
              "Inefficient markets create friction.",
              "Friction creates conflict.",
              "Conflict creates imbalance.",
              "Technology should remove inefficiency.",
              "Trust should replace conflict.",
              "Healthy markets allow everyone to succeed.",
              "Great businesses are built deliberately.",
              "Never accidentally.",
              "That is The Drive Philosophy.",
            ].map((statement, i) => (
              <p
                key={i}
                style={{
                  color: i === 14 ? "#DC2626" : i >= 10 ? "#ffffff" : "#888888",
                  fontWeight: i === 14 ? 900 : i >= 10 ? 700 : 400,
                  fontSize: i === 14 ? "1.375rem" : "1.0625rem",
                  lineHeight: 1.6,
                  letterSpacing: i === 14 ? "-0.01em" : "0",
                  textTransform: i === 14 ? "uppercase" : "none",
                  paddingLeft: i >= 5 && i <= 8 ? "2rem" : "0",
                  borderLeft: i >= 5 && i <= 8 ? "3px solid #DC2626" : "none",
                }}
              >
                {statement}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA */}
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
            See How The Market Engine Works
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            The philosophy is implemented in the mechanics. See the step-by-step flow of how Drive Connect's bidding and marketplace mechanism creates genuine price discovery.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/how-market-engine-works"
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
              HOW THE MARKET ENGINE WORKS
            </Link>
            <Link
              href="/future-markets"
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
              FUTURE MARKETS
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
