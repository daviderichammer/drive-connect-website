import Link from "next/link";

const protectionSections = [
  {
    number: "01",
    title: "Driver Verification",
    subtitle: "Every renter is verified before they drive.",
    items: [
      "Government ID verification",
      "Facial match verification",
      "Fraud detection checks",
      "Duplicate identity checks",
      "Blacklist screening",
    ],
    icon: "🪪",
  },
  {
    number: "02",
    title: "Insurance Verification",
    subtitle: "Active coverage confirmed before every rental.",
    items: [
      "Insurance upload required",
      "Policy validation system",
      "Coverage verification",
      "Policy expiration validation",
      "Minimum coverage verification",
    ],
    icon: "🛡️",
  },
  {
    number: "03",
    title: "Security Deposits",
    subtitle: "Deposits protect operators without burdening renters.",
    items: [
      "Deposit amount based on vehicle category",
      "Luxury vehicles require larger deposit",
      "Authorization hold — not a charge",
      "Automatic release after return inspection",
      "Transparent deposit terms",
    ],
    icon: "🔒",
  },
  {
    number: "04",
    title: "Claims Process",
    subtitle: "Operators control the claims process.",
    items: [
      "Operator controls claims process",
      "File directly against renter",
      "File against renter insurance carrier",
      "Platform provides document management support",
      "Dispute tracking available",
      "Claims history permanently stored",
    ],
    icon: "📋",
  },
  {
    number: "05",
    title: "Trust Infrastructure",
    subtitle: "Multiple layers of protection for everyone.",
    items: [
      "Verified drivers",
      "Verified insurance",
      "Rental agreement execution",
      "Payment protection",
      "Claims tracking",
      "Communication records",
      "Fraud prevention systems",
    ],
    icon: "🏗️",
  },
];

const pricingTiers = [
  {
    name: "Basic",
    price: "Included",
    description: "Standard protection included with every rental",
    features: [
      "Driver identity verification",
      "Insurance verification",
      "Rental agreement execution",
      "Security deposit hold",
      "Basic claims support",
    ],
    highlight: false,
  },
  {
    name: "Standard",
    price: "$19/day",
    description: "Enhanced protection for peace of mind",
    features: [
      "Everything in Basic",
      "Enhanced fraud monitoring",
      "Priority claims processing",
      "Damage documentation support",
      "Dedicated support line",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "$39/day",
    description: "Maximum protection for high-value vehicles",
    features: [
      "Everything in Standard",
      "Comprehensive damage coverage",
      "Zero deductible option",
      "24/7 emergency assistance",
      "Concierge claims management",
      "Replacement vehicle coordination",
    ],
    highlight: false,
  },
];

export default function ProtectionPlansPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "5rem 1.5rem",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 6vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              lineHeight: 1.05,
            }}
          >
            Protection Built{" "}
            <span style={{ color: "#DC2626" }}>For Everyone.</span>
          </h1>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "1.125rem",
              lineHeight: 1.8,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Drive Connect protects both sides equally. Renters deserve confidence. Operators deserve protection. Trust creates better transactions.
          </p>
        </div>
      </section>

      {/* MAIN MESSAGE */}
      <section style={{ padding: "4rem 1.5rem", backgroundColor: "#DC2626" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              color: "#ffffff",
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              fontWeight: 700,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Drive Connect protects both sides equally. Renters deserve confidence. Operators deserve protection. Trust creates better transactions.
          </p>
        </div>
      </section>

      {/* PROTECTION SECTIONS */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {protectionSections.map((section, i) => (
              <div
                key={section.number}
                style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr 1.5fr" : "1.5fr 1fr",
                  gap: "3rem",
                  alignItems: "center",
                  backgroundColor: i % 2 === 0 ? "#ffffff" : "#F5F5F5",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                {i % 2 !== 0 && (
                  <div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {section.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "0.75rem",
                            fontSize: "0.9375rem",
                            color: "#333333",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#DC2626",
                              flexShrink: 0,
                            }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{section.icon}</div>
                  <div
                    style={{
                      fontSize: "3.5rem",
                      fontWeight: 900,
                      color: "#e5e7eb",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {section.number}
                  </div>
                  <h2
                    style={{
                      fontSize: "1.625rem",
                      fontWeight: 800,
                      color: "#000000",
                      letterSpacing: "-0.02em",
                      marginBottom: "0.625rem",
                    }}
                  >
                    {section.title}
                  </h2>
                  <p style={{ fontSize: "0.9375rem", color: "#666666", lineHeight: 1.7 }}>
                    {section.subtitle}
                  </p>
                </div>
                {i % 2 === 0 && (
                  <div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {section.items.map((item) => (
                        <li
                          key={item}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            marginBottom: "0.75rem",
                            fontSize: "0.9375rem",
                            color: "#333333",
                          }}
                        >
                          <span
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#DC2626",
                              flexShrink: 0,
                            }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TIERS */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Protection Plan Options
            </h2>
            <p style={{ color: "#888888", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              Choose the level of protection that fits your rental. All plans include verified identity and insurance confirmation.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  backgroundColor: tier.highlight ? "#DC2626" : "#0a0a0a",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  border: tier.highlight ? "none" : "1px solid #1a1a1a",
                  position: "relative",
                }}
              >
                {tier.highlight && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.75rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#ffffff",
                      color: "#DC2626",
                      fontSize: "0.6875rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "0.25rem 0.875rem",
                      borderRadius: "4px",
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    marginBottom: "0.375rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tier.name}
                </h3>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: tier.highlight ? "#ffffff" : "#DC2626",
                    marginBottom: "0.5rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tier.price}
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: tier.highlight ? "rgba(255,255,255,0.8)" : "#888888",
                    marginBottom: "1.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  {tier.description}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.625rem",
                        marginBottom: "0.625rem",
                        fontSize: "0.875rem",
                        color: tier.highlight ? "rgba(255,255,255,0.9)" : "#aaaaaa",
                      }}
                    >
                      <span style={{ color: tier.highlight ? "#ffffff" : "#DC2626", fontWeight: 700, marginTop: "0.1rem" }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              color: "#555555",
              fontSize: "0.8125rem",
              marginTop: "2rem",
            }}
          >
            Protection plan pricing and availability will be confirmed at checkout. All rentals include Basic protection at no additional cost.
          </p>
        </div>
      </section>

      {/* Philosophy insert */}
      <div
        style={{
          backgroundColor: "#DC2626",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.875rem", fontStyle: "italic", margin: 0 }}>
          &ldquo;Protection exists to create trust.&rdquo;
        </p>
      </div>

      {/* CTA */}
      <section style={{ padding: "4rem 1.5rem", backgroundColor: "#F5F5F5", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#000000", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
            Ready To Rent With Confidence?
          </h2>
          <p style={{ color: "#666666", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.7 }}>
            Every Drive Connect rental includes verified drivers, verified insurance, and a signed rental agreement.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/find-a-car"
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
              ENTER THE NETWORK
            </Link>
            <Link
              href="/support"
              style={{
                backgroundColor: "transparent",
                color: "#000000",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
                border: "2px solid #000000",
              }}
            >
              Ask A Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
