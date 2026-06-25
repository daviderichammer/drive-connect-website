"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RenterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/renter/login", {
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
      router.push("/renter/dashboard");
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
      <nav style={{
        position: "fixed" as const,
        top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: "#000000",
        borderBottom: "1px solid #111111",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            DRIVE CONNECT
          </span>
        </Link>
        <Link href="/renter/register" style={{ color: "#888888", fontSize: "0.875rem", textDecoration: "none" }}>
          Create Account
        </Link>
      </nav>

      <div style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 1rem 2rem",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-block",
              backgroundColor: "rgba(193,18,31,0.1)",
              border: "1px solid rgba(193,18,31,0.2)",
              borderRadius: "6px",
              padding: "6px 14px",
              marginBottom: "1.25rem",
            }}>
              <span style={{ color: "#C1121F", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Renter Portal
              </span>
            </div>
            <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
              Welcome Back
            </h1>
            <p style={{ color: "#666666", fontSize: "0.9375rem", margin: 0 }}>
              Sign in to manage your trips
            </p>
          </div>

          <div style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "10px",
            padding: "2rem",
          }}>
            {error && (
              <div style={{
                backgroundColor: "rgba(193,18,31,0.1)",
                border: "1px solid rgba(193,18,31,0.3)",
                borderRadius: "6px",
                padding: "0.875rem 1rem",
                marginBottom: "1.5rem",
                color: "#ff6b6b",
                fontSize: "0.875rem",
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={inputStyle}
                />
                <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                  <Link href="/renter/forgot-password" style={{ color: "#C1121F", fontSize: "0.8125rem", textDecoration: "none" }}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.9375rem",
                  backgroundColor: loading ? "#333333" : "#C1121F",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #1a1a1a" }}>
              <p style={{ color: "#666666", fontSize: "0.875rem", margin: 0 }}>
                Don&apos;t have an account?{" "}
                <Link href="/renter/register" style={{ color: "#C1121F", textDecoration: "none", fontWeight: 600 }}>
                  Create one free
                </Link>
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <p style={{ color: "#444444", fontSize: "0.8125rem", margin: 0 }}>
              Are you a host?{" "}
              <Link href="/host/login" style={{ color: "#666666", textDecoration: "none" }}>
                Host login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
