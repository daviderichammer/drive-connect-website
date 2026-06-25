"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
}

const CLAIM_TYPES = [
  { value: "smoking", label: "Smoking" },
  { value: "tire", label: "Tire Damage" },
  { value: "interior", label: "Interior Damage" },
  { value: "exterior", label: "Exterior Damage" },
  { value: "fuel", label: "Fuel Charge" },
  { value: "cleaning", label: "Cleaning Fee" },
  { value: "missing_accessory", label: "Missing Accessory" },
  { value: "late_return", label: "Late Return" },
];

export default function NewClaimPage() {
  const router = useRouter();
  const [host, setHost] = useState<HostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    bookingId: "",
    claimType: "exterior",
    amount: "",
    description: "",
  });
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fetchHost = useCallback(async () => {
    try {
      const res = await fetch("/api/host/me");
      if (!res.ok) { router.push("/host/login"); return; }
      const data = await res.json();
      setHost(data.host);
    } catch {
      router.push("/host/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchHost(); }, [fetchHost]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append("files", f));
      const res = await fetch("/api/operator/claims/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Upload failed."); return; }
      setEvidenceUrls(prev => [...prev, ...data.urls]);
      setSelectedFiles([]);
    } catch { setError("Upload failed."); }
    finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.bookingId || !form.claimType || !form.amount || !form.description) {
      setError("All fields are required.");
      return;
    }
    if (parseFloat(form.amount) <= 0) {
      setError("Amount must be greater than $0.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/operator/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: parseInt(form.bookingId),
          claimType: form.claimType,
          amount: parseFloat(form.amount),
          description: form.description,
          evidenceUrls,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to file claim."); return; }
      router.push(`/operator/claims/${data.claim.id}`);
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888" }}>Loading...</div>
    </div>
  );

  if (!host) return null;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      <div style={{ padding: "32px", maxWidth: "700px" }}>
        <div style={{ marginBottom: "28px" }}>
          <button onClick={() => router.push("/operator/claims")}
            style={{ backgroundColor: "transparent", border: "none", color: "#666", fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "12px" }}>
            ← Back to Claims
          </button>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: 0 }}>File New Claim</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "6px" }}>
            Document a damage or fee claim against a renter. They will be notified and can respond.
          </p>
        </div>

        {/* Notice */}
        <div style={{ backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", padding: "12px 16px", marginBottom: "24px" }}>
          <span style={{ color: "#888", fontSize: "13px" }}>
            <strong style={{ color: "#DC2626" }}>Reminder:</strong> Drive Connect does not adjudicate claims. Filing a claim opens a communication thread with the renter. Resolution is handled directly between both parties.
          </span>
        </div>

        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Booking ID */}
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Booking ID *</label>
              <input
                type="number"
                value={form.bookingId}
                onChange={e => setForm(f => ({ ...f, bookingId: e.target.value }))}
                placeholder="Enter the booking ID number"
                style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
              />
              <div style={{ color: "#555", fontSize: "11px", marginTop: "4px" }}>Find the booking ID in your Bookings page.</div>
            </div>

            {/* Claim Type */}
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Claim Type *</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                {CLAIM_TYPES.map(ct => (
                  <button key={ct.value} onClick={() => setForm(f => ({ ...f, claimType: ct.value }))}
                    style={{ backgroundColor: form.claimType === ct.value ? "rgba(220,38,38,0.15)" : "#111", border: `1px solid ${form.claimType === ct.value ? "#DC2626" : "#333"}`, borderRadius: "8px", padding: "10px 8px", color: form.claimType === ct.value ? "#DC2626" : "#aaa", fontSize: "12px", fontWeight: 600, cursor: "pointer", textAlign: "center" }}>
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Claim Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="e.g. 250.00"
                style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "14px", boxSizing: "border-box" }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe the damage or issue in detail. Include when it was discovered, the extent of damage, and any relevant context..."
                rows={5}
                style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label style={{ color: "#888", fontSize: "12px", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Evidence Photos</label>
              <div style={{ border: "2px dashed #333", borderRadius: "8px", padding: "20px", textAlign: "center" }}>
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} id="file-upload" style={{ display: "none" }} />
                <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                  <div style={{ color: "#555", fontSize: "14px", marginBottom: "8px" }}>📷 Click to select photos</div>
                  <div style={{ color: "#444", fontSize: "12px" }}>JPG, PNG, WEBP supported</div>
                </label>
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ color: "#aaa", fontSize: "12px", marginBottom: "8px" }}>{selectedFiles.length} file(s) selected</div>
                    <button onClick={handleUpload} disabled={uploading}
                      style={{ backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", cursor: uploading ? "not-allowed" : "pointer" }}>
                      {uploading ? "Uploading..." : "Upload Photos"}
                    </button>
                  </div>
                )}
                {evidenceUrls.length > 0 && (
                  <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                    {evidenceUrls.map((url, i) => (
                      <div key={i} style={{ position: "relative" }}>
                        <img src={url} alt={`Evidence ${i + 1}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #333" }} />
                        <button onClick={() => setEvidenceUrls(prev => prev.filter((_, idx) => idx !== i))}
                          style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && <div style={{ backgroundColor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", padding: "12px", marginTop: "16px", color: "#DC2626", fontSize: "13px" }}>{error}</div>}

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button onClick={handleSubmit} disabled={saving}
              style={{ flex: 1, backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: "8px", padding: "14px", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
              {saving ? "Filing Claim..." : "File Claim"}
            </button>
            <button onClick={() => router.push("/operator/claims")}
              style={{ flex: 1, backgroundColor: "transparent", color: "#aaa", border: "1px solid #333", borderRadius: "8px", padding: "14px", fontSize: "14px", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
