import Link from "next/link";

export const metadata = {
  title: "Drive Connect — The Marketplace Built for Professional Vehicle Operators",
  description:
    "Drive Connect is the customer-facing marketplace of the Global Drive Holdings ecosystem, connecting professional vehicle operators with customers through integrated technology, protection, service, and operational infrastructure.",
};

const markets = [
  {
    title: "Professional Turo Hosts",
    stat: "140,000+",
    detail: "professional and emerging professional hosts across North America",
  },
  {
    title: "Independent Rental Operators",
    stat: "3,000+",
    detail: "independent rental companies building durable local and regional businesses",
  },
  {
    title: "Franchise Rental Companies",
    stat: "Established Networks",
    detail: "operators across brands such as U-Save, ACE, Priceless, and Easirent",
  },
  {
    title: "Fleet Operators",
    stat: "Multi-Vehicle",
    detail: "professional fleets that need demand, intelligence, protection, and lifecycle support",
  },
  {
    title: "Dealership Loaner Fleets",
    stat: "Future Opportunity",
    detail: "dealer-managed fleets positioned to participate in a connected operating ecosystem",
  },
];

const operatingGaps = [
  "Customer acquisition",
  "Vehicle intelligence",
  "Protection",
  "Service coordination",
  "Parts access",
  "Performance analytics",
  "Recurring revenue",
];

const ecosystem = [
  { name: "Vehicle", description: "The revenue-producing asset" },
  { name: "Drive KeZ", description: "Connected vehicle intelligence" },
  { name: "Drive Cloud", description: "Data and operating visibility" },
  { name: "Drive Protection", description: "Integrated protection support" },
  { name: "Drive Connect", description: "Customer demand and transactions" },
  { name: "Drive Service Network", description: "Lifecycle service coordination" },
  { name: "Drive Parts Network", description: "Parts access and supply support" },
];

const technologyCapabilities = [
  { title: "GPS Intelligence", body: "Connected location visibility designed for professional fleet operations." },
  { title: "Theft Recovery", body: "Vehicle intelligence that supports faster, more informed recovery action." },
  { title: "Smoking Mitigation", body: "Operational signals that help protect vehicle condition and customer experience." },
  { title: "Diagnostics", body: "Actionable vehicle health data that supports uptime and proactive maintenance." },
  { title: "Key Management", body: "Connected access infrastructure designed to simplify vehicle handoffs." },
];

const revenueChannels = [
  "Booking revenue",
  "Drive KeZ revenue",
  "Protection revenue",
  "Service revenue",
  "Parts revenue",
  "Subscription revenue",
];

