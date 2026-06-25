"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface TrustData {
  status: string;
  score: number;
  trustedSince: string | null;
  eligibleForTrusted: boolean;
  eligibilityReasons: string[];
  recentSignals: Array<{
    id: number;
    type: string;
    severity: string;
    action: string;
    date: string;
  }>;
  activityCount: number;
  verificationStatus: string;
}

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  unverified: {
    label: "Unverified",
    color: "#888888",
    bg: "rgba(136,136,136,0.1)",
    desc: "Complete identity verification to start your journey toward Trusted status.",
  },
  pending: {
    label: "Pending Review",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    desc: "Your account is under review. We'll update your status soon.",
  },
  trusted: {
    label: "Trusted Renter",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    desc: "You're a Trusted Renter! Enjoy streamlined bookings and priority confirmations.",
  },
  suspended: {
    label: "Suspended",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.1)",
    desc: "Your account has been suspended. Contact support for assistance.",
  },
  banned: {
    label: "Banned",
    color: "#DC2626",
    bg: "rgba(220,38,38,0.1)",
    desc: "Your account has been permanently banned.",
  },
};

const SEVERITY_COLORS: Record<string, string> = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#DC2626",
};

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#DC2626";

  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width={140} height={140} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="#1a1a1a" strokeWidth={12} />
        <circle
          cx={70} cy={70} r={radius} fill="none" stroke={color} strokeWidth={12}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", textAlign: "center",
      }}>
        <div style={{ color, fontSize: "28px", fontWeight: 900 }}>{score}</div>
        <div style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Score</div>
      </div>
    </div>
  );
}

export default function RenterTrustPage() {
  const router = useRouter();
  const [renter, setRenter] = useState<RenterData | null>(null);
  const [trust, setTrust] = useState<TrustData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [meRes, trustRes] = await Promise.all([
          fetch("/api/renter/me"),
          fetch("/api/renter/trust-status"),
        ]);
        if (meRes.status === 401) { router.push("/renter/login"); return; }
        const meData = await meRes.json();
        const trustData = await trustRes.json();
        setRenter(meData.renter);
        if (trustData.success) setTrust(trustData.trust);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  if (loading || !renter) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#555", fontSize: "14px" }}>Loading...</div>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[trust?.status || "unverified"];

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ padding: "32px", maxWidth: "900px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "22px", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Trust Status
          </h1>
          <p style={{ color: "#555", fontSize: "13px", margin: 0 }}>
            Your renter trust level and security profile
          </p>
        </div>

        {/* Status Card */}
        <div style={{
          backgroundColor: "#0a0a0a",
          border: `1px solid ${statusCfg.color}33`,
          borderRadius: "12px",
          padding: "28px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
          flexWrap: "wrap",
        }}>
          <ScoreRing score={trust?.score || 0} />
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: statusCfg.bg, borderRadius: "20px",
              padding: "6px 14px", marginBottom: "12px",
            }}>
              {trust?.status === "trusted" && (
                <span style={{ fontSize: "16px" }}>✓</span>
              )}
              <span style={{ color: statusCfg.color, fontSize: "13px", fontWeight: 700 }}>
                {statusCfg.label}
              </span>
            </div>
            <p style={{ color: "#aaa", fontSize: "14px", margin: "0 0 12px", lineHeight: 1.6 }}>
              {statusCfg.desc}
            </p>
            {trust?.trustedSince && (
              <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>
                Trusted since {new Date(trust.trustedSince).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            )}
          </div>
        </div>

        {/* Benefits of Trusted Status */}
        {trust?.status === "trusted" && (
          <div style={{
            backgroundColor: "rgba(16,185,129,0.05)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "10px",
            padding: "20px 24px",
            marginBottom: "24px",
          }}>
            <h3 style={{ color: "#10b981", fontSize: "13px", fontWeight: 700, margin: "0 0 12px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Your Trusted Renter Benefits
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              {[
                "Streamlined future bookings",
                "No re-verification required",
                "Priority booking confirmations",
                "Potential reduced security deposits",
                "Trusted badge on your profile",
              ].map((benefit, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#10b981", fontSize: "12px" }}>✓</span>
                  <span style={{ color: "#ccc", fontSize: "13px" }}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Earn Trusted Status */}
        {trust?.status !== "trusted" && trust?.status !== "banned" && (
          <div style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "10px",
            padding: "20px 24px",
            marginBottom: "24px",
          }}>
            <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Path to Trusted Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Identity Verified", done: trust?.verificationStatus === "verified", href: "/renter/dashboard/settings" },
                { label: "License Uploaded & Approved", done: trust?.verificationStatus === "verified", href: "/renter/dashboard/settings" },
                { label: "Complete First Rental", done: (trust?.activityCount || 0) > 0, href: "/find-a-car" },
                { label: "No Active Fraud Signals", done: (trust?.recentSignals?.filter(s => s.severity === "high" || s.severity === "critical").length || 0) === 0, href: null },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    backgroundColor: step.done ? "rgba(16,185,129,0.15)" : "#111",
                    border: `1px solid ${step.done ? "#10b981" : "#333"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {step.done && <span style={{ color: "#10b981", fontSize: "11px" }}>✓</span>}
                  </div>
                  <span style={{ color: step.done ? "#10b981" : "#888", fontSize: "13px" }}>
                    {step.label}
                  </span>
                  {!step.done && step.href && (
                    <Link href={step.href} style={{ color: "#DC2626", fontSize: "11px", textDecoration: "none", marginLeft: "auto" }}>
                      Complete →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Signals */}
        {trust?.recentSignals && trust.recentSignals.length > 0 && (
          <div style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "10px",
            padding: "20px 24px",
            marginBottom: "24px",
          }}>
            <h3 style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 16px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Recent Security Events
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {trust.recentSignals.map(signal => (
                <div key={signal.id} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 12px",
                  backgroundColor: "#111",
                  borderRadius: "6px",
                  border: `1px solid ${SEVERITY_COLORS[signal.severity]}22`,
                }}>
                  <div style={{
                    width: "8px", height: "8px", borderRadius: "50%",
                    backgroundColor: SEVERITY_COLORS[signal.severity],
                    flexShrink: 0,
                  }} />
                  <span style={{ color: "#ccc", fontSize: "13px", flex: 1, textTransform: "capitalize" }}>
                    {signal.type.replace(/_/g, " ")}
                  </span>
                  <span style={{
                    color: SEVERITY_COLORS[signal.severity],
                    fontSize: "11px", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {signal.severity}
                  </span>
                  <span style={{ color: "#444", fontSize: "11px" }}>
                    {new Date(signal.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
        }}>
          {[
            { label: "Trust Score", value: trust?.score || 0, suffix: "/100" },
            { label: "Security Events", value: trust?.recentSignals?.length || 0, suffix: "" },
            { label: "Activity Logs", value: trust?.activityCount || 0, suffix: "" },
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              padding: "16px 20px",
            }}>
              <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>
                {stat.label}
              </p>
              <p style={{ color: "#ffffff", fontSize: "22px", fontWeight: 700, margin: 0 }}>
                {stat.value}<span style={{ color: "#444", fontSize: "14px" }}>{stat.suffix}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </RenterDashboardShell>
  );
}
