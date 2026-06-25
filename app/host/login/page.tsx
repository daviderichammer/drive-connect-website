"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HostLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/host/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      // Redirect based on onboarding status
      if (!data.host.onboardingCompleted) {
        router.push("/host/onboarding");
      } else {
        router.push("/host/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "1px solid #333333",
    borderRadius: "6px",
    fontSize: "0.9375rem",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#888888",
    marginBottom: "0.375rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  return (
    <>
      {/* Navigation */}
      <nav style={{
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "#000000",
        borderBottom: "1px solid #111111",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{
            color: "#ffffff",
            fontSize: "1.125rem",
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "Inter, sans-serif",
          }}>
            DRIVE CONNECT
          </span>
        </Link>
        <Link
          href="/partner-application"
          style={{
            color: "#888888",
            fontSize: "0.8125rem",
            fontWeight: 600,
            textDecoration: "none",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Apply to Partner
        </Link>
      </nav>

      {/* Main Content */}
      <section style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 1.5rem 60px",
        fontFamily: "Inter, sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <p style={{
              color: "#C1121F",
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}>
              Drive Network Partner Portal
            </p>
            <h1 style={{
              color: "#ffffff",
              fontSize: "1.75rem",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: "0.75rem",
            }}>
              Partner Login
            </h1>
            <p style={{ color: "#555555", fontSize: "0.9375rem" }}>
              Manage your vehicles. Manage your business. Stay in control.
            </p>
          </div>

          {/* Login Card */}
          <div style={{
            backgroundColor: "#111111",
            borderRadius: "8px",
            padding: "2rem",
            border: "1px solid #1a1a1a",
          }}>
            {error && (
              <div style={{
                backgroundColor: "rgba(193, 18, 31, 0.1)",
                border: "1px solid #C1121F",
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "16px",
                color: "#ff4444",
                fontSize: "14px",
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    style={{ accentColor: "#C1121F", width: "16px", height: "16px" }}
                  />
                  <span style={{ fontSize: "0.8125rem", color: "#888888" }}>Remember this device</span>
                </label>
                <Link
                  href="/host/forgot-password"
                  style={{
                    color: "#C1121F",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: loading ? "#666666" : "#C1121F",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "1rem",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Inter, sans-serif",
                  marginBottom: "1.25rem",
                }}
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>

            <div style={{
              borderTop: "1px solid #1a1a1a",
              paddingTop: "1.25rem",
              textAlign: "center",
            }}>
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
                }}
              >
                Apply To Become A Partner
              </Link>
            </div>
          </div>

          <p style={{
            textAlign: "center",
            color: "#333333",
            fontSize: "0.8125rem",
            fontStyle: "italic",
            marginTop: "2rem",
          }}>
            &ldquo;Platforms should create trust. Not control.&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
