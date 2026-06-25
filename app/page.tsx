import Link from "next/link";

const vehicleCategories = [
  { code: "SIPP", label: "All Categories" },
  { code: "ECMR", label: "Economy" },
  { code: "CCMR", label: "Compact" },
  { code: "IFMR", label: "Intermediate" },
  { code: "SFMR", label: "Standard" },
  { code: "FFMR", label: "Full-Size" },
  { code: "PFMR", label: "Premium" },
  { code: "LDAR", label: "Luxury" },
  { code: "SUVM", label: "SUV" },
  { code: "FVAR", label: "Minivan" },
  { code: "ITAR", label: "Convertible" },
  { code: "ECAR", label: "Electric" },
];

const featuredCategories = [
  { label: "Popular Rentals", icon: "🔥" },
  { label: "SUVs", icon: "🚙" },
  { label: "Luxury Vehicles", icon: "💎" },
  { label: "Electric Vehicles", icon: "⚡" },
  { label: "Airport Delivery", icon: "✈️" },
  { label: "Tampa Inventory", icon: "📍" },
  { label: "Orlando Inventory", icon: "📍" },
  { label: "Miami Inventory", icon: "📍" },
];

const mockVehicles = [
  {
    id: 1,
    name: "2024 BMW X5",
    category: "Luxury SUV",
    daily: 189,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    rating: 4.9,
    trips: 142,
    delivery: true,
    unlimitedMiles: true,
  },
  {
    id: 2,
    name: "2024 Mercedes-Benz C-Class",
    category: "Luxury Sedan",
    daily: 149,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
    rating: 4.8,
    trips: 98,
    delivery: true,
    unlimitedMiles: false,
  },
  {
    id: 3,
    name: "2024 Tesla Model 3",
    category: "Electric",
    daily: 129,
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80",
    rating: 4.9,
    trips: 211,
    delivery: false,
    unlimitedMiles: true,
  },
  {
    id: 4,
    name: "2024 Porsche Cayenne",
    category: "Luxury SUV",
    daily: 249,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    rating: 5.0,
    trips: 67,
    delivery: true,
    unlimitedMiles: false,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ============================================================ */}
      {/* CHANGE #1: HERO SECTION — REBUILT */}
      {/* ============================================================ */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#000000",
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.18,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,1) 100%)",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "4rem 1.5rem",
            maxWidth: "960px",
            width: "100%",
          }}
        >
          {/* Declarative headline lines */}
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "clamp(2rem, 5.5vw, 4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "0.25rem",
                textTransform: "uppercase",
              }}
            >
              THE CAR RENTAL INDUSTRY
            </p>
            <p
              style={{
                color: "#DC2626",
                fontWeight: 900,
                fontSize: "clamp(2rem, 5.5vw, 4rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              WAS BUILT WRONG.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                marginBottom: "2rem",
              }}
            >
              {[
                "Renters pay too much.",
                "Operators earn too little.",
                "Platforms create conflict.",
              ].map((line) => (
                <p
                  key={line}
                  style={{
                    color: "#aaaaaa",
                    fontWeight: 600,
                    fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                    letterSpacing: "0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>

            <p
              style={{
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Drive Connect rebuilt the system.
            </p>
          </div>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "4rem",
            }}
          >
            <Link
              href="/find-a-car"
              style={{
                backgroundColor: "#DC2626",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "1.125rem 2.75rem",
                borderRadius: "6px",
                display: "inline-block",
              }}
            >
              JOIN THE NETWORK
            </Link>
            <Link
              href="/market-principle"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "1.125rem 2.75rem",
                borderRadius: "6px",
                border: "2px solid rgba(255,255,255,0.4)",
                display: "inline-block",
              }}
            >
              SEE HOW THE SYSTEM WORKS
            </Link>
          </div>

          {/* Search Module */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.97)",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Pickup Location
                </label>
                <input
                  type="text"
                  placeholder="City, Airport, or Address"
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Pickup Date
                </label>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Pickup Time
                </label>
                <input
                  type="time"
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Return Date
                </label>
                <input
                  type="date"
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Return Time
                </label>
                <input
                  type="time"
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Vehicle Category
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.875rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    backgroundColor: "#F5F5F5",
                    color: "#000000",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {vehicleCategories.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Link
              href="/find-a-car"
              style={{
                display: "block",
                width: "100%",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                textAlign: "center",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem",
                borderRadius: "6px",
              }}
            >
              ENTER THE NETWORK
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CHANGE #2: MANIFESTO SECTION */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#0a0a0a",
          padding: "6rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
            gap: "4rem",
          }}
        >
          {/* Block 1: THE OLD MODEL FAILED */}
          <div>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.375rem 1rem",
                borderRadius: "3px",
                marginBottom: "2rem",
              }}
            >
              The Problem
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              THE OLD MODEL FAILED.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                { text: "Traditional marketplaces created imbalance.", weight: 600, color: "#cccccc" },
                { text: "Renters pay inflated prices.", weight: 400, color: "#888888" },
                { text: "Operators surrender margin.", weight: 400, color: "#888888" },
                { text: "Platforms insert themselves between two willing participants.", weight: 400, color: "#888888" },
                { text: "One side wins.", weight: 600, color: "#aaaaaa" },
                { text: "One side loses.", weight: 600, color: "#aaaaaa" },
                { text: "That is inefficient.", weight: 700, color: "#DC2626" },
                { text: "That is unhealthy.", weight: 700, color: "#DC2626" },
                { text: "That is unnecessary.", weight: 700, color: "#DC2626" },
              ].map((line) => (
                <p
                  key={line.text}
                  style={{
                    color: line.color,
                    fontWeight: line.weight,
                    fontSize: "clamp(0.9375rem, 1.75vw, 1.0625rem)",
                    lineHeight: 1.5,
                    borderLeft: line.weight === 700 ? "3px solid #DC2626" : "none",
                    paddingLeft: line.weight === 700 ? "1rem" : "0",
                  }}
                >
                  {line.text}
                </p>
              ))}
            </div>
          </div>

          {/* Block 2: WE BUILT SOMETHING BETTER */}
          <div>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.375rem 1rem",
                borderRadius: "3px",
                marginBottom: "2rem",
              }}
            >
              The Solution
            </div>
            <h2
              style={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              WE BUILT SOMETHING BETTER.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {[
                { text: "Direct trust infrastructure.", weight: 700, color: "#ffffff" },
                { text: "Verified participants.", weight: 400, color: "#aaaaaa" },
                { text: "Transparent economics.", weight: 400, color: "#aaaaaa" },
                { text: "Aligned incentives.", weight: 400, color: "#aaaaaa" },
                { text: "Fairness by design.", weight: 600, color: "#cccccc" },
                { text: "Technology removing friction.", weight: 600, color: "#cccccc" },
                { text: "Success shared by everyone.", weight: 700, color: "#ffffff" },
              ].map((line) => (
                <p
                  key={line.text}
                  style={{
                    color: line.color,
                    fontWeight: line.weight,
                    fontSize: "clamp(0.9375rem, 1.75vw, 1.0625rem)",
                    lineHeight: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#DC2626",
                      flexShrink: 0,
                    }}
                  />
                  {line.text}
                </p>
              ))}
            </div>
            <div style={{ marginTop: "2.5rem" }}>
              <Link
                href="/why-we-built-this"
                style={{
                  color: "#DC2626",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderBottom: "1px solid #DC2626",
                  paddingBottom: "2px",
                }}
              >
                Read The Founding Doctrine →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CHANGE #5: TRUST INFRASTRUCTURE SECTION */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "7rem 1.5rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Section headline */}
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <h2
              style={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              TRUST IS NOT A FEATURE.
            </h2>
            <h2
              style={{
                color: "#DC2626",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "2rem",
                textTransform: "uppercase",
              }}
            >
              IT IS THE INFRASTRUCTURE.
            </h2>
            <p
              style={{
                color: "#666666",
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Every reservation includes:
            </p>
          </div>

          {/* Trust items grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "0",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "4rem",
            }}
          >
            {[
              "Driver license verification",
              "Insurance verification",
              "Identity confirmation",
              "Digital rental agreements",
              "Electronic signatures",
              "Secure payment processing",
              "Security deposit authorization",
              "Claims management system",
              "Fraud prevention",
              "Verified operators",
            ].map((item, i) => (
              <div
                key={item}
                style={{
                  padding: "1.75rem 2rem",
                  borderRight: (i % 2 === 0) ? "1px solid #1a1a1a" : "none",
                  borderBottom: i < 8 ? "1px solid #1a1a1a" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  backgroundColor: i % 2 === 0 ? "#000000" : "#050505",
                }}
              >
                <span
                  style={{
                    color: "#DC2626",
                    fontWeight: 900,
                    fontSize: "1.25rem",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    color: "#cccccc",
                    fontWeight: 500,
                    fontSize: "1rem",
                    letterSpacing: "0.01em",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Closing statement */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
                letterSpacing: "-0.01em",
                marginBottom: "2rem",
              }}
            >
              Trust creates healthy markets.
            </p>
            <Link
              href="/protection-plans"
              style={{
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                borderBottom: "1px solid #DC2626",
                paddingBottom: "2px",
              }}
            >
              View Full Trust Infrastructure →
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CHANGE #6: AUCTION ENGINE / INTELLIGENT MARKET DISTRIBUTION */}
      {/* ============================================================ */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "7rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#000000",
                color: "#ffffff",
                fontSize: "0.6875rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.375rem 1rem",
                borderRadius: "3px",
                marginBottom: "1.5rem",
              }}
            >
              The Centerpiece
            </div>
            <h2
              style={{
                color: "#000000",
                fontWeight: 900,
                fontSize: "clamp(1.75rem, 4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              INTELLIGENT MARKET DISTRIBUTION
            </h2>
            <p
              style={{
                color: "#555555",
                fontSize: "1.0625rem",
                lineHeight: 1.8,
                maxWidth: "680px",
                margin: "0 auto",
              }}
            >
              The revolutionary economics of Drive Connect — visible, transparent, and designed to benefit every participant.
            </p>
          </div>

          {/* How the market works — declarative lines */}
          <div
            style={{
              backgroundColor: "#000000",
              borderRadius: "12px",
              padding: "3rem 3.5rem",
              marginBottom: "4rem",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { text: "The renter books at a transparent market price.", accent: false },
                { text: "Verified operators with available vehicles compete for the reservation.", accent: false },
                { text: "Drive Connect allocates the reservation efficiently.", accent: false },
                { text: "The renter pays less.", accent: true },
                { text: "The operator earns more.", accent: true },
                { text: "The market functions naturally.", accent: false },
                { text: "No manipulation.", accent: false },
                { text: "No unnecessary fees.", accent: false },
                { text: "No artificial restrictions.", accent: false },
              ].map((line, i) => (
                <div
                  key={line.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    paddingBottom: i < 8 ? "1rem" : "0",
                    borderBottom: i < 8 ? "1px solid #1a1a1a" : "none",
                  }}
                >
                  <span
                    style={{
                      color: "#333333",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      minWidth: "2rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    style={{
                      color: line.accent ? "#ffffff" : "#888888",
                      fontWeight: line.accent ? 800 : 400,
                      fontSize: line.accent ? "clamp(1rem, 2vw, 1.25rem)" : "clamp(0.9375rem, 1.75vw, 1.0625rem)",
                      lineHeight: 1.4,
                    }}
                  >
                    {line.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual flow diagram */}
          <div style={{ marginBottom: "4rem" }}>
            <p
              style={{
                textAlign: "center",
                color: "#999999",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "2rem",
              }}
            >
              How a reservation flows through the system
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "0",
                overflowX: "auto",
              }}
            >
              {[
                { label: "Customer books", sub: "Jeep Wagoneer", color: "#000000" },
                { label: "5 operators", sub: "eligible & verified", color: "#1a1a1a" },
                { label: "Operators bid", sub: "competitive market", color: "#DC2626" },
                { label: "Winner selected", sub: "best bid wins", color: "#1a1a1a" },
                { label: "Customer pays", sub: "$125/day", color: "#000000" },
                { label: "Operator retains", sub: "superior margin", color: "#DC2626" },
                { label: "Everyone wins", sub: "aligned incentives", color: "#000000" },
              ].map((step, i) => (
                <div
                  key={step.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: step.color,
                      color: "#ffffff",
                      padding: "1rem 1.25rem",
                      borderRadius: "8px",
                      textAlign: "center",
                      minWidth: "120px",
                      border: step.color === "#DC2626" ? "none" : "1px solid #e5e7eb",
                    }}
                  >
                    <p style={{ fontWeight: 700, fontSize: "0.8125rem", marginBottom: "0.25rem", color: step.color === "#000000" || step.color === "#1a1a1a" ? "#ffffff" : "#ffffff" }}>
                      {step.label}
                    </p>
                    <p style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                      {step.sub}
                    </p>
                  </div>
                  {i < 6 && (
                    <div
                      style={{
                        color: "#DC2626",
                        fontWeight: 900,
                        fontSize: "1.25rem",
                        padding: "0 0.5rem",
                        flexShrink: 0,
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center" }}>
            <Link
              href="/market-principle"
              style={{
                display: "inline-block",
                backgroundColor: "#000000",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2.5rem",
                borderRadius: "6px",
                marginRight: "1rem",
              }}
            >
              THE MARKET PRINCIPLE
            </Link>
            <Link
              href="/become-a-partner"
              style={{
                display: "inline-block",
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
              JOIN AS AN OPERATOR
            </Link>
          </div>
        </div>
      </section>

      {/* WHY DRIVE CONNECT — FOR RENTERS & OPERATORS */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#F5F5F5" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                textTransform: "uppercase",
              }}
            >
              A Better System For Everyone
            </h2>
            <p style={{ color: "#666666", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              When the infrastructure is fair, every participant succeeds.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* For Renters */}
            <div
              style={{
                backgroundColor: "#000000",
                borderRadius: "12px",
                padding: "2.5rem",
                color: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#DC2626",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "4px",
                  marginBottom: "1.5rem",
                }}
              >
                For Renters
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
                A Better Rental Experience
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Lower total rental cost",
                  "No rental counters",
                  "No waiting in line",
                  "Airport pickup available",
                  "Flexible delivery options",
                  "Better overall rental experience",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.875rem",
                      fontSize: "0.9375rem",
                      color: "#cccccc",
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
              <Link
                href="/find-a-car"
                style={{
                  display: "inline-block",
                  marginTop: "1.5rem",
                  backgroundColor: "#DC2626",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "6px",
                }}
              >
                RESERVE DIRECTLY
              </Link>
            </div>

            {/* For Operators */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "2.5rem",
                color: "#000000",
                border: "2px solid #000000",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "4px",
                  marginBottom: "1.5rem",
                }}
              >
                For Operators
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Own Your Rental Business
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Higher revenue",
                  "Direct customer relationships",
                  "Transparent pricing freedom",
                  "Operator autonomy",
                  "Business independence",
                  "Flexible market participation",
                ].map((item) => (
                  <li
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.875rem",
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
              <Link
                href="/become-a-partner"
                style={{
                  display: "inline-block",
                  marginTop: "1.5rem",
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "6px",
                }}
              >
                JOIN AS AN OPERATOR
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                Available Vehicles
              </h2>
              <p style={{ color: "#666666", fontSize: "1rem" }}>
                Premium vehicles from verified Drive Network operators
              </p>
            </div>
            <Link
              href="/find-a-car"
              style={{
                color: "#DC2626",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              View All →
            </Link>
          </div>

          {/* Category tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "1rem",
              marginBottom: "2rem",
            }}
          >
            {featuredCategories.map((cat, i) => (
              <button
                key={cat.label}
                style={{
                  backgroundColor: i === 0 ? "#000000" : "#ffffff",
                  color: i === 0 ? "#ffffff" : "#333333",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Vehicle cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {mockVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
              >
                <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {vehicle.unlimitedMiles && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        backgroundColor: "#000000",
                        color: "#ffffff",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        padding: "0.25rem 0.625rem",
                        borderRadius: "4px",
                      }}
                    >
                      Unlimited Miles
                    </span>
                  )}
                  {vehicle.delivery && (
                    <span
                      style={{
                        position: "absolute",
                        top: vehicle.unlimitedMiles ? "2.25rem" : "0.75rem",
                        left: "0.75rem",
                        backgroundColor: "#DC2626",
                        color: "#ffffff",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        padding: "0.25rem 0.625rem",
                        borderRadius: "4px",
                        marginTop: "0.25rem",
                      }}
                    >
                      ✈ Airport Delivery
                    </span>
                  )}
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 700,
                          color: "#000000",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {vehicle.name}
                      </h3>
                      <p style={{ fontSize: "0.8125rem", color: "#666666" }}>
                        {vehicle.category}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "#DC2626",
                        }}
                      >
                        ${vehicle.daily}
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "#888888" }}>/day</p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "0.8125rem", color: "#555555" }}>
                      ⭐ {vehicle.rating} · {vehicle.trips} trips
                    </span>
                  </div>
                  <Link
                    href="/find-a-car"
                    style={{
                      display: "block",
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      textDecoration: "none",
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      padding: "0.625rem",
                      borderRadius: "6px",
                    }}
                  >
                    RESERVE DIRECTLY
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA SECTION */}
      <section
        style={{
          padding: "6rem 1.5rem",
          backgroundColor: "#000000",
          color: "#ffffff",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.875rem, 4vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              textTransform: "uppercase",
              lineHeight: 1.1,
            }}
          >
            Better infrastructure creates{" "}
            <span style={{ color: "#DC2626" }}>better markets.</span>
          </h2>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "1.0625rem",
              maxWidth: "600px",
              margin: "0 auto 3rem",
              lineHeight: 1.8,
            }}
          >
            Drive Connect is not a car rental company. It is a trust infrastructure platform — built to make markets function the way they should.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/market-principle"
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
              THE MARKET PRINCIPLE
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
              Why We Exist
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
