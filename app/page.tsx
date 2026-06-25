import Link from "next/link";
import PhilosophyBanner from "@/components/PhilosophyBanner";

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
      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          minHeight: "90vh",
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
            opacity: 0.35,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            padding: "2rem 1.5rem",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(3rem, 8vw, 6rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}
          >
            DRIVE{" "}
            <span style={{ color: "#DC2626" }}>CONNECT</span>
          </h1>
          <p
            style={{
              color: "#cccccc",
              fontWeight: 500,
              fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            Built For Operators. Designed For Travelers.
          </p>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "clamp(0.9375rem, 2vw, 1.0625rem)",
              lineHeight: 1.8,
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
            }}
          >
            Renters want to pay less. Operators want to make more. Traditional rental platforms put themselves in the middle. That creates conflict. Drive Connect removed the conflict.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "3rem",
            }}
          >
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
                display: "inline-block",
                transition: "background-color 0.2s ease",
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
                border: "2px solid #ffffff",
                display: "inline-block",
                transition: "background-color 0.2s ease, color 0.2s ease",
              }}
            >
              Become A Drive Network Partner
            </Link>
          </div>

          {/* Search Module */}
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.97)",
              borderRadius: "12px",
              padding: "1.5rem",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
              maxWidth: "800px",
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
                transition: "background-color 0.2s ease",
              }}
            >
              Search Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY BANNER */}
      <PhilosophyBanner />

      {/* WHY DRIVE CONNECT */}
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
              Why Drive Connect
            </h2>
            <p style={{ color: "#666666", fontSize: "1.0625rem", maxWidth: "560px", margin: "0 auto" }}>
              We built trusted infrastructure where everyone succeeds together.
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
                Find A Car
              </Link>
            </div>

            {/* For Operators */}
            <div
              style={{
                backgroundColor: "#F5F5F5",
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
                  "Private bookings",
                  "Lower fees",
                  "No unnecessary restrictions",
                  "No endless platform policies",
                  "Independent business ownership",
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
                Become A Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#F5F5F5" }}>
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
                }}
              >
                Featured Vehicles
              </h2>
              <p style={{ color: "#666666", fontSize: "1rem" }}>
                Premium vehicles from trusted Drive Network Partners
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
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section
        style={{
          padding: "5rem 1.5rem",
          backgroundColor: "#000000",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Trusted Infrastructure.{" "}
            <span style={{ color: "#DC2626" }}>Built For Everyone.</span>
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
            We built trusted infrastructure where everyone succeeds together. No unnecessary middleman. No conflict. Just a better rental market.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            {[
              { value: "Verified", label: "Drivers & Operators" },
              { value: "Lower", label: "Fees Than Competitors" },
              { value: "Higher", label: "Operator Revenue" },
              { value: "Direct", label: "Booking Relationships" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#DC2626",
                    marginBottom: "0.375rem",
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ color: "#888888", fontSize: "0.875rem", fontWeight: 500 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/how-it-works"
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
              How It Works
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
