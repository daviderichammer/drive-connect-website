import Link from "next/link";

export const metadata = {
  title: "About Drive Connect — The Customer-Facing Marketplace of Global Drive Holdings",
  description:
    "Drive Connect connects professional vehicle operators with renters while integrating technology, protection, service, and operational support throughout the vehicle lifecycle.",
};

const ecosystemRoles = [
  {
    title: "Professional Operators",
    body: "Professional hosts, independent rental companies, franchise operators, fleet owners, and future dealership partners provide the vehicles and customer experience.",
  },
  {
    title: "Drive Connect",
    body: "The customer-facing marketplace connects operator inventory with renters, facilitates transactions, and creates a direct channel for customer demand.",
  },
  {
    title: "Global Drive Holdings Ecosystem",
    body: "Connected technology, protection, service, parts, analytics, and operating support extend beyond the reservation to the full vehicle lifecycle.",
  },
];

const principles = [
  {
    number: "01",
    title: "Built for professional vehicle businesses",
    body: "The platform is designed around the operating realities of professional hosts and rental companies—not around an anonymous sharing-economy model.",
  },
  {
    number: "02",
    title: "Designed beyond the booking",
    body: "Reservations matter, but sustainable operators also need vehicle intelligence, protection, service coordination, parts access, analytics, and recurring-revenue infrastructure.",
  },
  {
    number: "03",
    title: "Connected across the vehicle lifecycle",
    body: "Drive Connect is the demand layer within a broader ecosystem intended to support the vehicle from acquisition and deployment through operation, service, and long-term performance.",
  },
  {
    number: "04",
    title: "Capital-efficient by design",
    body: "Drive Connect scales through operator participation, technology, relationships, and ecosystem services rather than through ownership of a centralized fleet.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section style={{ backgroundColor: "#000", padding: "7rem 1.5rem", borderBottom: "4px solid #DC2626" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
          <p style={{ color: "#DC2626", fontWeight: 800, fontSize: ".75rem", letterSpacing: ".22em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            About Drive Connect
          </p>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2.3rem, 6vw, 5rem)", letterSpacing: "-.045em", lineHeight: 1, textTransform: "uppercase", maxWidth: "980px", marginBottom: "2rem" }}>
            The Customer-Facing Marketplace of the <span style={{ color: "#DC2626" }}>Global Drive Holdings Ecosystem.</span>
          </h1>
          <p style={{ color: "#ccc", fontSize: "clamp(1.05rem, 2.4vw, 1.3rem)", lineHeight: 1.8, maxWidth: "900px", marginBottom: "1.5rem" }}>
            Drive Connect connects professional vehicle operators with renters while integrating technology, protection, service, and operational support throughout the vehicle lifecycle.
          </p>
          <p style={{ color: "#888", fontSize: "1rem", lineHeight: 1.8, maxWidth: "820px", marginBottom: "2.75rem" }}>
            It is the marketplace and distribution layer of a larger operating system built for professional hosts, independent rental operators, franchise rental businesses, and fleet owners. The result is more than a place to complete a reservation: it is a connected pathway between customer demand and the infrastructure required to operate vehicles professionally.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/find-a-car" style={{ backgroundColor: "#DC2626", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: ".85rem", letterSpacing: ".1em", padding: "1rem 2rem", borderRadius: "6px" }}>
              FIND A VEHICLE
            </Link>
            <Link href="/become-a-partner" style={{ backgroundColor: "transparent", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: ".85rem", letterSpacing: ".1em", padding: "1rem 2rem", borderRadius: "6px", border: "2px solid #444" }}>
              JOIN AS AN OPERATOR
            </Link>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#fff", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 3.5rem" }}>
            <p style={{ color: "#DC2626", fontWeight: 800, fontSize: ".75rem", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              How the Ecosystem Works
            </p>
            <h2 style={{ color: "#000", fontWeight: 900, fontSize: "clamp(2rem, 4.5vw, 3.4rem)", lineHeight: 1.06, letterSpacing: "-.04em", textTransform: "uppercase", marginBottom: "1rem" }}>
              Demand Connected to Operating Infrastructure
            </h2>
            <p style={{ color: "#666", fontSize: "1.05rem", lineHeight: 1.8 }}>
              Each participant has a clear role. Together, they create a stronger operating model for professional vehicle businesses and a more consistent experience for renters.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {ecosystemRoles.map((role, index) => (
              <article key={role.title} style={{ backgroundColor: index === 1 ? "#000" : "#f5f5f5", color: index === 1 ? "#fff" : "#000", padding: "2.25rem", borderRadius: "10px", borderTop: "4px solid #DC2626" }}>
                <p style={{ color: "#DC2626", fontSize: ".72rem", fontWeight: 800, letterSpacing: ".14em", marginBottom: ".9rem" }}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 850, textTransform: "uppercase", marginBottom: ".9rem" }}>{role.title}</h3>
                <p style={{ color: index === 1 ? "#aaa" : "#666", fontSize: ".95rem", lineHeight: 1.75, margin: 0 }}>{role.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#090909", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
          <p style={{ color: "#DC2626", fontWeight: 800, fontSize: ".75rem", letterSpacing: ".22em", textTransform: "uppercase", marginBottom: "1rem" }}>
            What Defines Drive Connect
          </p>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2rem, 4.5vw, 3.4rem)", lineHeight: 1.06, letterSpacing: "-.04em", textTransform: "uppercase", marginBottom: "3rem" }}>
            An Integrated Model for Professional Operators
          </h2>
          {principles.map((principle) => (
            <div key={principle.number} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "1.5rem", padding: "2rem 0", borderTop: "1px solid #222" }}>
              <span style={{ color: "#DC2626", fontWeight: 900, fontSize: "1.5rem" }}>{principle.number}</span>
              <div>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: 850, textTransform: "uppercase", marginBottom: ".6rem" }}>{principle.title}</h3>
                <p style={{ color: "#888", fontSize: ".98rem", lineHeight: 1.8, margin: 0 }}>{principle.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ backgroundColor: "#DC2626", padding: "5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-.035em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            More Than a Marketplace. An Ecosystem.
          </h2>
          <p style={{ color: "rgba(255,255,255,.85)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: "680px", margin: "0 auto 2.5rem" }}>
            Drive Connect gives professional operators a direct customer channel connected to the broader infrastructure of Global Drive Holdings.
          </p>
          <Link href="/become-a-partner" style={{ display: "inline-block", backgroundColor: "#000", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: ".85rem", letterSpacing: ".1em", padding: "1rem 2.2rem", borderRadius: "6px" }}>
            BUILD WITH DRIVE CONNECT
          </Link>
        </div>
      </section>
    </>
  );
}
