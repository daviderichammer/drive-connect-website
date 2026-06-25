"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  licenseNumber: string | null;
  licenseState: string | null;
  licenseVerified: boolean;
  createdAt: string;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC"
];

export default function RenterSettingsPage() {
  const router = useRouter();
  const [renter, setRenter] = useState<RenterData | null>(null);
  const [activeSection, setActiveSection] = useState<"profile" | "license" | "password" | "payment">("profile");
  const [loading, setLoading] = useState(true);

  // Profile form
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // License form
  const [licenseForm, setLicenseForm] = useState({ licenseNumber: "", licenseState: "" });
  const [licenseSaving, setLicenseSaving] = useState(false);
  const [licenseMsg, setLicenseMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/renter/me").then(async (res) => {
      if (res.status === 401) { router.push("/renter/login"); return; }
      const d = await res.json();
      if (!d.authenticated) { router.push("/renter/login"); return; }

      const settingsRes = await fetch("/api/renter/dashboard/settings");
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const r = data.renter;
        setRenter(r);
        setProfileForm({ firstName: r.firstName || "", lastName: r.lastName || "", phone: r.phone || "" });
        setLicenseForm({ licenseNumber: r.licenseNumber || "", licenseState: r.licenseState || "" });
      }
      setLoading(false);
    }).catch(() => router.push("/renter/login"));
  }, [router]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch("/api/renter/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateProfile", ...profileForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg({ type: "success", text: data.message });
        setRenter((prev) => prev ? { ...prev, ...profileForm } : null);
      } else {
        setProfileMsg({ type: "error", text: data.error });
      }
    } catch {
      setProfileMsg({ type: "error", text: "Network error." });
    }
    setProfileSaving(false);
  };

  const handleLicenseSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLicenseSaving(true);
    setLicenseMsg(null);
    try {
      const res = await fetch("/api/renter/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateLicense", ...licenseForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setLicenseMsg({ type: "success", text: data.message });
        setRenter((prev) => prev ? { ...prev, ...licenseForm, licenseVerified: false } : null);
      } else {
        setLicenseMsg({ type: "error", text: data.error });
      }
    } catch {
      setLicenseMsg({ type: "error", text: "Network error." });
    }
    setLicenseSaving(false);
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMsg(null);
    try {
      const res = await fetch("/api/renter/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "changePassword", ...passwordForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: "success", text: data.message });
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPasswordMsg({ type: "error", text: data.error });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Network error." });
    }
    setPasswordSaving(false);
  };

  if (!renter || loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    );
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
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#888888",
    marginBottom: "0.375rem",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  const sections = [
    { key: "profile" as const, label: "Personal Info" },
    { key: "license" as const, label: "Driver's License" },
    { key: "password" as const, label: "Change Password" },
    { key: "payment" as const, label: "Payment Methods" },
  ];

  const renderMessage = (msg: { type: "success" | "error"; text: string } | null) => {
    if (!msg) return null;
    return (
      <div style={{
        backgroundColor: msg.type === "success" ? "rgba(0,200,100,0.1)" : "rgba(193,18,31,0.1)",
        border: `1px solid ${msg.type === "success" ? "rgba(0,200,100,0.3)" : "rgba(193,18,31,0.3)"}`,
        borderRadius: "6px",
        padding: "0.875rem 1rem",
        marginBottom: "1.25rem",
        color: msg.type === "success" ? "#00C864" : "#ff6b6b",
        fontSize: "13px",
      }}>
        {msg.text}
      </div>
    );
  };

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.375rem" }}>Settings</h1>
        <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem" }}>
        {/* Section nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              style={{
                padding: "10px 16px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: activeSection === s.key ? "rgba(193,18,31,0.1)" : "transparent",
                color: activeSection === s.key ? "#C1121F" : "#888888",
                fontSize: "13px",
                fontWeight: activeSection === s.key ? 700 : 500,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "1.75rem" }}>
          {/* Profile */}
          {activeSection === "profile" && (
            <>
              <h2 style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: 700, margin: "0 0 1.5rem" }}>Personal Information</h2>
              {renderMessage(profileMsg)}
              <form onSubmit={handleProfileSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div>
                    <label style={labelStyle}>First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))}
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" value={renter.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
                  <p style={{ color: "#444444", fontSize: "11px", margin: "4px 0 0" }}>Email cannot be changed</p>
                </div>
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={labelStyle}>Phone Number</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="(555) 555-5555"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #1a1a1a" }}>
                  <p style={{ color: "#555555", fontSize: "12px", margin: "0 0 4px" }}>
                    Member since {new Date(renter.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={profileSaving}
                  style={{
                    padding: "0.875rem 2rem",
                    backgroundColor: profileSaving ? "#333333" : "#C1121F",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: profileSaving ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </>
          )}

          {/* License */}
          {activeSection === "license" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <h2 style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>Driver&apos;s License</h2>
                <span style={{
                  backgroundColor: renter.licenseVerified ? "rgba(0,200,100,0.1)" : "rgba(255,180,0,0.1)",
                  color: renter.licenseVerified ? "#00C864" : "#FFB400",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {renter.licenseVerified ? "Verified" : "Pending Verification"}
                </span>
              </div>
              {renderMessage(licenseMsg)}
              <form onSubmit={handleLicenseSave}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1.75rem" }}>
                  <div>
                    <label style={labelStyle}>License Number</label>
                    <input
                      type="text"
                      value={licenseForm.licenseNumber}
                      onChange={(e) => setLicenseForm((p) => ({ ...p, licenseNumber: e.target.value }))}
                      required
                      placeholder="D1234567"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <select
                      value={licenseForm.licenseState}
                      onChange={(e) => setLicenseForm((p) => ({ ...p, licenseState: e.target.value }))}
                      required
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      <option value="">State</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <p style={{ color: "#555555", fontSize: "12px", margin: "0 0 1.5rem" }}>
                  Updating your license will reset verification status and require re-review.
                </p>
                <button
                  type="submit"
                  disabled={licenseSaving}
                  style={{
                    padding: "0.875rem 2rem",
                    backgroundColor: licenseSaving ? "#333333" : "#C1121F",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: licenseSaving ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {licenseSaving ? "Saving..." : "Update License"}
                </button>
              </form>
            </>
          )}

          {/* Password */}
          {activeSection === "password" && (
            <>
              <h2 style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: 700, margin: "0 0 1.5rem" }}>Change Password</h2>
              {renderMessage(passwordMsg)}
              <form onSubmit={handlePasswordSave}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    required
                    placeholder="••••••••"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: "1.25rem" }}>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                    required
                    placeholder="Min. 8 characters"
                    style={inputStyle}
                  />
                </div>
                <div style={{ marginBottom: "1.75rem" }}>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    required
                    placeholder="Repeat new password"
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={passwordSaving}
                  style={{
                    padding: "0.875rem 2rem",
                    backgroundColor: passwordSaving ? "#333333" : "#C1121F",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: passwordSaving ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {passwordSaving ? "Changing..." : "Change Password"}
                </button>
              </form>
            </>
          )}

          {/* Payment */}
          {activeSection === "payment" && (
            <>
              <h2 style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: 700, margin: "0 0 1.5rem" }}>Payment Methods</h2>
              <div style={{
                backgroundColor: "#111111",
                border: "1px dashed #333333",
                borderRadius: "8px",
                padding: "3rem",
                textAlign: "center",
              }}>
                <p style={{ color: "#555555", fontSize: "14px", margin: "0 0 8px" }}>Payment processing coming soon</p>
                <p style={{ color: "#333333", fontSize: "12px", margin: 0 }}>
                  Secure payment methods will be added in a future update. Currently, payment is handled directly with hosts.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </RenterDashboardShell>
  );
}
