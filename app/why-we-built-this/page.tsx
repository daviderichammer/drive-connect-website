import Link from "next/link";

export const metadata = {
  title: "Why We Built This | Drive Connect",
  description: "A letter from the founding team on why Drive Connect exists — the problem we saw, the system we built, and the belief that became a company.",
};

export default function WhyWeBuiltThisPage() {
  return (
    <>
      {/* HERO */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "6rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "0.375rem 1.25rem",
              borderRadius: "4px",
              marginBottom: "2rem",
            }}
          >
            Founder Letter
          </div>
          <h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}
          >
            Why We Built This.
          </h1>
          <p
            style={{
              color: "#888888",
              fontSize: "1rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            A letter from the founding team
          </p>
        </div>
      </section>

      {/* LETTER BODY */}
      <section style={{ backgroundColor: "#ffffff", padding: "6rem 1.5rem" }}>
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {/* Opening */}
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#000000",
                lineHeight: 1.6,
                marginBottom: "2rem",
                letterSpacing: "-0.01em",
              }}
            >
              We did not set out to build a car rental company.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              We set out to solve a problem that had been bothering us for
              years. Not a product problem. Not a technology problem. An
              economic problem. A structural problem. The kind of problem that
              does not get solved by building a better app — it gets solved by
              rebuilding the system.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              The problem was this: the car rental industry had been designed
              to create conflict. Not accidentally. Structurally. The platforms
              that emerged to connect operators with renters were built on
              incentive architectures that guaranteed friction. Operators were
              squeezed. Renters were overcharged. The platform collected the
              difference.
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              borderLeft: "4px solid #DC2626",
              paddingLeft: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#000000",
                lineHeight: 1.6,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;The platforms were not broken. They were working exactly
              as designed. The design was the problem.&rdquo;
            </p>
          </div>

          {/* Body */}
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              We watched operators who owned fleets of vehicles — people who
              had invested real capital, built real expertise, and created real
              value — surrender 25 to 35 percent of their revenue to platforms
              that provided infrastructure they did not own and relationships
              they were not allowed to keep.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              We watched renters pay premium prices for commodity experiences.
              We watched platforms change their rules unilaterally, restrict
              operators arbitrarily, and position themselves as indispensable
              intermediaries in transactions where their only contribution was
              the introduction.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              We kept asking the same question: what would this market look
              like if it were designed to work for the people in it?
            </p>
          </div>

          {/* Second divider */}
          <div
            style={{
              borderLeft: "4px solid #DC2626",
              paddingLeft: "1.5rem",
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#000000",
                lineHeight: 1.6,
                margin: 0,
                fontStyle: "italic",
              }}
            >
              &ldquo;What would this market look like if it were designed to
              work for the people in it?&rdquo;
            </p>
          </div>

          {/* The answer */}
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              The answer required rethinking everything from first principles.
              Not the app. Not the pricing page. The incentive structure. The
              fee model. The relationship between platform, operator, and
              renter. The mechanism by which trust is established and
              maintained. The architecture of the market itself.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              We built Drive Connect to answer that question. Not as a startup
              looking for a market. As a team that had identified a structural
              failure and decided to fix it.
            </p>
          </div>

          {/* Beliefs section */}
          <div
            style={{
              backgroundColor: "#000000",
              borderRadius: "12px",
              padding: "2.5rem",
              marginBottom: "3rem",
            }}
          >
            <h3
              style={{
                color: "#DC2626",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "1.5rem",
              }}
            >
              The Beliefs That Became Drive Connect
            </h3>
            {[
              "We believe the car rental industry was built wrong.",
              "We believe renters pay too much because operators earn too little.",
              "We believe platforms create conflict when they should create connection.",
              "We believe markets function best when incentives remain aligned.",
              "We believe trust should replace conflict.",
              "We believe participants deserve independence.",
              "We believe business works best when everyone succeeds together.",
            ].map((belief, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "0.875rem 0",
                  borderBottom: i < 6 ? "1px solid #1a1a1a" : "none",
                }}
              >
                <span
                  style={{
                    color: "#DC2626",
                    fontWeight: 900,
                    fontSize: "1rem",
                    flexShrink: 0,
                    paddingTop: "0.125rem",
                  }}
                >
                  →
                </span>
                <p
                  style={{
                    color: "#cccccc",
                    fontSize: "0.9375rem",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {belief}
                </p>
              </div>
            ))}
          </div>

          {/* Closing */}
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              That belief became Drive Connect.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              We built the marketplace and transaction infrastructure. We built
              verification and reservation workflows for professional operators
              and their customers. We connected that demand layer to vehicle
              intelligence, protection, service, parts, analytics, and the broader
              operating capabilities of the Global Drive Holdings ecosystem.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "1.5rem",
              }}
            >
              We are not done. The professional operator network is early and the
              ecosystem continues to expand. The foundation is a connected model
              designed to support the vehicle before, during, and after every
              reservation.
            </p>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#333333",
                lineHeight: 1.9,
                marginBottom: "2.5rem",
              }}
            >
              That is why we built this.
            </p>
          </div>

          {/* Signature */}
          <div
            style={{
              borderTop: "1px solid #e5e7eb",
              paddingTop: "2rem",
            }}
          >
            <p
              style={{
                fontSize: "1.0625rem",
                color: "#000000",
                fontWeight: 700,
                marginBottom: "0.25rem",
              }}
            >
              — The Founding Team
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#888888",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Drive Connect
            </p>
          </div>
        </div>
      </section>

      {/* NAVIGATION LINKS */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "4rem 1.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p
            style={{
              color: "#888888",
              fontSize: "0.875rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: "2rem",
            }}
          >
            Continue Reading
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
                padding: "1rem 2rem",
                borderRadius: "6px",
              }}
            >
              THE MARKET PRINCIPLE
            </Link>
            <Link
              href="/vision"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2rem",
                borderRadius: "6px",
                border: "2px solid #333333",
              }}
            >
              OUR VISION
            </Link>
            <Link
              href="/find-a-car"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "1rem 2rem",
                borderRadius: "6px",
                border: "2px solid #333333",
              }}
            >
              ENTER THE NETWORK
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