export default function HomePage() {
  return (
    <>
      <section className="dc-hero">
        <div className="dc-hero-image" />
        <div className="dc-hero-overlay" />
        <div className="dc-shell dc-hero-content">
          <p className="dc-eyebrow">Drive Connect · A Global Drive Holdings Company</p>
          <h1>
            The Marketplace Built for <span>Professional Vehicle Operators</span>
          </h1>
          <p className="dc-hero-copy">
            Drive Connect connects professional hosts, independent rental operators, and fleet owners directly with customers while integrating vehicle intelligence, protection, service, and operational infrastructure.
          </p>
          <p className="dc-hero-statement">More than a marketplace. An ecosystem.</p>
          <div className="dc-actions">
            <Link className="dc-button dc-button-primary" href="/find-a-car">
              FIND A VEHICLE
            </Link>
            <Link className="dc-button dc-button-outline" href="/become-a-partner">
              JOIN AS AN OPERATOR
            </Link>
          </div>
        </div>
      </section>

      <section className="dc-section dc-section-white">
        <div className="dc-shell">
          <div className="dc-heading">
            <p className="dc-eyebrow">Built Around Professional Operators</p>
            <h2>One Marketplace. Multiple Professional Markets.</h2>
            <p>
              Drive Connect is designed for businesses that operate vehicles—not for an anonymous sharing economy. The platform brings professional supply and customer demand into one connected operating ecosystem.
            </p>
          </div>
          <div className="dc-market-grid">
            {markets.map((market) => (
              <article className="dc-card dc-market-card" key={market.title}>
                <p className="dc-card-stat">{market.stat}</p>
                <h3>{market.title}</h3>
                <p>{market.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dc-section dc-section-dark">
        <div className="dc-shell dc-split">
          <div>
            <p className="dc-eyebrow">Why Drive Connect Exists</p>
            <h2>Reservations Are Only One Part of the Operator’s Business.</h2>
            <p className="dc-lead">
              Traditional booking platforms help complete a reservation. Professional operators need infrastructure that supports the full vehicle lifecycle before, during, and after every booking.
            </p>
            <p className="dc-muted">
              Drive Connect was built to connect demand with the intelligence, protection, service, parts, analytics, and recurring-revenue systems required to operate a stronger vehicle business.
            </p>
          </div>
          <div className="dc-gap-grid">
            {operatingGaps.map((gap, index) => (
              <div className="dc-gap-item" key={gap}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{gap}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dc-section dc-section-gray">
        <div className="dc-shell">
          <div className="dc-heading">
            <p className="dc-eyebrow">The Connected Operator Model</p>
            <h2>Every Vehicle Connected to an Operating Ecosystem.</h2>
            <p>
              The Global Drive Holdings ecosystem is designed to connect the vehicle, the operator, and the customer through coordinated technology and lifecycle infrastructure.
            </p>
          </div>
          <div className="dc-flow" aria-label="Connected operator model">
            {ecosystem.map((item, index) => (
              <div className="dc-flow-step" key={item.name}>
                <div className="dc-flow-card">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                {index < ecosystem.length - 1 && <div className="dc-flow-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dc-section dc-section-white">
        <div className="dc-shell">
          <div className="dc-heading dc-heading-left">
            <p className="dc-eyebrow">Technology Standards</p>
            <h2>Drive KeZ Connects Intelligence to Every Stage of the Vehicle Lifecycle.</h2>
            <p>
              Drive Connect is designed to work with Drive KeZ as the connected intelligence layer for participating vehicles. This creates a more informed operating environment for operators, customers, protection partners, and service providers.
            </p>
          </div>
          <div className="dc-tech-grid">
            {technologyCapabilities.map((capability) => (
              <article className="dc-card" key={capability.title}>
                <div className="dc-red-line" />
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="dc-section dc-section-red">
        <div className="dc-shell">
          <div className="dc-heading dc-heading-on-red">
            <p className="dc-eyebrow dc-eyebrow-white">Revenue Density</p>
            <h2>One Operator. Multiple Channels.</h2>
            <p>
              A connected ecosystem creates more ways to generate value from each operator relationship while giving operators more infrastructure to grow their businesses.
            </p>
          </div>
          <div className="dc-revenue-grid">
            {revenueChannels.map((channel, index) => (
              <div className="dc-revenue-item" key={channel}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{channel}</p>
              </div>
            ))}
          </div>
          <p className="dc-revenue-close">
            One operator. Multiple channels. Multiple recurring revenue opportunities.
          </p>
        </div>
      </section>

      <section className="dc-section dc-section-dark">
        <div className="dc-shell dc-split dc-capital-split">
          <div>
            <p className="dc-eyebrow">Capital-Efficient Marketplace</p>
            <h2>Built to Scale Through Participation, Not Vehicle Ownership.</h2>
          </div>
          <div>
            <p className="dc-lead">
              Drive Connect does not need to own a national fleet to serve a national market.
            </p>
            <p className="dc-muted">
              The marketplace scales through professional operators, connected technology, strategic relationships, and ecosystem participation. Operators retain their vehicles and businesses while gaining access to customer demand and integrated lifecycle infrastructure.
            </p>
            <Link className="dc-text-link" href="/become-a-partner">
              EXPLORE OPERATOR PARTNERSHIP →
            </Link>
          </div>
        </div>
      </section>

      <section className="dc-section dc-section-white">
        <div className="dc-shell">
          <div className="dc-heading">
            <p className="dc-eyebrow">Competitive Positioning</p>
            <h2>Beyond the Booking.</h2>
            <p>
              Traditional platforms focus on booking activity. Drive Connect is designed to support the entire vehicle lifecycle through a broader operating ecosystem.
            </p>
          </div>
          <div className="dc-position-grid">
            <div className="dc-position-card dc-position-card-muted">
              <p className="dc-position-label">Traditional Booking Platforms</p>
              <h3>Reservation-Focused</h3>
              <p>Customer discovery, availability, pricing, and transaction completion.</p>
            </div>
            <div className="dc-position-card dc-position-card-featured">
              <p className="dc-position-label">Drive Connect</p>
              <h3>Vehicle Lifecycle-Focused</h3>
              <p>
                Customer demand integrated with vehicle intelligence, protection, service, parts, analytics, and operating support.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dc-final">
        <div className="dc-shell">
          <p className="dc-eyebrow">The Global Drive Holdings Ecosystem</p>
          <h2>Professional Vehicles Deserve Professional Infrastructure.</h2>
          <p>
            Drive Connect brings operators and customers together while connecting every transaction to a larger system built for vehicle performance, protection, service, and long-term growth.
          </p>
          <div className="dc-actions dc-actions-center">
            <Link className="dc-button dc-button-primary" href="/find-a-car">
              BROWSE VEHICLES
            </Link>
            <Link className="dc-button dc-button-outline" href="/become-a-partner">
              BUILD WITH DRIVE CONNECT
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .dc-shell { width: 100%; max-width: 1280px; margin: 0 auto; }
        .dc-hero { position: relative; min-height: 720px; background: #000; display: flex; align-items: center; overflow: hidden; padding: 7rem 1.5rem; }
        .dc-hero-image { position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=85'); background-size: cover; background-position: center; opacity: .46; }
        .dc-hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.98) 0%, rgba(0,0,0,.86) 48%, rgba(0,0,0,.26) 100%); }
        .dc-hero-content { position: relative; z-index: 2; }
        .dc-eyebrow { color: #DC2626; font-size: .75rem; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; margin: 0 0 1.25rem; }
        .dc-hero h1 { color: #fff; max-width: 900px; font-size: clamp(2.6rem, 6.5vw, 5.75rem); line-height: .98; letter-spacing: -.055em; text-transform: uppercase; font-weight: 900; margin: 0 0 1.75rem; }
        .dc-hero h1 span { color: #DC2626; }
        .dc-hero-copy { color: #ddd; max-width: 780px; font-size: clamp(1rem, 2vw, 1.25rem); line-height: 1.8; margin: 0 0 1rem; }
        .dc-hero-statement { color: #fff; font-size: 1.1rem; font-weight: 800; letter-spacing: .02em; margin: 0 0 2.4rem; }
        .dc-actions { display: flex; flex-wrap: wrap; gap: 1rem; }
        .dc-actions-center { justify-content: center; }
        .dc-button { display: inline-block; border-radius: 6px; padding: 1rem 2rem; text-decoration: none; font-size: .82rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .dc-button-primary { color: #fff; background: #DC2626; border: 2px solid #DC2626; }
        .dc-button-outline { color: #fff; background: transparent; border: 2px solid #555; }
        .dc-section { padding: 6rem 1.5rem; }
        .dc-section-white { background: #fff; color: #000; }
        .dc-section-gray { background: #f5f5f5; color: #000; }
        .dc-section-dark { background: #090909; color: #fff; }
        .dc-section-red { background: #DC2626; color: #fff; }
        .dc-heading { max-width: 820px; margin: 0 auto 3.5rem; text-align: center; }
        .dc-heading-left { margin-left: 0; text-align: left; }
        .dc-heading h2, .dc-split h2, .dc-final h2 { font-size: clamp(2rem, 4.5vw, 3.5rem); line-height: 1.05; letter-spacing: -.04em; text-transform: uppercase; font-weight: 900; margin: 0 0 1.25rem; }
        .dc-heading > p:last-child { color: #666; font-size: 1.05rem; line-height: 1.8; }
        .dc-heading-on-red > p:last-child { color: rgba(255,255,255,.82); }
        .dc-eyebrow-white { color: #fff; }
        .dc-market-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.25rem; }
        .dc-market-card { grid-column: span 2; }
        .dc-market-card:nth-child(4) { grid-column: 2 / span 2; }
        .dc-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1.8rem; box-shadow: 0 4px 18px rgba(0,0,0,.05); }
        .dc-card h3 { font-size: 1.05rem; line-height: 1.3; text-transform: uppercase; font-weight: 850; margin: 0 0 .75rem; }
        .dc-card p { color: #666; font-size: .92rem; line-height: 1.7; margin: 0; }
        .dc-card-stat { color: #DC2626 !important; font-size: .73rem !important; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; margin-bottom: .85rem !important; }
        .dc-split { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
        .dc-lead { color: #ddd; font-size: 1.16rem; line-height: 1.8; margin: 0 0 1.25rem; }
        .dc-muted { color: #888; font-size: 1rem; line-height: 1.8; margin: 0; }
        .dc-gap-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #222; }
        .dc-gap-item { display: flex; align-items: center; gap: 1rem; padding: 1.2rem 0; border-bottom: 1px solid #222; }
        .dc-gap-item:nth-child(odd) { padding-right: 1.25rem; }
        .dc-gap-item:nth-child(even) { padding-left: 1.25rem; border-left: 1px solid #222; }
        .dc-gap-item span { color: #DC2626; font-size: .72rem; font-weight: 800; letter-spacing: .12em; }
        .dc-gap-item p { color: #eee; font-size: .95rem; font-weight: 700; margin: 0; }
        .dc-flow { display: flex; align-items: stretch; overflow-x: auto; padding: .5rem 0 1rem; }
        .dc-flow-step { min-width: 0; flex: 1; display: flex; align-items: center; }
        .dc-flow-card { min-width: 145px; flex: 1; height: 100%; background: #fff; border: 1px solid #ddd; border-top: 4px solid #DC2626; border-radius: 8px; padding: 1.35rem 1rem; }
        .dc-flow-card span { color: #DC2626; font-size: .7rem; font-weight: 800; letter-spacing: .12em; }
        .dc-flow-card h3 { font-size: .88rem; line-height: 1.25; text-transform: uppercase; font-weight: 850; margin: .65rem 0; }
        .dc-flow-card p { color: #777; font-size: .78rem; line-height: 1.55; margin: 0; }
        .dc-flow-arrow { color: #DC2626; font-size: 1.6rem; font-weight: 900; padding: 0 .45rem; }
        .dc-tech-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.25rem; }
        .dc-red-line { width: 36px; height: 3px; background: #DC2626; margin-bottom: 1.2rem; }
        .dc-revenue-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,.24); border: 1px solid rgba(255,255,255,.24); max-width: 980px; margin: 0 auto; }
        .dc-revenue-item { background: #DC2626; padding: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .dc-revenue-item span { color: rgba(255,255,255,.55); font-size: .72rem; font-weight: 800; }
        .dc-revenue-item p { font-weight: 800; text-transform: uppercase; font-size: .85rem; letter-spacing: .04em; margin: 0; }
        .dc-revenue-close { max-width: 900px; margin: 2.8rem auto 0; text-align: center; color: #fff; font-size: clamp(1.25rem, 2.5vw, 1.75rem); line-height: 1.4; font-weight: 850; text-transform: uppercase; }
        .dc-capital-split { align-items: start; }
        .dc-text-link { display: inline-block; color: #DC2626; text-decoration: none; font-size: .8rem; font-weight: 800; letter-spacing: .09em; margin-top: 2rem; }
        .dc-position-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 980px; margin: 0 auto; }
        .dc-position-card { border-radius: 10px; padding: 2.5rem; }
        .dc-position-card-muted { background: #f5f5f5; border: 1px solid #ddd; }
        .dc-position-card-featured { background: #000; border: 1px solid #000; color: #fff; }
        .dc-position-label { color: #DC2626 !important; font-size: .72rem !important; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        .dc-position-card h3 { font-size: 1.5rem; text-transform: uppercase; font-weight: 900; margin: 1rem 0; }
        .dc-position-card p { color: #666; line-height: 1.7; margin: 0; }
        .dc-position-card-featured p:last-child { color: #aaa; }
        .dc-final { background: #000; color: #fff; padding: 6rem 1.5rem; text-align: center; border-top: 1px solid #1a1a1a; }
        .dc-final > div { max-width: 900px; }
        .dc-final > div > p:not(.dc-eyebrow) { color: #999; font-size: 1.05rem; line-height: 1.8; max-width: 720px; margin: 0 auto 2.5rem; }
        @media (max-width: 1024px) {
          .dc-market-grid { grid-template-columns: repeat(2, 1fr); }
          .dc-market-card, .dc-market-card:nth-child(4) { grid-column: auto; }
          .dc-market-card:last-child { grid-column: 1 / -1; }
          .dc-tech-grid { grid-template-columns: repeat(2, 1fr); }
          .dc-tech-grid .dc-card:last-child { grid-column: 1 / -1; }
          .dc-flow { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; overflow: visible; }
          .dc-flow-step { min-width: 0; }
          .dc-flow-arrow { display: none; }
        }
        @media (max-width: 760px) {
          .dc-hero { min-height: 680px; padding: 5rem 1.25rem; }
          .dc-hero-overlay { background: rgba(0,0,0,.82); }
          .dc-section, .dc-final { padding: 4.5rem 1.25rem; }
          .dc-split { grid-template-columns: 1fr; gap: 3rem; }
          .dc-market-grid, .dc-tech-grid, .dc-position-grid, .dc-revenue-grid, .dc-flow { grid-template-columns: 1fr; }
          .dc-market-card:last-child, .dc-tech-grid .dc-card:last-child { grid-column: auto; }
          .dc-gap-grid { grid-template-columns: 1fr; }
          .dc-gap-item:nth-child(odd), .dc-gap-item:nth-child(even) { padding-left: 0; padding-right: 0; border-left: 0; }
          .dc-button { width: 100%; text-align: center; }
          .dc-heading { margin-bottom: 2.5rem; }
        }
      `}</style>
    </>
  );
}
