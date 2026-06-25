"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function OnboardingProgress({ step }: { step: number }) {
  const steps = ["Profile", "Vehicle", "Insurance", "Banking"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: i + 1 < step ? "#DC2626" : i + 1 === step ? "#DC2626" : "#1a1a1a",
              border: `2px solid ${i + 1 <= step ? "#DC2626" : "#333333"}`,
              fontSize: "0.75rem", fontWeight: 700, color: i + 1 <= step ? "#ffffff" : "#555555",
            }}>
              {i + 1 < step ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: "0.625rem", color: i + 1 <= step ? "#DC2626" : "#555555", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ height: "2px", flex: 1, backgroundColor: i + 1 < step ? "#DC2626" : "#1a1a1a", marginBottom: "1.25rem" }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OnboardingBankingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountType: "checking",
    routingNumber: "",
    accountNumber: "",
    confirmAccountNumber: "",
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/host/me");
        if (!res.ok) {
          router.push("/host-login");
          return;
        }
        const data = await res.json();
        if (data.host.onboardingComplete) {
          router.push("/host/dashboard");
          return;
        }
        if (data.host.onboardingStep < 3) {
          router.push("/host/onboarding/insurance");
          return;
        }
      } catch {
        router.push("/host-login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.accountNumber !== form.confirmAccountNumber) {
      setError("Account numbers do not match.");
      return;
    }

    if (form.routingNumber.length !== 9) {
      setError("Routing number must be 9 digits.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/host/onboarding/banking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountHolderName: form.accountHolderName,
          bankName: form.bankName,
          accountType: form.accountType,
          routingNumber: form.routingNumber,
          accountNumber: form.accountNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save banking information.");
        setSaving(false);
        return;
      }

      router.push("/host/onboarding/complete");
    } catch {
      setError("An error occurred. Please try again.");
      setSaving(false);
    }
  }

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
    display: "block" as const,
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#888888",
    marginBottom: "0.375rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 900, letterSpacing: "0.15em" }}>DRIVE CONNECT</span>
        </Link>
        <span style={{ color: "#DC2626", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Partner Onboarding</span>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "3rem 2rem" }}>
        <OnboardingProgress step={4} />

        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.5rem" }}>Payout Information</h1>
        <p style={{ color: "#555555", marginBottom: "2.5rem", fontSize: "0.9375rem" }}>
          Set up your bank account for rental payouts. Payment processing will be activated when Drive Connect launches full payment infrastructure.
        </p>

        <div style={{ backgroundColor: "#0a0500", border: "1px solid #f59e0b", borderRadius: "8px", padding: "1rem 1.25rem", marginBottom: "2rem" }}>
          <p style={{ color: "#f59e0b", fontSize: "0.8125rem", margin: 0, lineHeight: 1.6 }}>
            <strong>Note:</strong> Banking information is collected for future payout setup. No charges will be made to this account. Full payment processing integration is coming in a future update.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: "#1a0000", border: "1px solid #DC2626", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Account Holder Name *</label>
            <input
              type="text"
              value={form.accountHolderName}
              onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
              required
              placeholder="Full legal name on account"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Bank Name *</label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                required
                placeholder="Chase, Bank of America, etc."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Account Type *</label>
              <select
                value={form.accountType}
                onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                required
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business_checking">Business Checking</option>
                <option value="business_savings">Business Savings</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Routing Number * (9 digits)</label>
            <input
              type="text"
              value={form.routingNumber}
              onChange={(e) => setForm({ ...form, routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9) })}
              required
              maxLength={9}
              placeholder="123456789"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
            <div>
              <label style={labelStyle}>Account Number *</label>
              <input
                type="text"
                value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value.replace(/\D/g, "") })}
                required
                placeholder="Account number"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm Account Number *</label>
              <input
                type="text"
                value={form.confirmAccountNumber}
                onChange={(e) => setForm({ ...form, confirmAccountNumber: e.target.value.replace(/\D/g, "") })}
                required
                placeholder="Re-enter account number"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/host/onboarding/insurance"
              style={{ flex: 1, display: "block", textAlign: "center", backgroundColor: "transparent", border: "1px solid #333333", color: "#888888", textDecoration: "none", padding: "1rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.05em" }}
            >
              ← Back
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 2, backgroundColor: saving ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
            >
              {saving ? "Saving..." : "Complete Setup →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
