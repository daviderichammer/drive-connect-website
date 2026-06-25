"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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

      setSuccess("Password reset successfully. Redirecting to login...");
      setTimeout(() => router.push("/host-login"), 2000);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 900, letterSpacing: "0.15em", margin: 0 }}>DRIVE CONNECT</h1>
          </Link>
          <p style={{ color: "#DC2626", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.5rem" }}>Drive Network Partner Portal</p>
        </div>

        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "2.5rem" }}>
          <h2 style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>Reset Password</h2>

          {error && (
            <div style={{ backgroundColor: "#1a0000", border: "1px solid #DC2626", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
              <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: "#001a00", border: "1px solid #22c55e", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
              <p style={{ color: "#22c55e", fontSize: "0.875rem", margin: 0 }}>{success}</p>
            </div>
          )}

          {!token ? (
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#555555", marginBottom: "1rem" }}>Invalid reset link. Please request a new one.</p>
              <Link href="/host-login" style={{ color: "#DC2626", fontSize: "0.875rem" }}>← Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.25rem" }}>
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
                  placeholder="Confirm your new password"
                  style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", backgroundColor: loading ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/host-login" style={{ color: "#555555", fontSize: "0.8125rem", textDecoration: "none" }}>← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "#555555" }}>Loading...</p></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
