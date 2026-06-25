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

export default function OnboardingVehiclePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    year: new Date().getFullYear().toString(),
    make: "",
    model: "",
    trim: "",
    color: "",
    licensePlate: "",
    vin: "",
    mileage: "",
    fuelType: "Gasoline",
    transmission: "Automatic",
    seats: "5",
    dailyRate: "",
    weeklyRate: "",
    monthlyRate: "",
    securityDeposit: "",
    mileageIncluded: "200",
    description: "",
    offersAirportDelivery: false,
    offersHomeDelivery: false,
    smokingAllowed: false,
    petsAllowed: false,
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
        if (data.host.onboardingStep < 1) {
          router.push("/host/onboarding/profile");
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
    setSaving(true);

    try {
      const res = await fetch("/api/host/onboarding/vehicle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save vehicle.");
        setSaving(false);
        return;
      }

      router.push("/host/onboarding/insurance");
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

  const selectStyle = { ...inputStyle, cursor: "pointer" };

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
        <OnboardingProgress step={2} />

        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.5rem" }}>First Vehicle Listing</h1>
        <p style={{ color: "#555555", marginBottom: "2.5rem", fontSize: "0.9375rem" }}>
          Add your first vehicle to the Drive Network. You can add more vehicles after completing setup.
        </p>

        {error && (
          <div style={{ backgroundColor: "#1a0000", border: "1px solid #DC2626", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Vehicle Details */}
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem", marginTop: 0 }}>Vehicle Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>Year *</label>
                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required min="2000" max="2030" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Make *</label>
                <input type="text" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} required placeholder="Toyota" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Model *</label>
                <input type="text" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required placeholder="Camry" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>Trim</label>
                <input type="text" value={form.trim} onChange={(e) => setForm({ ...form, trim: e.target.value })} placeholder="XLE" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Color</label>
                <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Black" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Seats</label>
                <select value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} style={selectStyle}>
                  {[2, 4, 5, 6, 7, 8, 9, 12, 15].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>Fuel Type</label>
                <select value={form.fuelType} onChange={(e) => setForm({ ...form, fuelType: e.target.value })} style={selectStyle}>
                  {["Gasoline", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"].map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Transmission</label>
                <select value={form.transmission} onChange={(e) => setForm({ ...form, transmission: e.target.value })} style={selectStyle}>
                  {["Automatic", "Manual", "CVT"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>License Plate</label>
                <input type="text" value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} placeholder="ABC-1234" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Current Mileage</label>
                <input type="number" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} placeholder="25000" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem", marginTop: 0 }}>Pricing</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>Daily Rate * ($)</label>
                <input type="number" value={form.dailyRate} onChange={(e) => setForm({ ...form, dailyRate: e.target.value })} required min="1" step="0.01" placeholder="75.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Weekly Rate ($)</label>
                <input type="number" value={form.weeklyRate} onChange={(e) => setForm({ ...form, weeklyRate: e.target.value })} min="1" step="0.01" placeholder="450.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Monthly Rate ($)</label>
                <input type="number" value={form.monthlyRate} onChange={(e) => setForm({ ...form, monthlyRate: e.target.value })} min="1" step="0.01" placeholder="1500.00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Security Deposit ($)</label>
                <input type="number" value={form.securityDeposit} onChange={(e) => setForm({ ...form, securityDeposit: e.target.value })} min="0" step="0.01" placeholder="500.00" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Miles Included Per Day</label>
              <input type="number" value={form.mileageIncluded} onChange={(e) => setForm({ ...form, mileageIncluded: e.target.value })} min="0" placeholder="200" style={{ ...inputStyle, maxWidth: "200px" }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem", marginTop: 0 }}>Description & Options</h3>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Vehicle Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your vehicle, its condition, features, and any special notes for renters..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { key: "offersAirportDelivery", label: "Airport Delivery Available" },
                { key: "offersHomeDelivery", label: "Home Delivery Available" },
                { key: "smokingAllowed", label: "Smoking Allowed" },
                { key: "petsAllowed", label: "Pets Allowed" },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form[key as keyof typeof form] as boolean}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    style={{ accentColor: "#DC2626", width: "18px", height: "18px" }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "#cccccc" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/host/onboarding/profile"
              style={{ flex: 1, display: "block", textAlign: "center", backgroundColor: "transparent", border: "1px solid #333333", color: "#888888", textDecoration: "none", padding: "1rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.05em" }}
            >
              ← Back
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 2, backgroundColor: saving ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
            >
              {saving ? "Saving..." : "Save Vehicle & Continue →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
