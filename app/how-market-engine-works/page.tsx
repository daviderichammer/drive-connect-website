import Link from "next/link";

export const metadata = {
  title: "How The Market Engine Works | Drive Connect",
  description:
    "The step-by-step mechanics of how Drive Connect's bidding and marketplace mechanism creates genuine price discovery.",
};

export default function HowMarketEngineWorksPage() {
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
            Platform Mechanics
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
            How The Market Engine Works
          </h1>
          <p
            style={{
              color: "#888888",
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              lineHeight: 1.8,
              maxWidth: "720px",
            }}
          >
            Drive Connect's market engine is not a booking form. It is a structured mechanism for price discovery, trust verification, and transparent transaction administration. This is how it works, step by step.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STEP-BY-STEP FLOW */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#0a0a0a",
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "4rem",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            The Transaction Flow
          </h2>

          {[
            {
              step: "01",
              phase: "Renter Verification",
              title: "Trust Is Established Before The Market Opens",
              description:
                "Before a renter can access the marketplace, they complete the Drive Connect verification process. Government ID is confirmed. Facial match is verified. Insurance is validated. Fraud signals are checked. This is not optional. The market does not open until trust is established.",
              color: "#DC2626",
              items: [
                "Identity verification completed",
                "Insurance policy confirmed",
                "Fraud screening passed",
                "Account activated",
              ],
            },
            {
              step: "02",
              phase: "Vehicle Discovery",
              title: "Renters Browse Verified Operator Inventory",
              description:
                "Verified renters browse the marketplace. Every vehicle listed is provided by an independent operator who has been verified by Drive Connect. Operators set their own pricing, availability, delivery options, and vehicle rules. The renter sees exactly what they will pay — no hidden fees, no dynamic surcharges.",
              color: "#ffffff",
              items: [
                "Browse verified operator vehicles",
                "See transparent pricing",
                "Filter by location, category, features",
                "View operator profile and ratings",
              ],
            },
            {
              step: "03",
              phase: "Bidding & Price Discovery",
              title: "The Auction Engine Creates Genuine Market Pricing",
              description:
                "Drive Connect's auction mechanism allows renters to submit bids on available vehicles. Operators can accept, counter, or decline. This creates genuine price discovery — the market-clearing price emerges from the interaction between supply and demand, not from a platform algorithm. Neither party is forced to accept a price they do not agree to.",
              color: "#DC2626",
              items: [
                "Renter submits bid or accepts listed price",
                "Operator reviews and responds",
                "Counter-offers are permitted",
                "Market-clearing price is agreed",
              ],
            },
            {
              step: "04",
              phase: "Booking Confirmation",
              title: "Terms Are Confirmed Before Payment",
              description:
                "Once a price is agreed, the renter reviews the full rental terms — vehicle details, pickup location, rental period, protection plan options, and total cost. All fees are disclosed. The renter confirms the booking before any payment is processed.",
              color: "#ffffff",
              items: [
                "Full rental terms displayed",
                "Protection plan options presented",
                "Total cost confirmed",
                "Booking terms accepted",
              ],
            },
            {
              step: "05",
              phase: "Payment Administration",
              title: "Drive Connect Administers Payment On Behalf Of All Parties",
              description:
                "The renter pays Drive Connect as the authorized payment administrator for participating operators and affiliated service providers. Drive Connect collects the total payment — rental fee, protection plan, and applicable fees — and administers settlement to each party. The operator receives their allocation. Drive Protection Inc. receives the protection plan allocation. Drive Connect retains the marketplace allocation.",
              color: "#DC2626",
              items: [
                "Renter pays Drive Connect",
                "Drive Connect deducts marketplace allocation",
                "Operator allocation remitted to operator",
                "Protection plan allocation remitted to Drive Protection Inc.",
              ],
            },
            {
              step: "06",
              phase: "Security Deposit",
              title: "Security Deposit Is Handled Separately",
              description:
                "The security deposit is a separate transaction between the renter and the operator. Drive Connect does not administer the security deposit. The deposit is authorized at vehicle pickup and released upon successful return and inspection. Deposit amounts are published in the vehicle listing.",
              color: "#ffffff",
              items: [
                "Deposit authorized at pickup",
                "Held by operator — not Drive Connect",
                "Released after successful return inspection",
                "Deposit disputes handled through Drive Connect resolution process",
              ],
            },
            {
              step: "07",
              phase: "Vehicle Handoff",
              title: "Pre-Rental Documentation Protects Both Parties",
              description:
                "At vehicle pickup, both operator and renter complete pre-rental photo documentation through the Drive Connect platform. The condition of the vehicle is recorded before the rental begins. This documentation is permanent and forms the basis of any post-rental claims.",
              color: "#DC2626",
              items: [
                "Pre-rental photos uploaded",
                "Vehicle condition documented",
                "Rental period begins",
                "Both parties have documentation record",
              ],
            },
            {
              step: "08",
              phase: "Return & Settlement",
              title: "Post-Rental Documentation Closes The Transaction",
              description:
                "At vehicle return, post-rental photos are uploaded. The operator inspects the vehicle. If the vehicle is returned in acceptable condition, the security deposit is released and the transaction is closed. If damage is identified, the operator initiates the claims process through Drive Connect.",
              color: "#ffffff",
              items: [
                "Post-rental photos uploaded",
                "Vehicle inspection completed",
                "Security deposit released if no damage",
                "Claims process initiated if damage identified",
              ],
            },
          ].map((item, i) => (
            <div
              key={item.step}
              style={{
                display: "flex",
                gap: "2rem",
                marginBottom: "3rem",
                paddingBottom: "3rem",
                borderBottom: i < 7 ? "1px solid #1a1a1a" : "none",
              }}
            >
              {/* Step number and connector */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                    backgroundColor: item.color === "#DC2626" ? "#DC2626" : "#1a1a1a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontWeight: 900,
                    fontSize: "0.875rem",
                    letterSpacing: "-0.01em",
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </div>
                {i < 7 && (
                  <div
                    style={{
                      width: "2px",
                      flex: 1,
                      backgroundColor: "#1a1a1a",
                      marginTop: "0.5rem",
                      minHeight: "2rem",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    color: item.color === "#DC2626" ? "#DC2626" : "#555555",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.phase}
                </p>
                <h3
                  style={{
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    letterSpacing: "-0.01em",
                    marginBottom: "1rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "#888888",
                    fontSize: "0.9375rem",
                    lineHeight: 1.8,
                    marginBottom: "1.25rem",
                  }}
                >
                  {item.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {item.items.map((point) => (
                    <span
                      key={point}
                      style={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid #1a1a1a",
                        color: "#aaaaaa",
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        padding: "0.375rem 0.875rem",
                        borderRadius: "4px",
                      }}
                    >
                      ✓ {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAYMENT ARCHITECTURE DIAGRAM */}
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
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "1rem",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Payment Architecture
          </h2>
          <p
            style={{
              color: "#888888",
              fontSize: "1rem",
              lineHeight: 1.8,
              textAlign: "center",
              marginBottom: "4rem",
              maxWidth: "600px",
              margin: "0 auto 4rem",
            }}
          >
            Drive Connect acts as authorized payment administrator for participating operators and affiliated service providers. The settlement architecture is published and transparent.
          </p>

          {/* Flow diagram */}
          <div
            style={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "3rem",
            }}
          >
            {/* Renter pays */}
            <div
              style={{
                backgroundColor: "#DC2626",
                borderRadius: "8px",
                padding: "1.5rem 2rem",
                textAlign: "center",
                marginBottom: "0",
              }}
            >
              <p
                style={{
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "1.125rem",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                RENTER
              </p>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                Pays total: Rental + Protection Plan + Fees
              </p>
            </div>

            {/* Arrow down */}
            <div style={{ textAlign: "center", padding: "1rem 0", color: "#DC2626", fontSize: "1.5rem" }}>↓</div>

            {/* Drive Connect */}
            <div
              style={{
                backgroundColor: "#1a1a1a",
                border: "2px solid #DC2626",
                borderRadius: "8px",
                padding: "1.5rem 2rem",
                textAlign: "center",
                marginBottom: "0",
              }}
            >
              <p
                style={{
                  color: "#DC2626",
                  fontWeight: 900,
                  fontSize: "1.125rem",
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                DRIVE CONNECT
              </p>
              <p style={{ color: "#888888", fontSize: "0.875rem" }}>
                Authorized Payment Administrator — collects, deducts marketplace allocation, administers settlement
              </p>
            </div>

            {/* Three-way split */}
            <div style={{ textAlign: "center", padding: "1rem 0", color: "#555555", fontSize: "1.5rem" }}>↓</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1rem",
              }}
            >
              {[
                {
                  label: "OPERATOR",
                  sublabel: "Operator Allocation",
                  desc: "Rental revenue minus marketplace allocation",
                  color: "#ffffff",
                  bg: "#111111",
                  border: "#333333",
                },
                {
                  label: "DRIVE PROTECTION INC.",
                  sublabel: "Protection Plan Allocation",
                  desc: "Protection plan fees remitted to Drive Protection Inc.",
                  color: "#DC2626",
                  bg: "#0a0a0a",
                  border: "#DC2626",
                },
                {
                  label: "DRIVE CONNECT",
                  sublabel: "Marketplace Allocation",
                  desc: "Platform fee retained by Drive Connect",
                  color: "#888888",
                  bg: "#0a0a0a",
                  border: "#333333",
                },
              ].map((box) => (
                <div
                  key={box.label}
                  style={{
                    backgroundColor: box.bg,
                    border: `1px solid ${box.border}`,
                    borderRadius: "8px",
                    padding: "1.25rem",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      color: box.color,
                      fontWeight: 800,
                      fontSize: "0.8125rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {box.label}
                  </p>
                  <p
                    style={{
                      color: "#888888",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      marginBottom: "0.5rem",
                    }}
                  >
                    {box.sublabel}
                  </p>
                  <p style={{ color: "#555555", fontSize: "0.75rem", lineHeight: 1.5 }}>
                    {box.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Security deposit note */}
            <div
              style={{
                marginTop: "2rem",
                padding: "1.25rem 1.5rem",
                backgroundColor: "#000000",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ color: "#DC2626", fontSize: "1.25rem", flexShrink: 0 }}>⚠</span>
              <div>
                <p
                  style={{
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  Security Deposit — Separate Transaction
                </p>
                <p style={{ color: "#888888", fontSize: "0.8125rem", lineHeight: 1.5 }}>
                  Security deposit flows directly from Renter → Operator. Drive Connect does not administer the security deposit. It is authorized at pickup and released upon successful return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* WHY THIS ARCHITECTURE */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#0a0a0a",
          padding: "5rem 1.5rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "2rem",
              textTransform: "uppercase",
            }}
          >
            How This Architecture Supports Professional Markets
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                title: "Price Discovery",
                body: "The auction mechanism creates genuine market-clearing prices. Neither party is forced to accept a price they do not agree to. The market determines value.",
              },
              {
                title: "Transparent Economics",
                body: "The settlement architecture is published. Every party knows exactly what they pay and what they receive. No hidden deductions. No surprise fees.",
              },
              {
                title: "Aligned Incentives",
                body: "Drive Connect is designed around completed reservations, clear participant responsibilities, and professional customer experiences. The marketplace supports operators and renters through a successful transaction workflow.",
              },
              {
                title: "Professional Operator Control",
                body: "Operators set prices, control availability, and manage their vehicle businesses while Drive Connect provides marketplace and transaction infrastructure.",
              },
              {
                title: "Renter Protection",
                body: "Verified operators, documented vehicles, structured claims process, and Protection Plans provided by Drive Protection Inc. create a protected renter experience.",
              },
              {
                title: "Structural Trust",
                body: "Verification, fraud detection, documentation, and accountability systems make trust a reliable property of every transaction — not a hope.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  backgroundColor: "#000000",
                  border: "1px solid #1a1a1a",
                  borderRadius: "8px",
                  padding: "1.75rem",
                  borderTop: "3px solid #DC2626",
                }}
              >
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
                  {item.title}
                </h3>
                <p style={{ color: "#888888", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                  {item.body}
                </p>
              </div>
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
            Enter The Market
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
            }}
          >
            The market engine is live. Verified operators are listing vehicles. Verified renters are booking. The infrastructure is ready.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/find-a-car"
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
              FIND A VEHICLE
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
              LIST YOUR VEHICLES
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
