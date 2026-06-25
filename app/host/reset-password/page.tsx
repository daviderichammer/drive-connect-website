"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
    fetch(`/api/host/reset-password?token=${token}`)
      .then((res) => res.json())
      .then((data) => setTokenValid(data.valid))
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
      const res = await fetch("/api/host/reset-password", {
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
      setTimeout(() => router.push("/host/login"), 3000);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return <div style={{ color: "#555555", textAlign: "center", padding: "40px" }}>Validating reset link...</div>;
  }

  if (tokenValid === false) {
    return (
      <div style={{ backgroundColor: "#111111", borderRadius: "8px", padding: "40px", border: "1px solid #1a1a1a", textAlign: "center" }}>
        <h2 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>Invalid or Expired Link</h2>
        <p style={{ color: "#888888", fontSize: "14px", marginBottom: "24px" }}>This reset link has expired or is invalid.</p>
        <Link href="/host/forgot-password" style={{ color: "#C1121F", textDecoration: "none", fontWeight: 600 }}>
          Request a New Reset Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ backgroundColor: "#111111", borderRadius: "8px", padding: "40px", border: "1px solid #1a1a1a", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
        <h2 style={{ color: "#00C864", fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>Password Reset Successfully</h2>
        <p style={{ color: "#888888", fontSize: "14px" }}>Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#111111", borderRadius: "8px", padding: "2rem", border: "1px solid #1a1a1a" }}>
      {error && (
        <div style={{ backgroundColor: "rgba(193, 18, 31, 0.1)", border: "1px solid #C1121F", borderRadius: "6px", padding: "12px", marginBottom: "16px", color: "#ff4444", fontSize: "14px" }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Minimum 8 characters"
            style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repeat your password"
            style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", backgroundColor: loading ? "#666666" : "#C1121F", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

function ResetPasswordPageInner() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 1.5rem", fontFamily: "Inter, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>DRIVE CONNECT</h1>
          </Link>
          <p style={{ color: "#C1121F", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>Drive Network Partner Portal</p>
        </div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ color: "#ffffff", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 8px" }}>Set New Password</h2>
          <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>Create a new secure password for your account</p>
        </div>
        <Suspense fallback={<div style={{ color: "#555555", textAlign: "center" }}>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{color:"#888",padding:"40px",textAlign:"center"}}>Loading...</div>}>
      <ResetPasswordPageInner />
    </Suspense>
  );
}
