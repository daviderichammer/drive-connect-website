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

export default function OnboardingProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    businessName: "",
    description: "",
    serviceAreas: "",
    phone: "",
    website: "",
    logoUrl: "",
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
        // Pre-fill from business profile if exists
        if (data.host.businessProfile) {
          const p = data.host.businessProfile;
          setForm({
            businessName: p.businessName || "",
            description: p.description || "",
            serviceAreas: p.serviceAreas || "",
            phone: p.phone || "",
            website: p.website || "",
            logoUrl: p.logoUrl || "",
          });
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
    setSaving(true);

    try {
      const res = await fetch("/api/host/onboarding/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save profile.");
        setSaving(false);
        return;
      }

      router.push("/host/onboarding/vehicle");
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
        <OnboardingProgress step={1} />

        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.5rem" }}>Business Profile</h1>
        <p style={{ color: "#555555", marginBottom: "2.5rem", fontSize: "0.9375rem" }}>
          Tell renters about your business. This information will appear on your operator profile.
        </p>

        {error && (
          <div style={{ backgroundColor: "#1a0000", border: "1px solid #DC2626", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Business Name *</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                required
                placeholder="Your rental company name"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Business Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your rental business, specialties, and what makes you stand out..."
              rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Service Areas</label>
            <input
              type="text"
              value={form.serviceAreas}
              onChange={(e) => setForm({ ...form, serviceAreas: e.target.value })}
              placeholder="e.g., Tampa, Orlando, Miami, St. Petersburg"
              style={inputStyle}
            />
            <p style={{ color: "#444444", fontSize: "0.75rem", marginTop: "0.375rem" }}>Separate multiple cities with commas</p>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Website (optional)</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://yourbusiness.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={labelStyle}>Logo URL (optional)</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              placeholder="https://yourbusiness.com/logo.png"
              style={inputStyle}
            />
            <p style={{ color: "#444444", fontSize: "0.75rem", marginTop: "0.375rem" }}>Direct link to your business logo image</p>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/host/onboarding/welcome"
              style={{ flex: 1, display: "block", textAlign: "center", backgroundColor: "transparent", border: "1px solid #333333", color: "#888888", textDecoration: "none", padding: "1rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.05em" }}
            >
              ← Back
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 2, backgroundColor: saving ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
            >
              {saving ? "Saving..." : "Save & Continue →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
