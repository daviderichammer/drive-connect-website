"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
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

      router.push("/admin/applications");
    } catch {
      setError("Network error. Please try again.");
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
      fontFamily: "Inter, Arial, sans-serif",
      padding: "20px",
    }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 8px",
          }}>
            DRIVE CONNECT
          </h1>
          <p style={{ color: "#555555", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: "#111111",
          borderRadius: "8px",
          padding: "40px",
          border: "1px solid #1a1a1a",
        }}>
          <h2 style={{
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "24px",
            textAlign: "center",
          }}>
            Admin Login
          </h2>

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
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#888888",
                marginBottom: "6px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@driveconnect.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333333",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "#888888",
                marginBottom: "6px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333333",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
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
                padding: "14px",
                fontWeight: 700,
                fontSize: "13px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "Inter, Arial, sans-serif",
              }}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: "center",
          color: "#333333",
          fontSize: "11px",
          marginTop: "24px",
          fontStyle: "italic",
        }}>
          Drive Connect IS Principled
        </p>
      </div>
    </div>
  );
}
