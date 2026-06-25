"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  phone: string | null;
  description: string | null;
  serviceAreas: string | null;
  bankAccountName: string | null;
  bankAccountType: string | null;
  payoutEmail: string | null;
  bankingInfoCompleted: boolean;
  profileCompleted: boolean;
  insuranceVerified: boolean;
  onboardingCompleted: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form
  const [profileForm, setProfileForm] = useState({ businessName: "", ownerName: "", phone: "", description: "", serviceAreas: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Banking form
  const [bankingForm, setBankingForm] = useState({ bankAccountName: "", bankAccountNumber: "", bankRoutingNumber: "", bankAccountType: "checking", payoutEmail: "" });
  const [bankingSaving, setBankingSaving] = useState(false);
  const [bankingMsg, setBankingMsg] = useState({ type: "", text: "" });

  // Password form
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    Promise.all([fetch("/api/host/me"), fetch("/api/host/dashboard/settings")])
      .then(async ([meRes, sRes]) => {
        if (meRes.status === 401) { router.push("/host/login"); return; }
        const meData = await meRes.json();
        if (!meData.authenticated || !meData.host.onboardingCompleted) { router.push("/host/login"); return; }
        setHost(meData.host);

        if (sRes.ok) {
          const sData = await sRes.json();
          const h = sData.host;
          setProfileForm({
            businessName: h.businessName || "",
            ownerName: h.ownerName || "",
            phone: h.phone || "",
            description: h.description || "",
            serviceAreas: h.serviceAreas || "",
          });
          setBankingForm({
            bankAccountName: h.bankAccountName || "",
            bankAccountNumber: "",
            bankRoutingNumber: "",
            bankAccountType: h.bankAccountType || "checking",
            payoutEmail: h.payoutEmail || "",
          });
        }
        setLoading(false);
      })
      .catch(() => router.push("/host/login"));
  }, [router]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ type: "", text: "" });
    const res = await fetch("/api/host/dashboard/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "profile", ...profileForm }),
    });
    const data = await res.json();
    setProfileSaving(false);
    if (!res.ok) {
      setProfileMsg({ type: "error", text: data.error || "Failed to save." });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
      if (host) setHost({ ...host, businessName: profileForm.businessName, ownerName: profileForm.ownerName });
    }
  };

  const saveBanking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankingSaving(true);
    setBankingMsg({ type: "", text: "" });
    const res = await fetch("/api/host/dashboard/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "banking", ...bankingForm }),
    });
    const data = await res.json();
    setBankingSaving(false);
    if (!res.ok) {
      setBankingMsg({ type: "error", text: data.error || "Failed to save." });
    } else {
      setBankingMsg({ type: "success", text: "Banking information updated." });
      setBankingForm((prev) => ({ ...prev, bankAccountNumber: "", bankRoutingNumber: "" }));
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ type: "", text: "" });
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." });
      return;
    }
    setPasswordSaving(true);
    const res = await fetch("/api/host/dashboard/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: "password", currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
    });
    const data = await res.json();
    setPasswordSaving(false);
    if (!res.ok) {
      setPasswordMsg({ type: "error", text: data.error || "Failed to update password." });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated successfully." });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const inputStyle = {
    width: "100%",
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    borderRadius: "6px",
    padding: "10px 14px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block" as const,
    color: "#666",
    fontSize: "11px",
    fontWeight: 700 as const,
    marginBottom: "6px",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  };

  const TABS = [
    { key: "profile", label: "Business Profile" },
    { key: "banking", label: "Banking & Payouts" },
    { key: "security", label: "Account Security" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>
        Loading settings...
      </div>
    );
  }

  if (!host) return null;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Profile & Settings</h2>
        <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>Manage your business profile and account settings</p>
      </div>

      {/* Status Banner */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Profile", done: host.profileCompleted },
          { label: "Insurance", done: host.insuranceVerified },
          { label: "Banking", done: host.bankingInfoCompleted },
        ].map(({ label, done }) => (
          <div key={label} style={{ backgroundColor: "#111111", border: `1px solid ${done ? "rgba(0,200,100,0.2)" : "rgba(255,180,0,0.2)"}`, borderRadius: "6px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px" }}>{done ? "✓" : "○"}</span>
            <div>
              <p style={{ color: done ? "#00C864" : "#FFB400", fontSize: "12px", fontWeight: 700, margin: 0 }}>{label}</p>
              <p style={{ color: "#555", fontSize: "11px", margin: 0 }}>{done ? "Complete" : "Pending"}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", borderBottom: "1px solid #1a1a1a", paddingBottom: "0" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              borderBottom: `2px solid ${activeTab === t.key ? "#C1121F" : "transparent"}`,
              color: activeTab === t.key ? "#fff" : "#555",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: activeTab === t.key ? 700 : 500,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              marginBottom: "-1px",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "28px", maxWidth: "640px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 24px" }}>Business Profile</h3>

          {profileMsg.text && (
            <div style={{ backgroundColor: profileMsg.type === "error" ? "rgba(193,18,31,0.1)" : "rgba(0,200,100,0.1)", border: `1px solid ${profileMsg.type === "error" ? "rgba(193,18,31,0.3)" : "rgba(0,200,100,0.3)"}`, borderRadius: "6px", padding: "10px 14px", marginBottom: "20px", color: profileMsg.type === "error" ? "#C1121F" : "#00C864", fontSize: "13px" }}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={saveProfile}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Business Name *</label>
                <input type="text" value={profileForm.businessName} onChange={(e) => setProfileForm((p) => ({ ...p, businessName: e.target.value }))} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Owner Name *</label>
                <input type="text" value={profileForm.ownerName} onChange={(e) => setProfileForm((p) => ({ ...p, ownerName: e.target.value }))} required style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} style={inputStyle} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={host.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: "not-allowed" }} />
              <p style={{ color: "#444", fontSize: "11px", margin: "4px 0 0" }}>Email cannot be changed. Contact support if needed.</p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Business Description</label>
              <textarea value={profileForm.description} onChange={(e) => setProfileForm((p) => ({ ...p, description: e.target.value }))} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Describe your rental business, specialties, and what makes you stand out..." />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Service Areas</label>
              <input type="text" value={profileForm.serviceAreas} onChange={(e) => setProfileForm((p) => ({ ...p, serviceAreas: e.target.value }))} style={inputStyle} placeholder="e.g., Miami, Fort Lauderdale, Boca Raton" />
              <p style={{ color: "#444", fontSize: "11px", margin: "4px 0 0" }}>Comma-separated list of cities or regions you serve.</p>
            </div>

            <button type="submit" disabled={profileSaving} style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "11px 28px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: profileSaving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: profileSaving ? 0.7 : 1 }}>
              {profileSaving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      )}

      {/* Banking Tab */}
      {activeTab === "banking" && (
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "28px", maxWidth: "640px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px" }}>Banking & Payout Information</h3>
          <p style={{ color: "#555", fontSize: "13px", margin: "0 0 24px" }}>
            Your banking information is used to process payouts. All data is encrypted and stored securely.
          </p>

          {bankingMsg.text && (
            <div style={{ backgroundColor: bankingMsg.type === "error" ? "rgba(193,18,31,0.1)" : "rgba(0,200,100,0.1)", border: `1px solid ${bankingMsg.type === "error" ? "rgba(193,18,31,0.3)" : "rgba(0,200,100,0.3)"}`, borderRadius: "6px", padding: "10px 14px", marginBottom: "20px", color: bankingMsg.type === "error" ? "#C1121F" : "#00C864", fontSize: "13px" }}>
              {bankingMsg.text}
            </div>
          )}

          <form onSubmit={saveBanking}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Account Holder Name</label>
              <input type="text" value={bankingForm.bankAccountName} onChange={(e) => setBankingForm((p) => ({ ...p, bankAccountName: e.target.value }))} style={inputStyle} placeholder="Name on bank account" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Account Number</label>
                <input type="password" value={bankingForm.bankAccountNumber} onChange={(e) => setBankingForm((p) => ({ ...p, bankAccountNumber: e.target.value }))} style={inputStyle} placeholder="Enter to update" autoComplete="new-password" />
              </div>
              <div>
                <label style={labelStyle}>Routing Number</label>
                <input type="password" value={bankingForm.bankRoutingNumber} onChange={(e) => setBankingForm((p) => ({ ...p, bankRoutingNumber: e.target.value }))} style={inputStyle} placeholder="Enter to update" autoComplete="new-password" />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Account Type</label>
                <select value={bankingForm.bankAccountType} onChange={(e) => setBankingForm((p) => ({ ...p, bankAccountType: e.target.value }))} style={inputStyle}>
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="business">Business Checking</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Payout Email (PayPal/Venmo)</label>
                <input type="email" value={bankingForm.payoutEmail} onChange={(e) => setBankingForm((p) => ({ ...p, payoutEmail: e.target.value }))} style={inputStyle} placeholder="Optional" />
              </div>
            </div>

            <div style={{ backgroundColor: "rgba(255,180,0,0.05)", border: "1px solid rgba(255,180,0,0.15)", borderRadius: "6px", padding: "12px 16px", marginBottom: "24px" }}>
              <p style={{ color: "#FFB400", fontSize: "12px", margin: 0 }}>
                Payouts are processed within 3–5 business days after a trip is completed. Platform fee of 15% is deducted from each payout.
              </p>
            </div>

            <button type="submit" disabled={bankingSaving} style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "11px 28px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: bankingSaving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: bankingSaving ? 0.7 : 1 }}>
              {bankingSaving ? "Saving..." : "Save Banking Info"}
            </button>
          </form>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "28px", maxWidth: "480px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 24px" }}>Change Password</h3>

          {passwordMsg.text && (
            <div style={{ backgroundColor: passwordMsg.type === "error" ? "rgba(193,18,31,0.1)" : "rgba(0,200,100,0.1)", border: `1px solid ${passwordMsg.type === "error" ? "rgba(193,18,31,0.3)" : "rgba(0,200,100,0.3)"}`, borderRadius: "6px", padding: "10px 14px", marginBottom: "20px", color: passwordMsg.type === "error" ? "#C1121F" : "#00C864", fontSize: "13px" }}>
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={savePassword}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} required style={inputStyle} autoComplete="current-password" />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} required minLength={8} style={inputStyle} autoComplete="new-password" />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} required style={inputStyle} autoComplete="new-password" />
            </div>
            <button type="submit" disabled={passwordSaving} style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "11px 28px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: passwordSaving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: passwordSaving ? 0.7 : 1 }}>
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </DashboardShell>
  );
}
