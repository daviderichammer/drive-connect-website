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

export default function OnboardingInsurancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [insuranceExpiry, setInsuranceExpiry] = useState("");
  const [dragOver, setDragOver] = useState(false);

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
        if (data.host.onboardingStep < 2) {
          router.push("/host/onboarding/vehicle");
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

    if (!file) {
      setError("Please upload your insurance document.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("insuranceDoc", file);
      if (insuranceExpiry) formData.append("insuranceExpiry", insuranceExpiry);

      const res = await fetch("/api/host/onboarding/insurance", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to upload insurance document.");
        setSaving(false);
        return;
      }

      router.push("/host/onboarding/banking");
    } catch {
      setError("An error occurred. Please try again.");
      setSaving(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  }

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
        <OnboardingProgress step={3} />

        <h1 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.5rem" }}>Insurance Documentation</h1>
        <p style={{ color: "#555555", marginBottom: "2.5rem", fontSize: "0.9375rem" }}>
          Upload your commercial auto insurance certificate. This is required to list vehicles on the Drive Network.
        </p>

        {error && (
          <div style={{ backgroundColor: "#1a0000", border: "1px solid #DC2626", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Upload Area */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="insuranceDoc"
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                display: "block",
                border: `2px dashed ${dragOver ? "#DC2626" : file ? "#22c55e" : "#333333"}`,
                borderRadius: "8px",
                padding: "3rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: dragOver ? "#1a0000" : file ? "#001a00" : "#0a0a0a",
                transition: "all 0.2s ease",
              }}
            >
              <input
                id="insuranceDoc"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {file ? (
                <>
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✓</div>
                  <div style={{ color: "#22c55e", fontWeight: 700, marginBottom: "0.25rem" }}>{file.name}</div>
                  <div style={{ color: "#555555", fontSize: "0.8125rem" }}>{(file.size / 1024 / 1024).toFixed(2)} MB — Click to change</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem", color: "#333333" }}>📄</div>
                  <div style={{ color: "#ffffff", fontWeight: 700, marginBottom: "0.5rem" }}>Drop your insurance document here</div>
                  <div style={{ color: "#555555", fontSize: "0.875rem" }}>or click to browse</div>
                  <div style={{ color: "#444444", fontSize: "0.75rem", marginTop: "0.75rem" }}>PDF, JPG, or PNG — Max 10MB</div>
                </>
              )}
            </label>
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Policy Expiration Date
            </label>
            <input
              type="date"
              value={insuranceExpiry}
              onChange={(e) => setInsuranceExpiry(e.target.value)}
              style={{ width: "100%", padding: "0.875rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "1.25rem", marginBottom: "2rem" }}>
            <p style={{ color: "#555555", fontSize: "0.8125rem", margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: "#888888" }}>Required:</strong> Commercial auto insurance with minimum liability coverage. Personal auto insurance is not sufficient for rental operations. Your certificate will be reviewed by our team.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/host/onboarding/vehicle"
              style={{ flex: 1, display: "block", textAlign: "center", backgroundColor: "transparent", border: "1px solid #333333", color: "#888888", textDecoration: "none", padding: "1rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.05em" }}
            >
              ← Back
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{ flex: 2, backgroundColor: saving ? "#991b1b" : "#DC2626", color: "#ffffff", border: "none", borderRadius: "6px", padding: "1rem", fontWeight: 700, fontSize: "0.9375rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}
            >
              {saving ? "Uploading..." : "Upload & Continue →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
