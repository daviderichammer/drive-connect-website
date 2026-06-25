"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Application {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  primaryCity: string;
  additionalCities: string | null;
  numberOfVehicles: number;
  vehicleTypes: string;
  currentPlatforms: string;
  turoProfileUrl: string | null;
  offersAirportDelivery: boolean;
  offersHomeDelivery: boolean;
  hasCommercialInsurance: boolean;
  supportsSameDayBookings: boolean;
  operates24x7: boolean;
  wouldUseDCSupport: boolean;
  status: string;
  adminNotes: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  approvalToken: string | null;
  approvalTokenUsed: boolean;
  createdAt: string;
  hostAccount: {
    id: number;
    onboardingStep: number;
    onboardingCompleted: boolean;
    profileCompleted: boolean;
    insuranceVerified: boolean;
    bankingInfoCompleted: boolean;
    lastLoginAt: string | null;
    createdAt: string;
  } | null;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "rgba(255, 165, 0, 0.1)", text: "#FFA500", border: "#FFA500" },
  approved: { bg: "rgba(0, 200, 100, 0.1)", text: "#00C864", border: "#00C864" },
  rejected: { bg: "rgba(193, 18, 31, 0.1)", text: "#C1121F", border: "#C1121F" },
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: "flex",
      padding: "12px 0",
      borderBottom: "1px solid #1a1a1a",
    }}>
      <span style={{
        width: "200px",
        flexShrink: 0,
        fontSize: "12px",
        fontWeight: 700,
        color: "#555555",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        paddingTop: "2px",
      }}>
        {label}
      </span>
      <span style={{ fontSize: "14px", color: "#cccccc", flex: 1 }}>
        {value}
      </span>
    </div>
  );
}

