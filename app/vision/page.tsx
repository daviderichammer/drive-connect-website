import Link from "next/link";

export const metadata = {
  title: "Our Vision | Drive Connect",
  description: "Drive Connect's vision for the future of transportation markets: a global trust infrastructure that enables independent operators to build real businesses.",
};

const phases = [
  {
    phase: "Phase I",
    title: "Prove The Model",
    status: "Active",
    statusColor: "#DC2626",
    description:
      "Establish Drive Connect as a functioning trust infrastructure in initial markets. Demonstrate that aligned incentives produce better outcomes for operators, renters, and the network. Build the verification systems, auction engine, and operator tools that make the model work.",
    milestones: [
      "Trust infrastructure deployed",
      "Operator verification system active",
      "Auction engine in production",
      "Direct booking relationships established",
    ],
  },
  {
    phase: "Phase II",
    title: "Scale The Network",
    status: "In Development",
    statusColor: "#888888",
    description:
      "Expand the Drive Network to major metropolitan markets across North America. Each new market adds operators, renters, and network density. As the network grows, the value of participation increases for every participant — a genuine network effect built on trust rather than lock-in.",
    milestones: [
      "Multi-city operator network",
      "Cross-market vehicle availability",
      "Operator performance analytics",
      "Network density thresholds",
    ],
  },
  {
    phase: "Phase III",
    title: "Establish The Standard",
    status: "Planned",
    statusColor: "#555555",
    description:
      "Drive Connect becomes the reference architecture for how peer-to-peer vehicle markets should function. The principles of aligned incentives, transparent pricing, and operator independence become the baseline expectation — not the exception. Other markets begin adopting the model.",
    milestones: [
      "Industry standard trust protocols",
      "Open operator certification program",
      "Cross-platform interoperability",
      "Economic doctrine published",
    ],
  },
  {
    phase: "Phase IV",
    title: "Expand The Doctrine",
    status: "Vision",
    statusColor: "#333333",
    description:
      "The economic fairness doctrine that Drive Connect applied to car rental extends to adjacent markets. Equipment rental. Commercial vehicles. Specialty assets. Any market where a platform currently extracts value from participants who deserve independence becomes a candidate for the Drive Connect model.",
    milestones: [
      "Adjacent market expansion",
      "Commercial fleet integration",
      "Institutional operator programs",
      "Market doctrine licensing",
    ],
  },
];

const beliefs = [
  {
    statement: "Independent operators should build real businesses, not gig dependencies.",
  },
  {
    statement: "Renters deserve transparent pricing and direct relationships with operators.",
  },
  {
    statement: "Trust infrastructure should serve the market, not extract from it.",
  },
  {
    statement: "Aligned incentives produce better outcomes than structural conflict.",
  },
  {
    statement: "The best platform is the one that makes itself invisible.",
  },
  {
    statement: "Markets that work for everyone grow faster than markets that work for one.",
  },
];

export default function VisionPage() {
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
            Long-Term Vision
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
            Where This{" "}
            <span style={{ color: "#DC2626" }}>Is Going.</span>
          </h1>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            Drive Connect is not building a rental company. It is building the
            infrastructure for how vehicle markets should function — and
            eventually, how all asset-sharing markets should function.
          </p>
        </div>
      </section>

      {/* THE SCALE STATEMENT */}
      <section
        style={{
          backgroundColor: "#DC2626",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            textAlign: "center",
          }}
        >
          {[
            { number: "10,000+", label: "Operators. Eventually." },
            { number: "50+", label: "Markets. Globally." },
            { number: "1", label: "Economic Doctrine." },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {stat.number}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
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
              The Roadmap
            </h2>
            <p style={{ color: "#666666", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              Four phases. One doctrine. A market rebuilt from first principles.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {phases.map((phase) => (
              <div
                key={phase.phase}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  border: "1px solid #e5e7eb",
                  borderLeft: `4px solid ${phase.statusColor}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#888888",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {phase.phase}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: phase.statusColor,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      backgroundColor: `${phase.statusColor}15`,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                    }}
                  >
                    {phase.status}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 800,
                    color: "#000000",
                    letterSpacing: "-0.02em",
                    marginBottom: "1rem",
                  }}
                >
                  {phase.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "#555555",
                    lineHeight: 1.8,
                    marginBottom: "1.5rem",
                  }}
                >
                  {phase.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {phase.milestones.map((milestone) => (
                    <span
                      key={milestone}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#333333",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        padding: "0.375rem 0.875rem",
                        borderRadius: "4px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {milestone}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BELIEFS */}
      <section style={{ backgroundColor: "#000000", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
              }}
            >
              What We Believe
            </h2>
            <p style={{ color: "#888888", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              These beliefs are not marketing. They are the structural
              assumptions that every product decision is built on.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {beliefs.map((belief, i) => (
              <div
                key={i}
                style={{
                  padding: "1.75rem 0",
                  borderBottom: i < beliefs.length - 1 ? "1px solid #1a1a1a" : "none",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.5rem",
                }}
              >
                <span
                  style={{
                    color: "#DC2626",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    flexShrink: 0,
                    paddingTop: "0.125rem",
                  }}
                >
                  →
                </span>
                <p
                  style={{
                    color: "#cccccc",
                    fontSize: "1.0625rem",
                    lineHeight: 1.7,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {belief.statement}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
            }}
          >
            This Vision Requires Participants.
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            The network grows when operators join. The doctrine proves itself
            when renters experience it. Every participant makes the system
            stronger.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/become-a-partner"
              style={{
                backgroundColor: "#ffffff",
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1.125rem 2.5rem",
                borderRadius: "6px",
              }}
            >
              JOIN AS AN OPERATOR
            </Link>
            <Link
              href="/find-a-car"
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
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              ENTER THE NETWORK
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
