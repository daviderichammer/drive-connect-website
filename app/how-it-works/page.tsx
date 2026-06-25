import Link from "next/link";

const renterSteps = [
  {
    step: "01",
    title: "Find Your Vehicle",
    description: "Search by location, category, and dates. Browse verified vehicles from trusted Drive Network Partners. Filter by delivery options, price, and vehicle type.",
    details: ["Search by location", "Search by category", "Search by dates and times", "Filter by delivery options"],
  },
  {
    step: "02",
    title: "Verify Identity",
    description: "Upload your driver license and insurance. Our verification system confirms your identity and coverage before your rental begins.",
    details: ["Upload driver license", "Upload insurance card", "Identity verification process", "Fraud detection checks"],
  },
  {
    step: "03",
    title: "Reserve Securely",
    description: "Review the rental agreement, select your protection options, and submit payment. Security deposit authorization is held — not charged — until return.",
    details: ["Review rental agreement", "Review protection options", "Submit payment", "Security deposit authorization"],
  },
  {
    step: "04",
    title: "Pickup Vehicle",
    description: "No counters. No waiting in line. Get your vehicle delivered to the airport, your hotel, or pick it up directly from the operator.",
    details: ["Airport delivery available", "Home delivery available", "Direct pickup option", "No counters. No waiting."],
  },
  {
    step: "05",
    title: "Drive",
    description: "Enjoy your rental. Message the operator anytime through the platform. Need more time? Request an extension. 24/7 support is available.",
    details: ["Enjoy your rental", "Message operator anytime", "Extend rental if needed", "24/7 support available"],
  },
  {
    step: "06",
    title: "Return Vehicle",
    description: "Simple return process. Digital return confirmation. Leave a review for your operator and help build the trusted Drive Network community.",
    details: ["Simple return process", "Digital return confirmation", "Review your experience", "Security deposit released"],
  },
];

const operatorSteps = [
  {
    step: "01",
    title: "Apply To Join",
    description: "Submit your partner application. Tell us about your fleet, your experience, and your operations. We review all applications personally.",
  },
  {
    step: "02",
    title: "Get Approved",
    description: "Our team reviews your application. We verify your business, your vehicles, and your insurance. Approval typically takes 2-3 business days.",
  },
  {
    step: "03",
    title: "List Your Vehicles",
    description: "Add your fleet to the platform. Set your pricing, availability, delivery options, and vehicle rules. Full control from day one.",
  },
  {
    step: "04",
    title: "Accept Bookings",
    description: "Receive booking requests from verified renters. Review, approve, and manage all reservations through your host dashboard.",
  },
  {
    step: "05",
    title: "Earn More",
    description: "Keep more of your revenue with lower platform fees. Get paid on schedule. Track your earnings, occupancy, and performance in real time.",
  },
  {
    step: "06",
    title: "Grow Your Business",
    description: "Build your reputation, grow your fleet, and expand to new markets. Drive Connect provides the infrastructure. You build the business.",
  },
];

export default function HowItWorksPage() {
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
            Simple Car Rental.{" "}
            <span style={{ color: "#DC2626" }}>Better Experience.</span>
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
            We removed the complexity, the counters, and the conflict. Here is how Drive Connect works — for renters and operators alike.
          </p>
        </div>
      </section>

      {/* FOR RENTERS */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
                marginBottom: "1rem",
              }}
            >
              For Renters
            </div>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "-0.02em",
              }}
            >
              How To Rent A Vehicle
            </h2>
          </div>

          <div style={{ position: "relative" }}>
            {/* Connecting line */}
            <div
              style={{
                position: "absolute",
                left: "2.25rem",
                top: "3rem",
                bottom: "3rem",
                width: "2px",
                backgroundColor: "#e5e7eb",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {renterSteps.map((step, i) => (
                <div
                  key={step.step}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "4.5rem 1fr",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                    paddingBottom: i < renterSteps.length - 1 ? "2.5rem" : "0",
                  }}
                >
                  {/* Step indicator */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        width: "4.5rem",
                        height: "4.5rem",
                        borderRadius: "50%",
                        backgroundColor: "#000000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#DC2626",
                          fontWeight: 900,
                          fontSize: "1.125rem",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {step.step}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ paddingTop: "0.75rem" }}>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 800,
                        color: "#000000",
                        marginBottom: "0.625rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.9375rem",
                        color: "#555555",
                        lineHeight: 1.7,
                        marginBottom: "0.875rem",
                      }}
                    >
                      {step.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      {step.details.map((detail) => (
                        <span
                          key={detail}
                          style={{
                            backgroundColor: "#F5F5F5",
                            color: "#333333",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            padding: "0.25rem 0.75rem",
                            borderRadius: "4px",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link
              href="/find-a-car"
              style={{
                display: "inline-block",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
              }}
            >
              Find A Car
            </Link>
          </div>
        </div>
      </section>

      {/* DIVIDER */}
      <div style={{ backgroundColor: "#DC2626", padding: "1.25rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.8125rem", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
          Simple systems create better customer experiences.
        </p>
      </div>

      {/* FOR OPERATORS */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
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
                marginBottom: "1rem",
              }}
            >
              For Operators
            </div>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              How To Become A Drive Network Partner
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {operatorSteps.map((step) => (
              <div
                key={step.step}
                style={{
                  backgroundColor: "#0a0a0a",
                  borderRadius: "10px",
                  padding: "1.75rem",
                  border: "1px solid #1a1a1a",
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    color: "#DC2626",
                    letterSpacing: "-0.03em",
                    marginBottom: "1rem",
                    lineHeight: 1,
                  }}
                >
                  {step.step}
                </div>
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    marginBottom: "0.625rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#888888", lineHeight: 1.7 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link
              href="/partner-application"
              style={{
                display: "inline-block",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
              }}
            >
              Apply To Become A Partner
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
