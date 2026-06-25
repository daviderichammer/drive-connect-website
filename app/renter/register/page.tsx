"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC"
];

export default function RenterRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
    licenseState: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/renter/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          licenseNumber: form.licenseNumber,
          licenseState: form.licenseState,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }
      router.push("/renter/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

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

  return (
    <>
      <nav style={{
        position: "fixed" as const,
        top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: "#000000",
        borderBottom: "1px solid #111111",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ color: "#ffffff", fontWeight: 900, fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            DRIVE CONNECT
          </span>
        </Link>
        <Link href="/renter/login" style={{ color: "#888888", fontSize: "0.875rem", textDecoration: "none" }}>
          Sign In
        </Link>
      </nav>

      <div style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "80px 1rem 4rem",
      }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              display: "inline-block",
              backgroundColor: "rgba(193,18,31,0.1)",
              border: "1px solid rgba(193,18,31,0.2)",
              borderRadius: "6px",
              padding: "6px 14px",
              marginBottom: "1.25rem",
            }}>
              <span style={{ color: "#C1121F", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Create Account
              </span>
            </div>
            <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
              Start Renting Today
            </h1>
            <p style={{ color: "#666666", fontSize: "0.9375rem", margin: 0 }}>
              Lower prices. Better vehicles. Simple process.
            </p>
          </div>

          <div style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "10px",
            padding: "2rem",
          }}>
            {error && (
              <div style={{
                backgroundColor: "rgba(193,18,31,0.1)",
                border: "1px solid rgba(193,18,31,0.3)",
                borderRadius: "6px",
                padding: "0.875rem 1rem",
                marginBottom: "1.5rem",
                color: "#ff6b6b",
                fontSize: "0.875rem",
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input name="firstName" type="text" value={form.firstName} onChange={handleChange} required placeholder="John" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input name="lastName" type="text" value={form.lastName} onChange={handleChange} required placeholder="Doe" style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" style={inputStyle} />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Phone Number</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(555) 555-5555" style={inputStyle} />
              </div>

              {/* License Section */}
              <div style={{
                backgroundColor: "#111111",
                border: "1px solid #222222",
                borderRadius: "6px",
                padding: "1.25rem",
                marginBottom: "1.25rem",
              }}>
                <p style={{ color: "#888888", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 1rem" }}>
                  Driver&apos;s License
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>License Number</label>
                    <input name="licenseNumber" type="text" value={form.licenseNumber} onChange={handleChange} required placeholder="D1234567" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <select name="licenseState" value={form.licenseState} onChange={handleChange} required style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="">State</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={labelStyle}>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min. 8 characters" style={inputStyle} />
              </div>

              <div style={{ marginBottom: "1.75rem" }}>
                <label style={labelStyle}>Confirm Password</label>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat password" style={inputStyle} />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.9375rem",
                  backgroundColor: loading ? "#333333" : "#C1121F",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #1a1a1a" }}>
              <p style={{ color: "#666666", fontSize: "0.875rem", margin: 0 }}>
                Already have an account?{" "}
                <Link href="/renter/login" style={{ color: "#C1121F", textDecoration: "none", fontWeight: 600 }}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
