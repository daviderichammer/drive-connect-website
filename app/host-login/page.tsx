"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HostLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/host/me");
        if (res.ok) {
          const data = await res.json();
          if (data.host.onboardingComplete) {
            router.push("/host/dashboard");
          } else {
            router.push("/host/onboarding/welcome");
          }
          return;
        }
      } catch {
        // Not logged in
      } finally {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/host/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }
      if (data.host.onboardingComplete) {
        router.push("/host/dashboard");
      } else {
        router.push("/host/onboarding/welcome");
      }
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotMessage("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/host/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage("If an account exists with that email, a reset link has been sent. Please check your inbox.");
      } else {
        setForgotMessage(data.error || "Failed to send reset email.");
      }
    } catch {
      setForgotMessage("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555" }}>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <section style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
        <div style={{ width: "100%", maxWidth: "460px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{ marginBottom: "0.5rem" }}>
                <span style={{ color: "#DC2626", fontWeight: 900, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>DRIVE</span>
                <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "1.75rem", letterSpacing: "-0.02em", marginLeft: "0.375rem" }}>CONNECT</span>
              </div>
            </Link>
            <p style={{ color: "#DC2626", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.5rem" }}>
              Drive Network Partner Portal
            </p>
          </div>

          {!showForgotPassword ? (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "2.5rem" }}>
              <h1 style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>
                Drive Network Partner Login
              </h1>
              <p style={{ color: "#888888", fontSize: "0.875rem", textAlign: "center", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                Manage your vehicles. Manage your business. Stay in control.
              </p>

              {error && (
                <div style={{ backgroundColor: "#1a0000", border: "1px solid #DC2626", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
                  <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
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

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: "#DC2626", width: "16px", height: "16px" }} />
                    <span style={{ fontSize: "0.8125rem", color: "#888888" }}>Remember this device</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setShowForgotPassword(true); setForgotEmail(email); setForgotMessage(""); }}
                    style={{ background: "none", border: "none", color: "#DC2626", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", backgroundColor: loading ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", marginBottom: "1.25rem" }}
                >
                  {loading ? "Signing In..." : "Login"}
                </button>

                <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1.25rem", textAlign: "center" }}>
                  <p style={{ color: "#555555", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                    Not yet a Drive Network Partner?
                  </p>
                  <Link
                    href="/partner-application"
                    style={{ display: "block", backgroundColor: "transparent", color: "#ffffff", textDecoration: "none", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.05em", textTransform: "uppercase", padding: "0.75rem", borderRadius: "6px", border: "1px solid #333333", textAlign: "center" }}
                  >
                    Apply To Become A Partner
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "2.5rem" }}>
              <h2 style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem", textAlign: "center" }}>Reset Password</h2>
              <p style={{ color: "#555555", fontSize: "0.875rem", textAlign: "center", marginBottom: "1.5rem" }}>
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {forgotMessage && (
                <div style={{ backgroundColor: forgotMessage.includes("sent") ? "#001a00" : "#1a0000", border: `1px solid ${forgotMessage.includes("sent") ? "#22c55e" : "#DC2626"}`, borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.25rem" }}>
                  <p style={{ color: forgotMessage.includes("sent") ? "#22c55e" : "#DC2626", fontSize: "0.875rem", margin: 0 }}>{forgotMessage}</p>
                </div>
              )}

              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  style={{ width: "100%", backgroundColor: forgotLoading ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: forgotLoading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", marginBottom: "1rem" }}
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setForgotMessage(""); }}
                  style={{ width: "100%", backgroundColor: "transparent", border: "1px solid #333333", color: "#888888", borderRadius: "6px", padding: "0.875rem", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                >
                  ← Back to Login
                </button>
              </form>
            </div>
          )}

          <p style={{ textAlign: "center", color: "#333333", fontSize: "0.8125rem", fontStyle: "italic", marginTop: "2rem" }}>
            &ldquo;Platforms should create trust. Not control.&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
