import Link from "next/link";

const benefits = [
  {
    title: "Higher Revenue",
    description: "Private bookings create stronger margins. Keep more of what you earn.",
    icon: "📈",
  },
  {
    title: "Private Bookings",
    description: "Direct relationships with verified renters. No unnecessary platform interference.",
    icon: "🤝",
  },
  {
    title: "Lower Platform Fees",
    description: "We charge less because we believe operators deserve to keep more of their revenue.",
    icon: "💰",
  },
  {
    title: "Independent Business Ownership",
    description: "You own the cars. You should control the business. That is how it should work.",
    icon: "🏢",
  },
  {
    title: "No Airport Restrictions",
    description: "Operate where your business demands. No artificial geographic limitations.",
    icon: "✈️",
  },
  {
    title: "No Endless Platform Rules",
    description: "Operate your business your way. We provide infrastructure, not restrictions.",
    icon: "🚫",
  },
  {
    title: "Flexible Operations",
    description: "Set your own pricing, availability, and delivery options. Total operational control.",
    icon: "⚙️",
  },
  {
    title: "Direct Customer Relationships",
    description: "Build your brand, your reputation, and your loyal customer base.",
    icon: "⭐",
  },
  {
    title: "Long-Term Enterprise Value",
    description: "Build a real business with real value. Not just a gig on someone else's platform.",
    icon: "🏆",
  },
];

const comparisonData = [
  { feature: "Platform Fee", driveConnect: "Lower fees", competitor: "25-35% of revenue" },
  { feature: "Booking Control", driveConnect: "Full operator control", competitor: "Platform decides" },
  { feature: "Pricing Control", driveConnect: "Set your own rates", competitor: "Platform influences pricing" },
  { feature: "Customer Relationships", driveConnect: "Direct with renters", competitor: "Platform owns relationship" },
  { feature: "Airport Operations", driveConnect: "No restrictions", competitor: "Airport fees & restrictions" },
  { feature: "Platform Rules", driveConnect: "Minimal, fair policies", competitor: "Constantly changing rules" },
  { feature: "Business Independence", driveConnect: "You own your business", competitor: "Platform dependency" },
];

export default function BecomeAPartnerPage() {
  return (
    <>
      {/* HERO */}
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
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginBottom: "1.25rem",
            }}
          >
            Become A Drive Network Partner.
          </h1>
          <p
            style={{
              color: "#DC2626",
              fontWeight: 700,
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              letterSpacing: "0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Earn More. Stay Independent. Build Your Own Rental Business.
          </p>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
              maxWidth: "680px",
              margin: "0 auto 2.5rem",
            }}
          >
            Traditional rental platforms create conflict. Operators make less. Platforms control too much. Too many restrictions. Too many policies. Too much interference. Drive Connect changes the model.
          </p>
          <Link
            href="/partner-application"
            style={{
              display: "inline-block",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "1.125rem 3rem",
              borderRadius: "6px",
            }}
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* PRIMARY MESSAGE */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#F5F5F5" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div
            style={{
              backgroundColor: "#000000",
              borderRadius: "12px",
              padding: "3rem",
              color: "#ffffff",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
                lineHeight: 1.2,
              }}
            >
              You own the cars.{" "}
              <span style={{ color: "#DC2626" }}>You should control the business.</span>
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div>
                <h3 style={{ color: "#DC2626", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  The Problem
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Traditional platforms create conflict",
                    "Operators make less",
                    "Platforms control too much",
                    "Too many restrictions",
                    "Too many policies",
                    "Too much interference",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem", fontSize: "0.9375rem", color: "#aaaaaa" }}>
                      <span style={{ color: "#555555", fontSize: "1rem" }}>✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ color: "#DC2626", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  The Drive Connect Difference
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {[
                    "Private bookings create higher revenue",
                    "Lower fees create better margins",
                    "No unnecessary restrictions",
                    "No endless policy changes",
                    "No platform controlling your business",
                    "Exactly how peer-to-peer should work",
                  ].map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.625rem", fontSize: "0.9375rem", color: "#cccccc" }}>
                      <span style={{ color: "#DC2626", fontSize: "1rem" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
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
              Why Partner With Drive Connect
            </h2>
            <p style={{ color: "#666666", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              Independent operators deserve independence. We built the infrastructure to make that possible.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "4rem",
            }}
          >
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                style={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                  padding: "1.75rem",
                  border: "1px solid #e5e7eb",
                  transition: "border-color 0.2s ease",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{benefit.icon}</div>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: "#000000",
                    marginBottom: "0.625rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {benefit.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#555555", lineHeight: 1.7 }}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >
            Drive Connect vs. Traditional Platforms
          </h2>
          <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #1a1a1a" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                backgroundColor: "#1a1a1a",
                padding: "1rem 1.5rem",
              }}
            >
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#888888", letterSpacing: "0.05em", textTransform: "uppercase" }}>Feature</span>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#DC2626", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center" }}>Drive Connect</span>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "#888888", letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center" }}>Traditional Platforms</span>
            </div>
            {comparisonData.map((row, i) => (
              <div
                key={row.feature}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "1rem 1.5rem",
                  backgroundColor: i % 2 === 0 ? "#0a0a0a" : "#000000",
                  borderTop: "1px solid #1a1a1a",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#aaaaaa", fontWeight: 500 }}>{row.feature}</span>
                <span style={{ fontSize: "0.875rem", color: "#ffffff", fontWeight: 600, textAlign: "center" }}>
                  <span style={{ color: "#DC2626", marginRight: "0.375rem" }}>✓</span>
                  {row.driveConnect}
                </span>
                <span style={{ fontSize: "0.875rem", color: "#555555", textAlign: "center" }}>{row.competitor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        style={{
          padding: "5rem 1.5rem",
          backgroundColor: "#DC2626",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Ready To Build Your Rental Business?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            Join the Drive Network. Earn more. Stay independent. Build something real.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/partner-application"
              style={{
                backgroundColor: "#ffffff",
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1.125rem 3rem",
                borderRadius: "6px",
              }}
            >
              Apply Now
            </Link>
            <Link
              href="/how-it-works"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1.125rem 3rem",
                borderRadius: "6px",
                border: "2px solid rgba(255,255,255,0.5)",
              }}
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy insert */}
      <div
        style={{
          backgroundColor: "#000000",
          padding: "1.5rem",
          textAlign: "center",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <p style={{ color: "#555555", fontSize: "0.875rem", fontStyle: "italic", margin: 0 }}>
          &ldquo;Independent operators deserve independence.&rdquo;
        </p>
      </div>
    </>
  );
}
