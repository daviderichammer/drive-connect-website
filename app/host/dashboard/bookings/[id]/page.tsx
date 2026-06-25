"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
}

interface BookingDetail {
  id: number;
  bookingReference: string;
  renterFirstName: string;
  renterLastName: string;
  renterEmail: string;
  renterPhone: string;
  renterLicenseNumber: string;
  renterLicenseState: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  deliveryOption: string;
  deliveryAddress: string | null;
  protectionPlan: string;
  basePrice: number;
  protectionPrice: number;
  deliveryPrice: number;
  taxes: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  vehicle: {
    id: number;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    color: string | null;
    dailyRate: number;
    photos: string[];
    city: string | null;
  };
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
    active: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
    completed: { bg: "rgba(100,100,100,0.1)", text: "#888888" },
    cancelled: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
    pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  };
  const c = colors[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "4px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [host, setHost] = useState<HostData | null>(null);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/host/me"),
      fetch(`/api/host/dashboard/bookings/${params.id}`),
    ]).then(async ([meRes, bRes]) => {
      if (meRes.status === 401) { router.push("/host/login"); return; }
      const meData = await meRes.json();
      if (!meData.authenticated || !meData.host.onboardingCompleted) { router.push("/host/login"); return; }
      setHost(meData.host);
      if (bRes.ok) {
        const bData = await bRes.json();
        setBooking(bData.booking);
      } else {
        setError("Booking not found.");
      }
      setLoading(false);
    }).catch(() => router.push("/host/login"));
  }, [router, params.id]);

  const handleAction = async (action: string) => {
    if (!booking) return;
    setActionLoading(true);
    const res = await fetch(`/api/host/dashboard/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setActionLoading(false);

    if (!res.ok) {
      setError(data.error || "Action failed.");
      return;
    }

    setMessage(`Booking ${action}ed successfully.`);
    setBooking((prev) => prev ? { ...prev, status: data.booking.status } : null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const calcDays = (start: string, end: string) =>
    Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>
        Loading...
      </div>
    );
  }

  if (!host) return null;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/host/dashboard/bookings" style={{ color: "#555", fontSize: "13px", textDecoration: "none" }}>
          ← Back to Bookings
        </Link>
      </div>

      {error && (
        <div style={{ backgroundColor: "rgba(193,18,31,0.1)", border: "1px solid rgba(193,18,31,0.3)", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "#C1121F", fontSize: "13px" }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{ backgroundColor: "rgba(0,200,100,0.1)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "#00C864", fontSize: "13px" }}>
          {message}
        </div>
      )}

      {booking && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
          {/* Main */}
          <div>
            {/* Header */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <p style={{ color: "#C1121F", fontSize: "20px", fontWeight: 700, fontFamily: "monospace", margin: "0 0 8px" }}>
                    {booking.bookingReference}
                  </p>
                  <StatusBadge status={booking.status} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#555", fontSize: "11px", margin: "0 0 4px" }}>Booked on</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>
                    {new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Trip Timeline */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "center", backgroundColor: "#0a0a0a", borderRadius: "6px", padding: "16px" }}>
                <div>
                  <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>PICKUP</p>
                  <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>{formatDate(booking.startDate)}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.pickupTime}</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#C1121F", fontSize: "13px", fontWeight: 700, margin: 0 }}>
                    {calcDays(booking.startDate, booking.endDate)} days
                  </p>
                  <div style={{ width: "60px", height: "1px", backgroundColor: "#333", margin: "6px auto" }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>RETURN</p>
                  <p style={{ color: "#fff", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>{formatDate(booking.endDate)}</p>
                  <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>{booking.returnTime}</p>
                </div>
              </div>
            </div>

            {/* Vehicle */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "20px" }}>
              <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>VEHICLE</p>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                {booking.vehicle.photos?.[0] && (
                  <img src={booking.vehicle.photos[0]} alt="Vehicle" style={{ width: "80px", height: "56px", objectFit: "cover", borderRadius: "4px" }} />
                )}
                <div>
                  <p style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 4px" }}>
                    {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                    {booking.vehicle.trim ? ` ${booking.vehicle.trim}` : ""}
                  </p>
                  {booking.vehicle.color && (
                    <p style={{ color: "#888", fontSize: "12px", margin: "0 0 2px" }}>{booking.vehicle.color}</p>
                  )}
                  {booking.vehicle.city && (
                    <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>{booking.vehicle.city}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Renter */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", marginBottom: "20px" }}>
              <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>RENTER INFORMATION</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Name", value: `${booking.renterFirstName} ${booking.renterLastName}` },
                  { label: "Email", value: booking.renterEmail },
                  { label: "Phone", value: booking.renterPhone },
                  { label: "License", value: `${booking.renterLicenseNumber} (${booking.renterLicenseState})` },
                  { label: "Delivery", value: booking.deliveryOption },
                  ...(booking.deliveryAddress ? [{ label: "Address", value: booking.deliveryAddress }] : []),
                  { label: "Protection Plan", value: booking.protectionPlan },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ color: "#444", fontSize: "11px", margin: "0 0 2px" }}>{label}</p>
                    <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Pricing */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
              <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>PRICING BREAKDOWN</p>
              {[
                { label: "Base Price", value: booking.basePrice },
                { label: "Protection", value: booking.protectionPrice },
                { label: "Delivery", value: booking.deliveryPrice },
                { label: "Taxes (7%)", value: booking.taxes },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#555", fontSize: "13px" }}>{label}</span>
                  <span style={{ color: "#888", fontSize: "13px" }}>${value.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1a1a1a", paddingTop: "12px", marginTop: "4px" }}>
                <span style={{ color: "#fff", fontSize: "15px", fontWeight: 700 }}>Total</span>
                <span style={{ color: "#C1121F", fontSize: "15px", fontWeight: 700 }}>${booking.totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1a1a1a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#555", fontSize: "12px" }}>Platform Fee (15%)</span>
                  <span style={{ color: "#555", fontSize: "12px" }}>-${(booking.totalPrice * 0.15).toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#00C864", fontSize: "13px", fontWeight: 700 }}>Your Net</span>
                  <span style={{ color: "#00C864", fontSize: "13px", fontWeight: 700 }}>${(booking.totalPrice * 0.85).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
              <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>ACTIONS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {booking.status === "pending" && (
                  <>
                    <button onClick={() => handleAction("confirm")} disabled={actionLoading} style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                      Confirm Booking
                    </button>
                    <button onClick={() => handleAction("cancel")} disabled={actionLoading} style={{ backgroundColor: "transparent", border: "1px solid rgba(193,18,31,0.3)", color: "#C1121F", padding: "10px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                      Cancel Booking
                    </button>
                  </>
                )}
                {booking.status === "confirmed" && (
                  <>
                    <button onClick={() => handleAction("activate")} disabled={actionLoading} style={{ backgroundColor: "#0096FF", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                      Mark Active (Picked Up)
                    </button>
                    <button onClick={() => handleAction("cancel")} disabled={actionLoading} style={{ backgroundColor: "transparent", border: "1px solid rgba(193,18,31,0.3)", color: "#C1121F", padding: "10px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                      Cancel Booking
                    </button>
                  </>
                )}
                {booking.status === "active" && (
                  <button onClick={() => handleAction("complete")} disabled={actionLoading} style={{ backgroundColor: "#00C864", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    Mark Completed (Returned)
                  </button>
                )}
                <Link
                  href={`/host/dashboard/messages?bookingId=${booking.id}`}
                  style={{ backgroundColor: "transparent", border: "1px solid #222", color: "#888", padding: "10px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif", textDecoration: "none", textAlign: "center", display: "block" }}
                >
                  Message Renter
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
