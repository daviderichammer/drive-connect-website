"use client";

import { useState } from "react";
import Link from "next/link";

const vehicleTypeOptions = ["Sedan", "SUV", "Luxury", "Convertible", "Electric", "Van", "Truck", "Exotic", "Other"];
const platformOptions = ["Turo", "Private Rentals", "Hertz Local Edition", "Independent Rental Company", "Other"];

export default function PartnerApplicationPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    primaryCity: "",
    additionalCities: "",
    numberOfVehicles: "",
    vehicleTypes: [] as string[],
    currentPlatforms: [] as string[],
    turoProfileUrl: "",
    offersAirportDelivery: false,
    offersHomeDelivery: false,
    hasCommercialInsurance: false,
    supportsSameDayBookings: false,
    operates24x7: false,
    wouldUseDCSupport: false,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/partner-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          numberOfVehicles: parseInt(formData.numberOfVehicles) || 0,
          vehicleTypes: formData.vehicleTypes.join(", "),
          currentPlatforms: formData.currentPlatforms.join(", "),
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Submission failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section
        style={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "12px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>✅</div>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "1.75rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Application Submitted
          </h1>
          <p style={{ color: "#888888", fontSize: "1rem", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            Thank you for applying to become a Drive Network Partner.
          </p>
          <p style={{ color: "#888888", fontSize: "1rem", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            Our team will review your application.
          </p>
          <p style={{ color: "#888888", fontSize: "1rem", lineHeight: 1.8, marginBottom: "0.75rem" }}>
            We are building a trusted operator network.
          </p>
          <p style={{ color: "#cccccc", fontSize: "1rem", lineHeight: 1.8, fontWeight: 600, marginBottom: "2.5rem" }}>
            We look forward to speaking with you soon.
          </p>
          <div
            style={{
              borderTop: "1px solid #1a1a1a",
              paddingTop: "2rem",
            }}
          >
            <p
              style={{
                color: "#555555",
                fontSize: "0.875rem",
                fontStyle: "italic",
                marginBottom: "1.5rem",
              }}
            >
              &ldquo;Business works best when everyone succeeds together.&rdquo;
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                backgroundColor: "#DC2626",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "0.875rem 2rem",
                borderRadius: "6px",
              }}
            >
              Return To Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Header */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "4rem 1.5rem",
          textAlign: "center",
          color: "#ffffff",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.375rem 1rem",
              borderRadius: "4px",
              marginBottom: "1.25rem",
            }}
          >
            Drive Network Partner Application
          </div>
          <h1
            style={{
              fontSize: "clamp(1.875rem, 5vw, 2.75rem)",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
              lineHeight: 1.1,
            }}
          >
            Join The Drive Network
          </h1>
          <p style={{ color: "#888888", fontSize: "1rem", lineHeight: 1.7 }}>
            Drive Connect is economic infrastructure for independent operators. This application begins the process of joining a network built on aligned incentives, transparent economics, and genuine operator independence.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: "3rem 1.5rem", backgroundColor: "#F5F5F5" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            {/* Business Information */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "1.5rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #000000",
                }}
              >
                Business Information
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Your business or company name"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#F5F5F5", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Your full name"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#F5F5F5", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#F5F5F5", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#F5F5F5", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Primary City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.primaryCity}
                    onChange={(e) => setFormData({ ...formData, primaryCity: e.target.value })}
                    placeholder="e.g. Tampa, FL"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#F5F5F5", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Additional Cities
                  </label>
                  <input
                    type="text"
                    value={formData.additionalCities}
                    onChange={(e) => setFormData({ ...formData, additionalCities: e.target.value })}
                    placeholder="e.g. Orlando, Miami"
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#F5F5F5", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Fleet Information */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "1.5rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #000000",
                }}
              >
                Fleet Information
              </h2>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Number Of Vehicles *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.numberOfVehicles}
                  onChange={(e) => setFormData({ ...formData, numberOfVehicles: e.target.value })}
                  placeholder="How many vehicles in your fleet?"
                  style={{ width: "100%", maxWidth: "300px", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#F5F5F5", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Vehicle Types (Select All That Apply)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.625rem" }}>
                  {vehicleTypeOptions.map((type) => (
                    <label
                      key={type}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.625rem 0.875rem",
                        backgroundColor: formData.vehicleTypes.includes(type) ? "#000000" : "#F5F5F5",
                        borderRadius: "6px",
                        border: `1px solid ${formData.vehicleTypes.includes(type) ? "#000000" : "#e5e7eb"}`,
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.vehicleTypes.includes(type)}
                        onChange={() => setFormData({ ...formData, vehicleTypes: toggleArrayItem(formData.vehicleTypes, type) })}
                        style={{ accentColor: "#DC2626", width: "16px", height: "16px" }}
                      />
                      <span style={{ fontSize: "0.875rem", fontWeight: 500, color: formData.vehicleTypes.includes(type) ? "#ffffff" : "#333333" }}>
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Platforms */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "1.5rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #000000",
                }}
              >
                Current Rental Platforms
              </h2>
              <div style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#333333", marginBottom: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Check All That Apply
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {platformOptions.map((platform) => (
                    <label
                      key={platform}
                      style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.currentPlatforms.includes(platform)}
                        onChange={() => setFormData({ ...formData, currentPlatforms: toggleArrayItem(formData.currentPlatforms, platform) })}
                        style={{ accentColor: "#DC2626", width: "18px", height: "18px" }}
                      />
                      <span style={{ fontSize: "0.9375rem", color: "#333333", fontWeight: 500 }}>{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Platform Profile URL - shown when Turo is selected */}
              {formData.currentPlatforms.includes("Turo") && (
                <div
                  style={{
                    backgroundColor: "#F5F5F5",
                    borderRadius: "8px",
                    padding: "1.25rem",
                    border: "1px solid #e5e7eb",
                    borderLeft: "3px solid #DC2626",
                  }}
                >
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#DC2626", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Current Platform Profile URL
                  </label>
                  <p style={{ fontSize: "0.8125rem", color: "#666666", marginBottom: "0.625rem" }}>
                    Please provide your current platform host profile URL for review. We will review your ratings, total trips, and guest reviews.
                  </p>
                  <input
                    type="url"
                    value={formData.turoProfileUrl}
                    onChange={(e) => setFormData({ ...formData, turoProfileUrl: e.target.value })}
                    placeholder="https://turo.com/us/en/drivers/..."
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #e5e7eb", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#ffffff", color: "#000000", outline: "none", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              )}
            </div>

            {/* Operational Questions */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "2rem",
                marginBottom: "1.5rem",
                border: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  color: "#000000",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #000000",
                }}
              >
                Operational Questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { key: "offersAirportDelivery", label: "Do you currently offer airport delivery?" },
                  { key: "offersHomeDelivery", label: "Do you offer home delivery?" },
                  { key: "hasCommercialInsurance", label: "Do you carry commercial insurance?" },
                  { key: "supportsSameDayBookings", label: "Can you support same day bookings?" },
                  { key: "operates24x7", label: "Do you operate 24/7 customer service?" },
                  { key: "wouldUseDCSupport", label: "Would you use Drive Connect customer support service?" },
                ].map((question) => (
                  <div
                    key={question.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem 1.25rem",
                      backgroundColor: "#F5F5F5",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <span style={{ fontSize: "0.9375rem", color: "#333333", fontWeight: 500 }}>
                      {question.label}
                    </span>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name={question.key}
                          checked={formData[question.key as keyof typeof formData] === true}
                          onChange={() => setFormData({ ...formData, [question.key]: true })}
                          style={{ accentColor: "#DC2626" }}
                        />
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#000000" }}>Yes</span>
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "0.375rem", cursor: "pointer" }}>
                        <input
                          type="radio"
                          name={question.key}
                          checked={formData[question.key as keyof typeof formData] === false}
                          onChange={() => setFormData({ ...formData, [question.key]: false })}
                          style={{ accentColor: "#DC2626" }}
                        />
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#000000" }}>No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error message */}
            {status === "error" && (
              <div
                style={{
                  backgroundColor: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "8px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.5rem",
                }}
              >
                <p style={{ color: "#DC2626", fontSize: "0.9375rem", margin: 0, fontWeight: 500 }}>
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Submit */}
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={status === "submitting"}
                style={{
                  backgroundColor: "#DC2626",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "1.125rem 4rem",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: status === "submitting" ? "not-allowed" : "pointer",
                  opacity: status === "submitting" ? 0.7 : 1,
                  fontFamily: "Inter, sans-serif",
                  transition: "background-color 0.2s ease",
                }}
              >
                {status === "submitting" ? "Submitting Application..." : "Submit Application"}
              </button>
              <p style={{ color: "#888888", fontSize: "0.8125rem", marginTop: "1rem" }}>
                By submitting, you agree to be contacted by the Drive Connect team regarding your application.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Philosophy insert */}
      <div style={{ backgroundColor: "#000000", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ color: "#555555", fontSize: "0.875rem", fontStyle: "italic", margin: 0 }}>
          &ldquo;Business works best when everyone succeeds together.&rdquo;
        </p>
      </div>
    </>
  );
}
