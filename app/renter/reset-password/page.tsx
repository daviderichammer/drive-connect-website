"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("/api/renter/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Reset failed.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/renter/login"), 2000);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
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

  return (
    <div style={{ width: "100%", maxWidth: "400px" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
          Set New Password
        </h1>
        <p style={{ color: "#666666", fontSize: "0.9375rem", margin: 0 }}>
          Choose a strong password for your account
        </p>
      </div>

      <div style={{
        backgroundColor: "#0a0a0a",
        border: "1px solid #1a1a1a",
        borderRadius: "10px",
        padding: "2rem",
      }}>
        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#00C864" }}>✓</div>
            <h2 style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.75rem" }}>
              Password Reset!
            </h2>
            <p style={{ color: "#666666", fontSize: "0.9375rem", margin: 0 }}>
              Redirecting you to login...
            </p>
          </div>
        ) : (
          <>
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
            {!token && (
              <div style={{
                backgroundColor: "rgba(193,18,31,0.1)",
                border: "1px solid rgba(193,18,31,0.3)",
                borderRadius: "6px",
                padding: "0.875rem 1rem",
                marginBottom: "1.5rem",
                color: "#ff6b6b",
                fontSize: "0.875rem",
              }}>
                Invalid or missing reset token. Please request a new reset link.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                  New Password
                </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 8 characters" style={inputStyle} />
              </div>
              <div style={{ marginBottom: "1.75rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                  Confirm Password
                </label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repeat password" style={inputStyle} />
              </div>
              <button
                type="submit"
                disabled={loading || !token}
                style={{
                  width: "100%",
                  padding: "0.9375rem",
                  backgroundColor: loading || !token ? "#333333" : "#C1121F",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: loading || !token ? "not-allowed" : "pointer",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function RenterResetPasswordPage() {
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
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            DRIVE CONNECT
          </span>
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
        <Suspense fallback={<div style={{ color: "#ffffff" }}>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </>
  );
}
