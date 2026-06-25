"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingWelcomePage() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/host/me");
        if (!res.ok) {
          router.push("/host-login");
          return;
        }
        const data = await res.json();
        setHostName(data.host.name);
        if (data.host.onboardingComplete) {
          router.push("/host/dashboard");
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

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555555" }}>Loading...</p>
      </div>
    );
  }

  const steps = [
    { num: 1, title: "Business Profile", desc: "Set up your logo, description, and service areas" },
    { num: 2, title: "First Vehicle Listing", desc: "Add your first vehicle to the Drive Network" },
    { num: 3, title: "Insurance Documentation", desc: "Upload your commercial insurance certificate" },
    { num: 4, title: "Banking & Payouts", desc: "Set up your payout information" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 900, letterSpacing: "0.15em" }}>DRIVE CONNECT</span>
        </Link>
        <span style={{ color: "#DC2626", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Partner Onboarding</span>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "4rem 2rem" }}>
        {/* Welcome Hero */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ width: "80px", height: "80px", backgroundColor: "#DC2626", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontSize: "2rem" }}>
            ✓
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "0.05em", marginBottom: "1rem" }}>
            Welcome to the Drive Network
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#888888", maxWidth: "500px", margin: "0 auto 0.5rem", lineHeight: 1.6 }}>
            {hostName ? `${hostName}, your` : "Your"} application has been approved.
          </p>
          <p style={{ fontSize: "1rem", color: "#555555", maxWidth: "500px", margin: "0 auto", lineHeight: 1.6 }}>
            Complete your account setup in 4 simple steps to start accepting bookings.
          </p>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: "3rem" }}>
          {steps.map((step, index) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                padding: "1.5rem",
                backgroundColor: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                marginBottom: index < steps.length - 1 ? "1rem" : 0,
              }}
            >
              <div style={{ width: "48px", height: "48px", backgroundColor: "#1a1a1a", border: "2px solid #333333", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#DC2626", fontWeight: 900, fontSize: "1.125rem" }}>{step.num}</span>
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem" }}>{step.title}</div>
                <div style={{ fontSize: "0.875rem", color: "#555555" }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/host/onboarding/profile"
            style={{
              display: "inline-block",
              backgroundColor: "#DC2626",
              color: "#ffffff",
              textDecoration: "none",
              padding: "1.125rem 3rem",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Start Setup →
          </Link>
          <p style={{ color: "#333333", fontSize: "0.8125rem", marginTop: "1.5rem", fontStyle: "italic" }}>
            &ldquo;You own the cars. You should control the business.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
