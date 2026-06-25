import Link from "next/link";

const principles = [
  { word: "Fairness", description: "Every decision we make is measured against a simple question: is this fair to everyone involved?" },
  { word: "Integrity", description: "We say what we mean. We do what we say. No hidden fees. No surprise policies. No exceptions." },
  { word: "Trust", description: "Trust is not given. It is built through consistent, transparent, principled action — every single day." },
  { word: "Independence", description: "Operators deserve to own and control their businesses. Renters deserve to choose freely. No one should be dependent on a platform." },
  { word: "Accountability", description: "We hold ourselves accountable to our operators, our renters, and our principles. No excuses." },
  { word: "Shared Success", description: "When operators succeed, renters benefit. When renters have a great experience, operators grow. Everyone wins together." },
];

const philosophyStatements = [
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
];

export default function WhyWeExistPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}
          >
            Why Drive Connect{" "}
            <span style={{ color: "#DC2626" }}>Exists</span>
          </h1>
          <p
            style={{
              color: "#888888",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            This is not marketing. This is company doctrine.
          </p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            The car rental industry created unnecessary conflict.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              "Renters pay too much.",
              "Operators make too little.",
              "Platforms put themselves in the middle.",
              "Platforms create restrictions.",
              "Platforms create dependency.",
              "Platforms control too much.",
              "One side wins.",
              "One side loses.",
              "That is unhealthy.",
              "That is inefficient.",
            ].map((line, i) => (
              <p
                key={i}
                style={{
                  fontSize: i < 6 ? "1.125rem" : "1.25rem",
                  fontWeight: i >= 8 ? 800 : 500,
                  color: i >= 8 ? "#DC2626" : "#333333",
                  lineHeight: 1.4,
                  margin: 0,
                  paddingLeft: i >= 6 ? "0" : "1.5rem",
                  borderLeft: i < 6 ? "3px solid #e5e7eb" : "none",
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* THE SOLUTION */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            We believed there was a better way.{" "}
            <span style={{ color: "#DC2626" }}>So we built one.</span>
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.5rem" }}>
            {[
              "That is why Drive Connect exists.",
              "We do not choose sides.",
              "We care about renters.",
              "We care about operators.",
              "Both matter equally.",
              "Renters deserve lower prices.",
              "Operators deserve higher profits.",
              "Platforms should create trust.",
              "Not conflict.",
              "No one should win at someone else's expense.",
              "Business works best when everyone succeeds together.",
            ].map((line, i) => (
              <p
                key={i}
                style={{
                  fontSize: i >= 9 ? "1.375rem" : "1.0625rem",
                  fontWeight: i >= 9 ? 800 : 500,
                  color: i >= 9 ? "#DC2626" : "#cccccc",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {line}
              </p>
            ))}
          </div>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.01em",
              borderTop: "1px solid #1a1a1a",
              paddingTop: "2rem",
            }}
          >
            That is why Drive Connect exists.{" "}
            <span style={{ color: "#DC2626" }}>That is The Drive Philosophy.</span>{" "}
            That is Drive Connect.
          </p>
        </div>
      </section>

      {/* THE DRIVE PHILOSOPHY */}
      <section id="philosophy" style={{ padding: "5rem 1.5rem", backgroundColor: "#F5F5F5" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              The Drive Philosophy
            </h2>
            <p style={{ color: "#666666", fontSize: "1.0625rem" }}>
              The institutional identity of Drive Connect. Permanent company DNA.
            </p>
          </div>

          <div
            style={{
              backgroundColor: "#000000",
              borderRadius: "12px",
              padding: "3rem",
              marginBottom: "3rem",
            }}
          >
            {philosophyStatements.map((statement, i) => (
              <p
                key={i}
                style={{
                  fontSize: i >= 13 ? "1.25rem" : "1.0625rem",
                  fontWeight: i >= 13 ? 800 : 400,
                  color: i >= 13 ? "#DC2626" : i % 3 === 0 ? "#ffffff" : "#aaaaaa",
                  lineHeight: 1.6,
                  marginBottom: i < philosophyStatements.length - 1 ? "0.75rem" : "0",
                }}
              >
                {statement}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Drive Connect Is Principled
            </h2>
            <p
              style={{
                color: "#DC2626",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Fairness · Integrity · Trust · Independence · Accountability · Shared Success
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {principles.map((principle) => (
              <div
                key={principle.word}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  padding: "2rem",
                  border: "1px solid #e5e7eb",
                  borderTop: "3px solid #DC2626",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.375rem",
                    fontWeight: 900,
                    color: "#000000",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.75rem",
                  }}
                >
                  {principle.word}
                </h3>
                <p style={{ fontSize: "0.9375rem", color: "#555555", lineHeight: 1.7 }}>
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL STATEMENT */}
      <section
        style={{
          padding: "5rem 1.5rem",
          backgroundColor: "#DC2626",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            &ldquo;Business works best when everyone succeeds together.&rdquo;
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/find-a-car"
              style={{
                backgroundColor: "#ffffff",
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
              }}
            >
              Find A Car
            </Link>
            <Link
              href="/become-a-partner"
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
              Become A Partner
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
