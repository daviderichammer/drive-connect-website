"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingCompletePage() {
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 900, letterSpacing: "0.15em" }}>DRIVE CONNECT</span>
        </Link>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
        {/* Success Icon */}
        <div style={{ width: "100px", height: "100px", backgroundColor: "#DC2626", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2.5rem", fontSize: "2.5rem" }}>
          ✓
        </div>

        <h1 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "0.05em", marginBottom: "1rem" }}>
          You&apos;re Live on the Drive Network
        </h1>

        <p style={{ fontSize: "1.125rem", color: "#888888", maxWidth: "500px", margin: "0 auto 1rem", lineHeight: 1.6 }}>
          {hostName ? `${hostName}, your` : "Your"} account setup is complete.
        </p>

        <p style={{ fontSize: "1rem", color: "#555555", maxWidth: "500px", margin: "0 auto 3rem", lineHeight: 1.6 }}>
          Your vehicle listing is now active and your profile is visible to renters on the Drive Network. Welcome to a better way to run your rental business.
        </p>

        {/* What&apos;s Next */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "3rem" }}>
          {[
            { icon: "🚗", title: "Manage Vehicles", desc: "Add more vehicles, update pricing, and manage availability" },
            { icon: "📅", title: "View Bookings", desc: "Track reservations and manage your rental calendar" },
            { icon: "💰", title: "Track Earnings", desc: "Monitor revenue and payout history from your dashboard" },
          ].map((item) => (
            <div key={item.title} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.5rem" }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{item.icon}</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</div>
              <div style={{ fontSize: "0.8125rem", color: "#555555", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <Link
          href="/host/dashboard"
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
          Go to My Dashboard →
        </Link>

        <p style={{ color: "#333333", fontSize: "0.8125rem", marginTop: "2rem", fontStyle: "italic" }}>
          &ldquo;Higher revenue should belong to the operator creating the value.&rdquo;
        </p>
      </div>
    </div>
  );
}