function BoolBadge({ value }: { value: boolean }) {
  return (
    <span style={{
      color: value ? "#00C864" : "#555555",
      fontWeight: 700,
      fontSize: "13px",
    }}>
      {value ? "✓ Yes" : "✗ No"}
    </span>
  );
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchApplication = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) {
        router.push("/admin/applications");
        return;
      }
      const data = await res.json();
      setApplication(data.application);
      setAdminNotes(data.application.adminNotes || "");
    } catch {
      console.error("Failed to fetch application");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this application?`)) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNotes }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Action failed." });
        return;
      }

      setMessage({ type: "success", text: data.message });
      await fetchApplication();
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#555555",
        fontFamily: "Inter, Arial, sans-serif",
      }}>
        Loading application...
      </div>
    );
  }

  if (!application) return null;

  const statusStyle = statusColors[application.status] || statusColors.pending;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      fontFamily: "Inter, Arial, sans-serif",
      color: "#ffffff",
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: "#000000",
        borderBottom: "1px solid #1a1a1a",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <h1 style={{
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 900,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: 0,
          }}>
            DRIVE CONNECT
          </h1>
          <span style={{
            backgroundColor: "#C1121F",
            color: "#ffffff",
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "4px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Admin
          </span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link
            href="/admin/applications"
            style={{
              color: "#888888",
              fontSize: "13px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            ← Back to Applications
          </Link>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #333333",
              color: "#888888",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "Inter, Arial, sans-serif",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <div style={{ padding: "32px", maxWidth: "960px", margin: "0 auto" }}>
        {/* Title Row */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "32px",
          gap: "16px",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
                {application.businessName}
              </h2>
              <span style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`,
                padding: "4px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "capitalize",
                letterSpacing: "0.05em",
              }}>
                {application.status}
              </span>
            </div>
            <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>
              Application #{application.id} · Submitted {formatDate(application.createdAt)}
            </p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            backgroundColor: message.type === "success" ? "rgba(0, 200, 100, 0.1)" : "rgba(193, 18, 31, 0.1)",
            border: `1px solid ${message.type === "success" ? "#00C864" : "#C1121F"}`,
            borderRadius: "6px",
            padding: "14px 16px",
            marginBottom: "24px",
            color: message.type === "success" ? "#00C864" : "#ff4444",
            fontSize: "14px",
          }}>
            {message.text}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
          {/* Left: Application Details */}
          <div>
            {/* Business Info */}
            <div style={{
              backgroundColor: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Business Information
              </h3>
              <InfoRow label="Business Name" value={application.businessName} />
              <InfoRow label="Owner Name" value={application.ownerName} />
              <InfoRow label="Email" value={<a href={`mailto:${application.email}`} style={{ color: "#C1121F", textDecoration: "none" }}>{application.email}</a>} />
              <InfoRow label="Phone" value={application.phone} />
              <InfoRow label="Primary City" value={application.primaryCity} />
              <InfoRow label="Additional Cities" value={application.additionalCities || "—"} />
              <InfoRow label="Number of Vehicles" value={application.numberOfVehicles} />
              <InfoRow label="Vehicle Types" value={application.vehicleTypes} />
              <InfoRow label="Current Platforms" value={application.currentPlatforms} />
              {application.turoProfileUrl && (
                <InfoRow label="Turo Profile" value={
                  <a href={application.turoProfileUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#C1121F", textDecoration: "none" }}>
                    View Profile →
                  </a>
                } />
              )}
            </div>

            {/* Operational Details */}
            <div style={{
              backgroundColor: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              padding: "24px",
              marginBottom: "24px",
            }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Operational Capabilities
              </h3>
              <InfoRow label="Airport Delivery" value={<BoolBadge value={application.offersAirportDelivery} />} />
              <InfoRow label="Home Delivery" value={<BoolBadge value={application.offersHomeDelivery} />} />
              <InfoRow label="Commercial Insurance" value={<BoolBadge value={application.hasCommercialInsurance} />} />
              <InfoRow label="Same Day Bookings" value={<BoolBadge value={application.supportsSameDayBookings} />} />
              <InfoRow label="24/7 Operations" value={<BoolBadge value={application.operates24x7} />} />
              <InfoRow label="Would Use DC Support" value={<BoolBadge value={application.wouldUseDCSupport} />} />
            </div>

            {/* Host Account Status (if approved) */}
            {application.hostAccount && (
              <div style={{
                backgroundColor: "#111111",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                  Host Account Status
                </h3>
                <InfoRow label="Account Created" value={formatDate(application.hostAccount.createdAt)} />
                <InfoRow label="Last Login" value={formatDate(application.hostAccount.lastLoginAt)} />
                <InfoRow label="Onboarding Step" value={`Step ${application.hostAccount.onboardingStep} of 4`} />
                <InfoRow label="Profile Complete" value={<BoolBadge value={application.hostAccount.profileCompleted} />} />
                <InfoRow label="Insurance Verified" value={<BoolBadge value={application.hostAccount.insuranceVerified} />} />
                <InfoRow label="Banking Complete" value={<BoolBadge value={application.hostAccount.bankingInfoCompleted} />} />
                <InfoRow label="Onboarding Done" value={<BoolBadge value={application.hostAccount.onboardingCompleted} />} />
              </div>
            )}
          </div>

          {/* Right: Actions Panel */}
          <div>
            {/* Review Actions */}
            {application.status === "pending" && (
              <div style={{
                backgroundColor: "#111111",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                  Review Decision
                </h3>

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
                    Admin Notes (optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal notes about this application..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333333",
                      borderRadius: "6px",
                      color: "#ffffff",
                      fontSize: "13px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "Inter, Arial, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  onClick={() => handleAction("approve")}
                  disabled={actionLoading}
                  style={{
                    width: "100%",
                    backgroundColor: actionLoading ? "#333333" : "#00C864",
                    color: "#000000",
                    border: "none",
                    borderRadius: "6px",
                    padding: "12px",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    fontFamily: "Inter, Arial, sans-serif",
                    marginBottom: "10px",
                  }}
                >
                  {actionLoading ? "Processing..." : "✓ Approve Application"}
                </button>

                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionLoading}
                  style={{
                    width: "100%",
                    backgroundColor: "transparent",
                    color: "#C1121F",
                    border: "1px solid #C1121F",
                    borderRadius: "6px",
                    padding: "12px",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    fontFamily: "Inter, Arial, sans-serif",
                  }}
                >
                  ✗ Reject Application
                </button>
              </div>
            )}

            {/* Review Status (if already reviewed) */}
            {application.status !== "pending" && (
              <div style={{
                backgroundColor: "#111111",
                border: `1px solid ${statusStyle.border}`,
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "24px",
              }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                  Review Status
                </h3>
                <p style={{ color: statusStyle.text, fontWeight: 700, fontSize: "16px", margin: "0 0 12px", textTransform: "capitalize" }}>
                  {application.status}
                </p>
                <p style={{ color: "#555555", fontSize: "13px", margin: "0 0 8px" }}>
                  Reviewed: {formatDate(application.reviewedAt)}
                </p>
                {application.reviewedBy && (
                  <p style={{ color: "#555555", fontSize: "13px", margin: "0 0 8px" }}>
                    By: {application.reviewedBy}
                  </p>
                )}
                {application.adminNotes && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1a1a1a" }}>
                    <p style={{ color: "#888888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 6px" }}>
                      Notes
                    </p>
                    <p style={{ color: "#cccccc", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>
                      {application.adminNotes}
                    </p>
                  </div>
                )}
                {application.status === "approved" && (
                  <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1a1a1a" }}>
                    <p style={{ color: "#888888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", margin: "0 0 6px" }}>
                      Registration Link
                    </p>
                    <p style={{ color: application.approvalTokenUsed ? "#555555" : "#00C864", fontSize: "12px", margin: 0 }}>
                      {application.approvalTokenUsed ? "✓ Registration completed" : "⏳ Awaiting registration"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Info */}
            <div style={{
              backgroundColor: "#111111",
              border: "1px solid #1a1a1a",
              borderRadius: "8px",
              padding: "24px",
            }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#888888", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
                Quick Summary
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#555555", fontSize: "13px" }}>Vehicles</span>
                  <span style={{ fontWeight: 700, fontSize: "16px" }}>{application.numberOfVehicles}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#555555", fontSize: "13px" }}>Commercial Insurance</span>
                  <BoolBadge value={application.hasCommercialInsurance} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#555555", fontSize: "13px" }}>Turo Host</span>
                  <BoolBadge value={!!application.turoProfileUrl} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#555555", fontSize: "13px" }}>24/7 Ops</span>
                  <BoolBadge value={application.operates24x7} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
