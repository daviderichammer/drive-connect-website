import Link from "next/link";

export default function HostLoginPage() {
  return (
    <>
      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "440px" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ color: "#DC2626", fontWeight: 900, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>DRIVE</span>
              <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "1.75rem", letterSpacing: "-0.02em", marginLeft: "0.375rem" }}>CONNECT</span>
            </div>
            <h1
              style={{
                color: "#ffffff",
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                marginBottom: "0.5rem",
              }}
            >
              Drive Network Partner Login
            </h1>
            <p style={{ color: "#888888", fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Manage your vehicles. Manage your business. Stay in control.
            </p>
          </div>

          {/* Login Form */}
          <div
            style={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              padding: "2.5rem",
            }}
          >
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "1px solid #333333",
                  borderRadius: "6px",
                  fontSize: "0.9375rem",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  border: "1px solid #333333",
                  borderRadius: "6px",
                  fontSize: "0.9375rem",
                  backgroundColor: "#1a1a1a",
                  color: "#ffffff",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "#DC2626", width: "16px", height: "16px" }} />
                <span style={{ fontSize: "0.8125rem", color: "#888888" }}>Remember this device</span>
              </label>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#DC2626",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              style={{
                width: "100%",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "1rem",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                marginBottom: "1.25rem",
              }}
            >
              Login
            </button>

            <div
              style={{
                borderTop: "1px solid #1a1a1a",
                paddingTop: "1.25rem",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#555555", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                Not yet a Drive Network Partner?
              </p>
              <Link
                href="/partner-application"
                style={{
                  display: "block",
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid #333333",
                  textAlign: "center",
                  transition: "border-color 0.2s ease",
                }}
              >
                Apply To Become A Partner
              </Link>
            </div>
          </div>

          {/* Philosophy insert */}
          <p
            style={{
              textAlign: "center",
              color: "#333333",
              fontSize: "0.8125rem",
              fontStyle: "italic",
              marginTop: "2rem",
            }}
          >
            &ldquo;Platforms should create trust. Not control.&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
