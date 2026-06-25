"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
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

      router.push("/admin/dashboard");
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
          <p style={{ color: "#DC2626", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.5rem" }}>Admin Portal</p>
        </div>

        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "2.5rem" }}>
          <h2 style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>Admin Login</h2>

          {error && (
            <div style={{ backgroundColor: "#1a0000", border: "1px solid #DC2626", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
              <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@driveconnect.com"
                style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", backgroundColor: loading ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", color: "#333333", fontSize: "0.8125rem", marginTop: "1.5rem" }}>
          <Link href="/" style={{ color: "#555555", textDecoration: "none" }}>← Back to Drive Connect</Link>
        </p>
      </div>
    </div>
  );
}
