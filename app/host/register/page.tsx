"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [tokenData, setTokenData] = useState<{ businessName: string; ownerName: string; email: string } | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    fetch(`/api/host/register?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setTokenValid(data.valid);
        if (data.valid) {
          setTokenData({ businessName: data.businessName, ownerName: data.ownerName, email: data.email });
        }
      })
      .catch(() => setTokenValid(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/host/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      router.push("/host/onboarding");
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

  if (tokenValid === null) {
    return (
      <div style={{ textAlign: "center", color: "#555555", padding: "60px" }}>
        Validating your registration link...
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div style={{
        backgroundColor: "#111111",
        borderRadius: "8px",
        padding: "40px",
        border: "1px solid #1a1a1a",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
          Invalid or Expired Link
        </h2>
        <p style={{ color: "#888888", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
          This registration link is invalid or has already been used. 
          If you already registered, please log in. Otherwise, contact support.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href="/host/login"
            style={{
              backgroundColor: "#C1121F",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "#111111",
      borderRadius: "8px",
      padding: "2rem",
      border: "1px solid #1a1a1a",
    }}>
      {tokenData && (
        <div style={{
          backgroundColor: "rgba(0, 200, 100, 0.05)",
          border: "1px solid rgba(0, 200, 100, 0.2)",
          borderRadius: "6px",
          padding: "14px 16px",
          marginBottom: "24px",
        }}>
          <p style={{ color: "#00C864", fontSize: "13px", fontWeight: 700, margin: "0 0 4px" }}>
            ✓ Application Approved
          </p>
          <p style={{ color: "#888888", fontSize: "13px", margin: 0 }}>
            Welcome, {tokenData.ownerName}. Setting up account for <strong style={{ color: "#ffffff" }}>{tokenData.businessName}</strong>
          </p>
        </div>
      )}

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
        {tokenData && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Email (from application)</label>
            <input
              type="email"
              value={tokenData.email}
              disabled
              style={{ ...inputStyle, color: "#888888", cursor: "not-allowed" }}
            />
          </div>
        )}

        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Create Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repeat your password"
            style={inputStyle}
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
          }}
        >
          {loading ? "Creating Account..." : "Create Account & Continue"}
        </button>
      </form>

      <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
        <p style={{ color: "#555555", fontSize: "0.8125rem" }}>
          Already have an account?{" "}
          <Link href="/host/login" style={{ color: "#C1121F", textDecoration: "none", fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function HostRegisterPage() {
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
      <div style={{ width: "100%", maxWidth: "460px" }}>
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
            Drive Network Partner Program
          </p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 8px" }}>
            Complete Your Registration
          </h2>
          <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>
            Set up your Drive Network Partner account
          </p>
        </div>

        <Suspense fallback={<div style={{ color: "#555555", textAlign: "center" }}>Loading...</div>}>
          <RegisterForm />
        </Suspense>

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
    </div>
  );
}
