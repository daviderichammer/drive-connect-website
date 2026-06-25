"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/host/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Request failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#000000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 1.5rem",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}>
              DRIVE CONNECT
            </h1>
          </Link>
          <p style={{ color: "#C1121F", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
            Drive Network Partner Portal
          </p>
        </div>

        {submitted ? (
          <div style={{
            backgroundColor: "#111111",
            borderRadius: "8px",
            padding: "40px",
            border: "1px solid #1a1a1a",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>
            <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
              Check Your Email
            </h2>
            <p style={{ color: "#888888", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
              If an account exists for <strong style={{ color: "#ffffff" }}>{email}</strong>, 
              you will receive a password reset link shortly.
            </p>
            <Link
              href="/host/login"
              style={{
                color: "#C1121F",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              ← Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 8px" }}>
                Reset Password
              </h2>
              <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>
                Enter your email to receive a reset link
              </p>
            </div>

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
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#888888",
                    marginBottom: "0.375rem",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                      boxSizing: "border-box",
                    }}
                  />
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
                    marginBottom: "1rem",
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div style={{ textAlign: "center" }}>
                  <Link href="/host/login" style={{ color: "#888888", fontSize: "0.875rem", textDecoration: "none" }}>
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
