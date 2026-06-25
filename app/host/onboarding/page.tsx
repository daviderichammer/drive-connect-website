"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingStep: number;
  onboardingCompleted: boolean;
}

// Step indicator component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { num: 1, label: "Business Profile" },
    { num: 2, label: "First Vehicle" },
    { num: 3, label: "Insurance Docs" },
    { num: 4, label: "Payout Info" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "40px", gap: "0" }}>
      {steps.map((step, idx) => (
        <div key={step.num} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: currentStep > step.num ? "#00C864" : currentStep === step.num ? "#C1121F" : "#1a1a1a",
              border: `2px solid ${currentStep > step.num ? "#00C864" : currentStep === step.num ? "#C1121F" : "#333333"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: currentStep >= step.num ? "#ffffff" : "#555555",
            }}>
              {currentStep > step.num ? "✓" : step.num}
            </div>
            <span style={{
              fontSize: "10px",
              fontWeight: 600,
              color: currentStep === step.num ? "#ffffff" : "#555555",
              letterSpacing: "0.03em",
              textAlign: "center",
              width: "80px",
            }}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div style={{
              width: "60px",
              height: "2px",
              backgroundColor: currentStep > step.num ? "#00C864" : "#1a1a1a",
              margin: "0 4px",
              marginBottom: "22px",
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// Step 1: Business Profile
function Step1({ host, onComplete }: { host: HostData; onComplete: () => void }) {
  const [description, setDescription] = useState("");
  const [serviceAreas, setServiceAreas] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/host/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 1, data: { description, serviceAreas } }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        setLoading(false);
        return;
      }

      onComplete();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 8px" }}>
          Business Profile
        </h3>
        <p style={{ color: "#888888", fontSize: "14px", margin: 0 }}>
          Tell renters about your business. This appears on your operator profile.
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: "rgba(193, 18, 31, 0.1)", border: "1px solid #C1121F", borderRadius: "6px", padding: "12px", marginBottom: "16px", color: "#ff4444", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888888", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Business Name
        </label>
        <input
          type="text"
          value={host.businessName}
          disabled
          style={{ width: "100%", padding: "12px 14px", backgroundColor: "#0d0d0d", border: "1px solid #222222", borderRadius: "6px", color: "#666666", fontSize: "14px", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888888", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Business Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your rental business, your fleet, and what makes you different..."
          rows={4}
          style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1a1a1a", border: "1px solid #333333", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888888", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Service Areas
        </label>
        <input
          type="text"
          value={serviceAreas}
          onChange={(e) => setServiceAreas(e.target.value)}
          placeholder="e.g., Miami, Fort Lauderdale, Boca Raton"
          style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1a1a1a", border: "1px solid #333333", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
        />
        <p style={{ color: "#555555", fontSize: "12px", marginTop: "6px" }}>Separate multiple cities with commas</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", backgroundColor: loading ? "#666666" : "#C1121F", color: "#ffffff", border: "none", borderRadius: "6px", padding: "14px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
      >
        {loading ? "Saving..." : "Save & Continue →"}
      </button>
    </form>
  );
}

// Step 2: First Vehicle
function Step2({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [formData, setFormData] = useState({
    year: "", make: "", model: "", trim: "", color: "",
    dailyRate: "", weeklyRate: "", monthlyRate: "", securityDeposit: "",
    seats: "5", fuelType: "Gasoline", transmission: "Automatic",
    mileageIncluded: "", description: "",
    hasGPS: false, hasBluetooth: false, hasCarPlay: false,
    offersAirportPickup: false, offersHomeDelivery: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/host/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create vehicle.");
        setLoading(false);
        return;
      }

      onComplete();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#888888",
    marginBottom: "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 8px" }}>
          Add Your First Vehicle
        </h3>
        <p style={{ color: "#888888", fontSize: "14px", margin: 0 }}>
          Create your first listing. You can add more vehicles after onboarding.
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: "rgba(193, 18, 31, 0.1)", border: "1px solid #C1121F", borderRadius: "6px", padding: "12px", marginBottom: "16px", color: "#ff4444", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Vehicle Info */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>Year *</label>
          <input type="number" value={formData.year} onChange={(e) => handleChange("year", e.target.value)} required placeholder="2022" min="1990" max="2030" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Make *</label>
          <input type="text" value={formData.make} onChange={(e) => handleChange("make", e.target.value)} required placeholder="Toyota" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Model *</label>
          <input type="text" value={formData.model} onChange={(e) => handleChange("model", e.target.value)} required placeholder="Camry" style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>Trim</label>
          <input type="text" value={formData.trim} onChange={(e) => handleChange("trim", e.target.value)} placeholder="XSE" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Color</label>
          <input type="text" value={formData.color} onChange={(e) => handleChange("color", e.target.value)} placeholder="Black" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Seats</label>
          <select value={formData.seats} onChange={(e) => handleChange("seats", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {[2, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>Fuel Type</label>
          <select value={formData.fuelType} onChange={(e) => handleChange("fuelType", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {["Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Transmission</label>
          <select value={formData.transmission} onChange={(e) => handleChange("transmission", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            {["Automatic", "Manual"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "20px", marginBottom: "16px" }}>
        <p style={{ color: "#888888", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Pricing</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}>Daily Rate * ($)</label>
            <input type="number" value={formData.dailyRate} onChange={(e) => handleChange("dailyRate", e.target.value)} required placeholder="75" min="1" step="0.01" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Weekly Rate ($)</label>
            <input type="number" value={formData.weeklyRate} onChange={(e) => handleChange("weeklyRate", e.target.value)} placeholder="450" min="1" step="0.01" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Monthly Rate ($)</label>
            <input type="number" value={formData.monthlyRate} onChange={(e) => handleChange("monthlyRate", e.target.value)} placeholder="1500" min="1" step="0.01" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Security Deposit ($)</label>
            <input type="number" value={formData.securityDeposit} onChange={(e) => handleChange("securityDeposit", e.target.value)} placeholder="500" min="0" step="0.01" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "20px", marginBottom: "16px" }}>
        <p style={{ color: "#888888", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>Features & Delivery</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {[
            { key: "hasGPS", label: "GPS" },
            { key: "hasBluetooth", label: "Bluetooth" },
            { key: "hasCarPlay", label: "Apple CarPlay" },
            { key: "offersAirportPickup", label: "Airport Pickup" },
            { key: "offersHomeDelivery", label: "Home Delivery" },
          ].map(({ key, label }) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={formData[key as keyof typeof formData] as boolean}
                onChange={(e) => handleChange(key, e.target.checked)}
                style={{ accentColor: "#C1121F", width: "16px", height: "16px" }}
              />
              <span style={{ color: "#cccccc", fontSize: "14px" }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={labelStyle}>Vehicle Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe your vehicle, its condition, and any special features..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{ flex: 1, backgroundColor: loading ? "#666666" : "#C1121F", color: "#ffffff", border: "none", borderRadius: "6px", padding: "14px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
        >
          {loading ? "Saving..." : "Add Vehicle & Continue →"}
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{ backgroundColor: "transparent", color: "#888888", border: "1px solid #333333", borderRadius: "6px", padding: "14px 20px", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
        >
          Skip for Now
        </button>
      </div>
    </form>
  );
}

// Step 3: Insurance Documentation
function Step3({ onComplete, onSkip }: { onComplete: () => void; onSkip: () => void }) {
  const [docUrl, setDocUrl] = useState("");
  const [docName, setDocName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/host/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 3, data: { insuranceDocUrl: docUrl, insuranceDocName: docName } }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        setLoading(false);
        return;
      }

      onComplete();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 8px" }}>
          Insurance Documentation
        </h3>
        <p style={{ color: "#888888", fontSize: "14px", margin: 0 }}>
          Upload your commercial insurance documentation. This is required to activate your listings.
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: "rgba(193, 18, 31, 0.1)", border: "1px solid #C1121F", borderRadius: "6px", padding: "12px", marginBottom: "16px", color: "#ff4444", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: "#0d0d0d",
        border: "2px dashed #333333",
        borderRadius: "8px",
        padding: "40px",
        textAlign: "center",
        marginBottom: "20px",
      }}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📄</div>
        <p style={{ color: "#888888", fontSize: "14px", marginBottom: "8px" }}>
          Insurance document upload will be available after onboarding.
        </p>
        <p style={{ color: "#555555", fontSize: "12px" }}>
          Please provide the document URL or name below for now.
        </p>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888888", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Document Name / Policy Number
        </label>
        <input
          type="text"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          placeholder="e.g., Progressive Commercial Policy #12345"
          style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1a1a1a", border: "1px solid #333333", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#888888", marginBottom: "6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Document URL (optional)
        </label>
        <input
          type="url"
          value={docUrl}
          onChange={(e) => setDocUrl(e.target.value)}
          placeholder="https://..."
          style={{ width: "100%", padding: "12px 14px", backgroundColor: "#1a1a1a", border: "1px solid #333333", borderRadius: "6px", color: "#ffffff", fontSize: "14px", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          type="submit"
          disabled={loading}
          style={{ flex: 1, backgroundColor: loading ? "#666666" : "#C1121F", color: "#ffffff", border: "none", borderRadius: "6px", padding: "14px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
        >
          {loading ? "Saving..." : "Save & Continue →"}
        </button>
        <button
          type="button"
          onClick={onSkip}
          style={{ backgroundColor: "transparent", color: "#888888", border: "1px solid #333333", borderRadius: "6px", padding: "14px 20px", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
        >
          Skip for Now
        </button>
      </div>
    </form>
  );
}

// Step 4: Banking/Payout Info
function Step4({ onComplete }: { onComplete: () => void }) {
  const [formData, setFormData] = useState({
    bankAccountName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    bankAccountType: "Checking",
    payoutEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/host/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: 4, data: formData }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save.");
        setLoading(false);
        return;
      }

      onComplete();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#1a1a1a",
    border: "1px solid #333333",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    color: "#888888",
    marginBottom: "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#ffffff", fontSize: "20px", fontWeight: 700, margin: "0 0 8px" }}>
          Payout Information
        </h3>
        <p style={{ color: "#888888", fontSize: "14px", margin: 0 }}>
          Provide your banking details for rental payouts. Payment processing will be activated when Drive Connect launches payments.
        </p>
      </div>

      <div style={{
        backgroundColor: "rgba(255, 165, 0, 0.05)",
        border: "1px solid rgba(255, 165, 0, 0.2)",
        borderRadius: "6px",
        padding: "12px 16px",
        marginBottom: "20px",
      }}>
        <p style={{ color: "#FFA500", fontSize: "13px", margin: 0 }}>
          ⚠️ Payment processing is not yet active. This information will be used when the payment system launches.
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: "rgba(193, 18, 31, 0.1)", border: "1px solid #C1121F", borderRadius: "6px", padding: "12px", marginBottom: "16px", color: "#ff4444", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Account Holder Name</label>
        <input type="text" value={formData.bankAccountName} onChange={(e) => handleChange("bankAccountName", e.target.value)} placeholder="Full legal name on account" style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>Account Number</label>
          <input type="text" value={formData.bankAccountNumber} onChange={(e) => handleChange("bankAccountNumber", e.target.value)} placeholder="••••••••••" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Routing Number</label>
          <input type="text" value={formData.bankRoutingNumber} onChange={(e) => handleChange("bankRoutingNumber", e.target.value)} placeholder="9 digits" maxLength={9} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={labelStyle}>Account Type</label>
          <select value={formData.bankAccountType} onChange={(e) => handleChange("bankAccountType", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
            <option>Checking</option>
            <option>Savings</option>
            <option>Business Checking</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Payout Email</label>
          <input type="email" value={formData.payoutEmail} onChange={(e) => handleChange("payoutEmail", e.target.value)} placeholder="payouts@yourbusiness.com" style={inputStyle} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ width: "100%", backgroundColor: loading ? "#666666" : "#C1121F", color: "#ffffff", border: "none", borderRadius: "6px", padding: "14px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.05em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", marginTop: "8px" }}
      >
        {loading ? "Saving..." : "Complete Onboarding →"}
      </button>
    </form>
  );
}

// Completion Screen
function CompletionScreen() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
      <h3 style={{ color: "#00C864", fontSize: "24px", fontWeight: 700, margin: "0 0 12px" }}>
        Welcome to Drive Connect!
      </h3>
      <p style={{ color: "#888888", fontSize: "16px", marginBottom: "32px", lineHeight: 1.6 }}>
        Your Drive Network Partner account is set up and ready. 
        Head to your dashboard to manage your vehicles and bookings.
      </p>
      <button
        onClick={() => router.push("/host/dashboard")}
        style={{ backgroundColor: "#C1121F", color: "#ffffff", border: "none", borderRadius: "6px", padding: "16px 40px", fontWeight: 700, fontSize: "15px", letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
      >
        Go to Dashboard →
      </button>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetch("/api/host/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/host/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (!data.authenticated) {
          router.push("/host/login");
          return;
        }
        if (data.host.onboardingCompleted) {
          router.push("/host/dashboard");
          return;
        }
        setHost(data.host);
        setCurrentStep(Math.max(1, data.host.onboardingStep || 1));
        setLoading(false);
      })
      .catch(() => router.push("/host/login"));
  }, [router]);

  const handleStepComplete = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleSkip = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555555", fontFamily: "Inter, sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!host) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#000000", borderBottom: "1px solid #111111", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontSize: "16px", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>DRIVE CONNECT</span>
        </Link>
        <span style={{ color: "#555555", fontSize: "13px" }}>
          Welcome, {host.ownerName}
        </span>
      </header>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px" }}>
        {!completed && (
          <>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <p style={{ color: "#C1121F", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px" }}>
                Partner Onboarding
              </p>
              <h2 style={{ color: "#ffffff", fontSize: "28px", fontWeight: 700, margin: 0 }}>
                Set Up Your Account
              </h2>
            </div>

            <StepIndicator currentStep={currentStep} totalSteps={4} />
          </>
        )}

        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "32px" }}>
          {completed ? (
            <CompletionScreen />
          ) : currentStep === 1 ? (
            <Step1 host={host} onComplete={handleStepComplete} />
          ) : currentStep === 2 ? (
            <Step2 onComplete={handleStepComplete} onSkip={handleSkip} />
          ) : currentStep === 3 ? (
            <Step3 onComplete={handleStepComplete} onSkip={handleSkip} />
          ) : (
            <Step4 onComplete={handleStepComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
