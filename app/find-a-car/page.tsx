import Link from "next/link";

const mockResults = [
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
    operator: "Premier Auto Group",
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
    operator: "Luxury Fleet Co.",
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
    operator: "EV Rentals Tampa",
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
    operator: "Elite Drives",
  },
  {
    id: 5,
    name: "2024 Range Rover Sport",
    category: "Luxury SUV",
    daily: 219,
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&q=80",
    rating: 4.7,
    trips: 54,
    delivery: true,
    unlimitedMiles: true,
    operator: "Premier Auto Group",
  },
  {
    id: 6,
    name: "2024 Cadillac Escalade",
    category: "Full-Size SUV",
    daily: 199,
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80",
    rating: 4.8,
    trips: 89,
    delivery: false,
    unlimitedMiles: false,
    operator: "American Luxury Fleet",
  },
];

export default function FindACarPage() {
  return (
    <>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "3rem 1.5rem",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
            }}
          >
            Find The Right Car At The Right Price.
          </h1>
          <p style={{ color: "#aaaaaa", fontSize: "1.0625rem" }}>
            Lower prices. Better vehicles. Simple rental process.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* FILTERS SIDEBAR */}
          <aside
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "1.5rem",
              position: "sticky",
              top: "80px",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "#000000",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
                paddingBottom: "0.75rem",
                borderBottom: "2px solid #000000",
              }}
            >
              Search Filters
            </h2>

            {/* Location */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Pickup Location
              </label>
              <input
                type="text"
                placeholder="City, Airport, or Address"
                style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.875rem", backgroundColor: "#F5F5F5", fontFamily: "Inter, sans-serif", outline: "none" }}
              />
            </div>

            {/* Dates */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Pickup Date
              </label>
              <input type="date" style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.875rem", backgroundColor: "#F5F5F5", fontFamily: "Inter, sans-serif", outline: "none" }} />
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Return Date
              </label>
              <input type="date" style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.875rem", backgroundColor: "#F5F5F5", fontFamily: "Inter, sans-serif", outline: "none" }} />
            </div>

            {/* Vehicle Type */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Vehicle Type
              </label>
              {["SUV", "Luxury", "Convertible", "Sedan", "Electric", "Van", "Truck"].map((type) => (
                <label key={type} style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: "#DC2626", width: "16px", height: "16px" }} />
                  <span style={{ fontSize: "0.875rem", color: "#333333" }}>{type}</span>
                </label>
              ))}
            </div>

            {/* Delivery Options */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Delivery Options
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#DC2626", width: "16px", height: "16px" }} />
                <span style={{ fontSize: "0.875rem", color: "#333333" }}>Airport Delivery Available</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#DC2626", width: "16px", height: "16px" }} />
                <span style={{ fontSize: "0.875rem", color: "#333333" }}>Home Delivery Available</span>
              </label>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Price Range (per day)
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input type="number" placeholder="$0" style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.875rem", backgroundColor: "#F5F5F5", fontFamily: "Inter, sans-serif", outline: "none" }} />
                <span style={{ color: "#888888" }}>—</span>
                <input type="number" placeholder="$500" style={{ width: "100%", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.875rem", backgroundColor: "#F5F5F5", fontFamily: "Inter, sans-serif", outline: "none" }} />
              </div>
            </div>

            {/* Other filters */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#DC2626", width: "16px", height: "16px" }} />
                <span style={{ fontSize: "0.875rem", color: "#333333", fontWeight: 600 }}>Unlimited Miles</span>
              </label>
            </div>

            {/* Operator Rating */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Minimum Operator Rating
              </label>
              <select style={{ width: "100%", padding: "0.625rem 0.875rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.875rem", backgroundColor: "#F5F5F5", fontFamily: "Inter, sans-serif", outline: "none" }}>
                <option>Any Rating</option>
                <option>4.0+</option>
                <option>4.5+</option>
                <option>4.8+</option>
                <option>5.0 Only</option>
              </select>
            </div>

            <button
              style={{
                width: "100%",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "0.875rem",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Search Vehicles
            </button>
          </aside>

          {/* RESULTS */}
          <div>
            {/* Philosophy insert */}
            <div
              style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "1rem 1.5rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span style={{ color: "#DC2626", fontSize: "1.25rem" }}>✦</span>
              <p style={{ fontSize: "0.9375rem", fontStyle: "italic", margin: 0 }}>
                &ldquo;Renters deserve lower prices. And a better rental experience.&rdquo;
              </p>
            </div>

            {/* Results header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <p style={{ fontSize: "0.9375rem", color: "#555555", fontWeight: 500 }}>
                Showing <strong style={{ color: "#000000" }}>{mockResults.length} vehicles</strong> available
              </p>
              <select
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  backgroundColor: "#ffffff",
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option>Sort: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: Highest</option>
                <option>Most Trips</option>
              </select>
            </div>

            {/* Vehicle cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {mockResults.map((vehicle) => (
                <div
                  key={vehicle.id}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "grid",
                    gridTemplateColumns: "280px 1fr",
                    transition: "box-shadow 0.2s ease",
                  }}
                >
                  <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {vehicle.unlimitedMiles && (
                        <span style={{ backgroundColor: "#000000", color: "#ffffff", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                          Unlimited Miles
                        </span>
                      )}
                      {vehicle.delivery && (
                        <span style={{ backgroundColor: "#DC2626", color: "#ffffff", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                          ✈ Airport Delivery
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <div>
                          <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "#000000", marginBottom: "0.25rem" }}>
                            {vehicle.name}
                          </h3>
                          <p style={{ fontSize: "0.875rem", color: "#666666" }}>{vehicle.category}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#DC2626" }}>${vehicle.daily}</p>
                          <p style={{ fontSize: "0.75rem", color: "#888888" }}>per day</p>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.8125rem", color: "#555555", marginBottom: "0.5rem" }}>
                        ⭐ {vehicle.rating} · {vehicle.trips} trips · {vehicle.operator}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <Link
                        href="/find-a-car"
                        style={{
                          backgroundColor: "#DC2626",
                          color: "#ffffff",
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: "0.8125rem",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          padding: "0.625rem 1.5rem",
                          borderRadius: "6px",
                        }}
                      >
                        Book Now
                      </Link>
                      <button
                        style={{
                          backgroundColor: "transparent",
                          color: "#000000",
                          border: "1px solid #e5e7eb",
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          padding: "0.625rem 1.5rem",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        Save Vehicle
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coming soon notice */}
            <div
              style={{
                marginTop: "2rem",
                backgroundColor: "#F5F5F5",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "0.9375rem", color: "#555555", fontWeight: 500 }}>
                <strong style={{ color: "#DC2626" }}>Live search coming soon.</strong> Full booking functionality launches with Phase 3. These are example listings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
