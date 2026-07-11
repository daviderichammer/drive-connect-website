import Link from "next/link";

export const metadata = {
  title: "Why Drive Connect Exists | Professional Vehicle Infrastructure",
  description:
    "Drive Connect exists to connect customer demand with the technology, protection, service, parts, analytics, and operating support professional vehicle businesses need.",
};

const needs = [
  {
    title: "Customer Demand",
    description: "A professional marketplace where renters can discover and reserve operator-provided vehicles.",
  },
  {
    title: "Vehicle Intelligence",
    description: "Connected visibility that supports vehicle location, diagnostics, condition, recovery, and access workflows.",
  },
  {
    title: "Protection",
    description: "Integrated support designed to strengthen confidence throughout the transaction and operating lifecycle.",
  },
  {
    title: "Service and Parts",
    description: "Coordinated infrastructure that supports uptime, maintenance, repair, and access to essential parts.",
  },
  {
    title: "Operating Visibility",
    description: "Data and analytics that help professional operators make more informed fleet decisions.",
  },
  {
    title: "Revenue Density",
    description: "Multiple connected channels designed to create more value from every participating operator relationship.",
  },
];

const principles = [
  ["Professional Focus", "Build around the needs of professional hosts, independent rental companies, franchise operators, and fleet owners."],
  ["Connected Infrastructure", "Treat customer demand, vehicle intelligence, protection, service, parts, and analytics as one coordinated operating environment."],
  ["Lifecycle Thinking", "Support the vehicle before, during, and after each reservation—not only at the point of booking."],
  ["Operator Participation", "Scale through strong operators and strategic relationships rather than through centralized vehicle ownership."],
  ["Clear Responsibilities", "Keep operator, customer, marketplace, protection, and service-provider roles understandable throughout the experience."],
  ["Shared Growth", "Create an ecosystem in which stronger operators can deliver stronger customer experiences and build durable businesses."],
];

export default function WhyWeExistPage() {
  return (
    <>
      <section style={{ position: "relative", backgroundColor: "#000", padding: "7rem 1.5rem", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1493238792000-8113da705763?w=1920&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.14 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "960px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#DC2626", fontWeight: 800, fontSize: ".75rem", letterSpacing: ".22em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            Why Drive Connect Exists
          </p>
          <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2.5rem, 7vw, 5rem)", letterSpacing: "-.045em", lineHeight: 1, textTransform: "uppercase", marginBottom: "1.75rem" }}>
            Professional Vehicles Need <span style={{ color: "#DC2626" }}>Professional Infrastructure.</span>
          </h1>
          <p style={{ color: "#bbb", fontSize: "clamp(1.05rem, 2.4vw, 1.25rem)", lineHeight: 1.8, maxWidth: "780px", margin: "0 auto" }}>
            Drive Connect exists to connect customer demand with the broader infrastructure required to operate vehicles professionally throughout their lifecycle.
          </p>
        </div>
      </section>

      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#fff" }}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <div style={{ maxWidth: "800px", marginBottom: "3.5rem" }}>
            <p style={{ color: "#DC2626", fontWeight: 800, fontSize: ".75rem", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              The Operating Reality
            </p>
            <h2 style={{ color: "#000", fontWeight: 900, fontSize: "clamp(2rem, 4.5vw, 3.4rem)", lineHeight: 1.06, letterSpacing: "-.04em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              A Reservation Is a Moment. A Vehicle Business Operates Every Day.
            </h2>
            <p style={{ color: "#666", fontSize: "1.05rem", lineHeight: 1.8 }}>
              Professional operators must acquire customers, manage vehicles, maintain availability, protect assets, coordinate service, source parts, understand performance, and build recurring revenue. Drive Connect is designed as the customer-facing marketplace within an ecosystem built to address those connected needs.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {needs.map((need, index) => (
              <article key={need.title} style={{ backgroundColor: "#f5f5f5", border: "1px solid #e5e7eb", borderTop: "4px solid #DC2626", borderRadius: "10px", padding: "2rem" }}>
                <p style={{ color: "#DC2626", fontWeight: 800, fontSize: ".72rem", letterSpacing: ".12em", marginBottom: ".8rem" }}>{String(index + 1).padStart(2, "0")}</p>
                <h3 style={{ color: "#000", fontWeight: 850, fontSize: "1.05rem", textTransform: "uppercase", marginBottom: ".75rem" }}>{need.title}</h3>
                <p style={{ color: "#666", fontSize: ".94rem", lineHeight: 1.75, margin: 0 }}>{need.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#090909" }}>
        <div style={{ maxWidth: "1020px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 3.5rem" }}>
            <p style={{ color: "#DC2626", fontWeight: 800, fontSize: ".75rem", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              The Model
            </p>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2rem, 4.5vw, 3.4rem)", lineHeight: 1.06, letterSpacing: "-.04em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              More Than a Marketplace. An Ecosystem.
            </h2>
            <p style={{ color: "#888", fontSize: "1.03rem", lineHeight: 1.8 }}>
              Drive Connect serves as the marketplace and demand layer. Drive KeZ, Drive Cloud, Drive Protection, Drive Service Network, and Drive Parts Network extend support across the connected vehicle lifecycle.
            </p>
          </div>
          <div style={{ borderTop: "1px solid #222" }}>
            {principles.map(([title, description], index) => (
              <div key={title} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: "1.5rem", padding: "1.8rem 0", borderBottom: "1px solid #222" }}>
                <span style={{ color: "#DC2626", fontWeight: 900 }}>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 style={{ color: "#fff", fontWeight: 850, fontSize: "1.05rem", textTransform: "uppercase", marginBottom: ".55rem" }}>{title}</h3>
                  <p style={{ color: "#888", fontSize: ".95rem", lineHeight: 1.75, margin: 0 }}>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#DC2626", padding: "5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-.04em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            Connect to the Full Operating Ecosystem.
          </h2>
          <p style={{ color: "rgba(255,255,255,.86)", lineHeight: 1.8, marginBottom: "2.25rem" }}>
            Find a professional vehicle or bring your vehicle business into Drive Connect.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/find-a-car" style={{ backgroundColor: "#000", color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: ".82rem", letterSpacing: ".1em", padding: "1rem 2rem", borderRadius: "6px" }}>FIND A VEHICLE</Link>
            <Link href="/become-a-partner" style={{ backgroundColor: "#fff", color: "#000", textDecoration: "none", fontWeight: 800, fontSize: ".82rem", letterSpacing: ".1em", padding: "1rem 2rem", borderRadius: "6px" }}>JOIN AS AN OPERATOR</Link>
          </div>
        </div>
      </section>
    </>
  );
}
