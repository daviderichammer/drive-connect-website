import Link from "next/link";

export const metadata = {
  title: "The Market Principle | Drive Connect",
  description: "Drive Connect's foundational economic doctrine: aligned incentives, transparent pricing, and trust infrastructure that creates genuine market efficiency.",
};

const principles = [
  {
    number: "I",
    title: "Markets Function Best When Incentives Are Aligned",
    body: "The traditional rental model creates structural conflict. Platforms profit when operators earn less. Operators succeed when renters pay more. Renters win only when both lose. This is not a market — it is an extraction mechanism. Drive Connect was built on the premise that a well-designed market aligns the incentives of every participant toward a shared outcome.",
  },
  {
    number: "II",
    title: "Transparency Is Not a Feature — It Is a Foundation",
    body: "Hidden fees, dynamic surge pricing, and opaque policy changes are symptoms of a system that profits from information asymmetry. Drive Connect operates on transparent pricing. Operators set rates. Renters see exactly what they pay. There are no surprises at checkout. Transparency is not a marketing promise — it is the structural basis of trust.",
  },
  {
    number: "III",
    title: "Operators Deserve Sovereignty Over Their Own Business",
    body: "An operator who owns vehicles should control how those vehicles are deployed, priced, and managed. Platforms that override operator decisions — restricting geography, mandating pricing, or controlling customer relationships — are not infrastructure providers. They are landlords. Drive Connect provides infrastructure that serves operators, not infrastructure that controls them.",
  },
  {
    number: "IV",
    title: "Trust Must Be Engineered, Not Assumed",
    body: "Trust between strangers does not emerge naturally in a marketplace. It must be built through verified identity, transparent history, structured accountability, and clear consequences. Drive Connect's trust infrastructure — verification systems, deposit mechanisms, review architecture, and dispute resolution — exists to make trust a reliable property of every transaction.",
  },
  {
    number: "V",
    title: "The Auction Engine Creates Price Discovery, Not Price Extraction",
    body: "Price discovery is the mechanism by which a market finds the fair value of a transaction. Drive Connect's auction engine allows renters to bid and operators to accept, creating genuine market-clearing prices. This is not a race to the bottom. It is the mechanism by which supply and demand find equilibrium without a platform extracting margin from the middle.",
  },
  {
    number: "VI",
    title: "Independence Scales. Dependency Does Not.",
    body: "Operators who depend entirely on a single platform are not building businesses — they are building exposure. Drive Connect is designed to help operators build independent businesses: their own customer relationships, their own reputation, their own pricing power. The network provides reach. The operator retains ownership.",
  },
];

const marketComparisons = [
  {
    category: "Price Formation",
    traditional: "Platform sets or heavily influences pricing through algorithms",
    driveConnect: "Operators set prices; auction engine enables genuine market discovery",
  },
  {
    category: "Revenue Distribution",
    traditional: "Platform extracts 25–35% before operator receives earnings",
    driveConnect: "Lower, transparent fees; operators retain the majority of revenue",
  },
  {
    category: "Customer Ownership",
    traditional: "Platform owns the customer relationship; operator is anonymous",
    driveConnect: "Operator builds direct relationships; customers know who they rent from",
  },
  {
    category: "Geographic Freedom",
    traditional: "Platform restricts where and how operators can serve customers",
    driveConnect: "Operators deploy their fleet where their market demands",
  },
  {
    category: "Policy Stability",
    traditional: "Rules change unilaterally; operators adapt or exit",
    driveConnect: "Stable, published policies; operators plan with confidence",
  },
  {
    category: "Trust Architecture",
    traditional: "Platform mediates all disputes; outcome favors platform interest",
    driveConnect: "Structured trust infrastructure with transparent dispute resolution",
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
            &ldquo;A market that extracts value from its participants is not a
            market. It is a toll road. Drive Connect removes the toll.&rdquo;
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
              The Structural Difference
            </h2>
            <p style={{ color: "#888888", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              Not a feature comparison. A comparison of market architectures.
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
                Market Property
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#DC2626", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
                Drive Connect
              </span>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#555555", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
                Traditional Platforms
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
            This Is Not A Better Product.
            <br />
            <span style={{ color: "#DC2626" }}>It Is A Better System.</span>
          </h2>
          <p
            style={{
              color: "#444444",
              fontSize: "1.0625rem",
              lineHeight: 1.9,
              marginBottom: "1.5rem",
            }}
          >
            Drive Connect was built from the conviction that the car rental
            industry&apos;s problems are not operational — they are structural.
            The platforms were designed to extract, not to enable. The fees
            were set to maximize platform revenue, not participant success. The
            rules were written to protect platform interests, not operator
            independence.
          </p>
          <p
            style={{
              color: "#444444",
              fontSize: "1.0625rem",
              lineHeight: 1.9,
              marginBottom: "3rem",
            }}
          >
            Fixing these problems required rebuilding the system from its
            economic foundation. That is what Drive Connect is. Not a rental
            company. Not a marketplace. An economic infrastructure built on the
            principle that markets work best when everyone in them can succeed.
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
              ENTER THE NETWORK
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
