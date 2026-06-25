"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
}

interface Booking {
  id: number;
  bookingReference: string;
  renterFirstName: string;
  renterLastName: string;
  renterEmail: string;
  renterPhone: string;
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
    photos: string[];
  };
}

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "upcoming", label: "Upcoming" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

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
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "3px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>
      {status}
    </span>
  );
}

function BookingsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [host, setHost] = useState<HostData | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(searchParams.get("status") || "all");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBookings = useCallback(async (filter: string, p: number) => {
    const res = await fetch(`/api/host/dashboard/bookings?status=${filter}&page=${p}&limit=15`);
    if (res.ok) {
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    }
  }, []);

  useEffect(() => {
    fetch("/api/host/me").then(async (res) => {
      if (res.status === 401) { router.push("/host/login"); return; }
      const data = await res.json();
      if (!data.authenticated || !data.host.onboardingCompleted) { router.push("/host/login"); return; }
      setHost(data.host);
      await fetchBookings(activeFilter, page);
      setLoading(false);
    }).catch(() => router.push("/host/login"));
  }, [router, activeFilter, page, fetchBookings]);

  const handleFilter = (f: string) => {
    setActiveFilter(f);
    setPage(1);
    setSelectedBooking(null);
  };

  const handleAction = async (bookingId: number, action: string) => {
    setActionLoading(true);
    const res = await fetch(`/api/host/dashboard/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    setActionLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Action failed.");
      return;
    }

    setMessage(`Booking ${action}ed successfully.`);
    await fetchBookings(activeFilter, page);

    if (selectedBooking?.id === bookingId) {
      const updated = bookings.find((b) => b.id === bookingId);
      if (updated) setSelectedBooking({ ...updated, status: data.booking.status });
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const calcDays = (start: string, end: string) =>
    Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>
        Loading bookings...
      </div>
    );
  }

  if (!host) return null;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Booking Management</h2>
        <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>{total} total booking{total !== 1 ? "s" : ""}</p>
      </div>

      {message && (
        <div style={{ backgroundColor: "rgba(0,200,100,0.1)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "#00C864", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
          {message}
          <button onClick={() => setMessage("")} style={{ background: "none", border: "none", color: "#00C864", cursor: "pointer" }}>×</button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => handleFilter(f.key)}
            style={{
              backgroundColor: activeFilter === f.key ? "#C1121F" : "#111111",
              color: activeFilter === f.key ? "#fff" : "#888",
              border: `1px solid ${activeFilter === f.key ? "#C1121F" : "#222"}`,
              padding: "7px 16px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              letterSpacing: "0.03em",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedBooking ? "1fr 380px" : "1fr", gap: "20px" }}>
        {/* Bookings Table */}
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
          {bookings.length === 0 ? (
            <div style={{ padding: "64px", textAlign: "center", color: "#555" }}>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>No bookings found.</p>
              <p style={{ fontSize: "13px" }}>
                {activeFilter !== "all" ? "Try a different filter." : "Bookings will appear here once renters reserve your vehicles."}
              </p>
            </div>
          ) : (
            <>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                    {["Reference", "Renter", "Vehicle", "Dates", "Total", "Status", ""].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      style={{ borderBottom: "1px solid #0d0d0d", backgroundColor: selectedBooking?.id === b.id ? "rgba(193,18,31,0.05)" : "transparent", cursor: "pointer" }}
                      onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ color: "#C1121F", fontSize: "12px", fontWeight: 700, fontFamily: "monospace" }}>
                          {b.bookingReference}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 2px" }}>{b.renterFirstName} {b.renterLastName}</p>
                        <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>{b.renterEmail}</p>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                        {b.vehicle.year} {b.vehicle.make} {b.vehicle.model}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <p style={{ fontSize: "12px", margin: "0 0 2px" }}>{formatDate(b.startDate)}</p>
                        <p style={{ fontSize: "11px", color: "#555", margin: 0 }}>{calcDays(b.startDate, b.endDate)} days</p>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600 }}>
                        ${b.totalPrice.toFixed(2)}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <StatusBadge status={b.status} />
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <Link
                          href={`/host/dashboard/bookings/${b.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: "#555", fontSize: "11px", textDecoration: "none" }}
                        >
                          Details →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#555", fontSize: "12px" }}>
                    Page {page} of {totalPages}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={{ backgroundColor: "transparent", border: "1px solid #222", color: "#888", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: page === 1 ? 0.5 : 1 }}
                    >
                      ← Prev
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      style={{ backgroundColor: "transparent", border: "1px solid #222", color: "#888", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: page === totalPages ? 0.5 : 1 }}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Detail Panel */}
        {selectedBooking && (
          <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "24px", alignSelf: "start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>Booking Detail</h3>
              <button onClick={() => setSelectedBooking(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px" }}>×</button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#C1121F", fontSize: "16px", fontWeight: 700, fontFamily: "monospace", margin: "0 0 4px" }}>
                {selectedBooking.bookingReference}
              </p>
              <StatusBadge status={selectedBooking.status} />
            </div>

            {[
              { label: "Vehicle", value: `${selectedBooking.vehicle.year} ${selectedBooking.vehicle.make} ${selectedBooking.vehicle.model}` },
              { label: "Renter", value: `${selectedBooking.renterFirstName} ${selectedBooking.renterLastName}` },
              { label: "Email", value: selectedBooking.renterEmail },
              { label: "Phone", value: selectedBooking.renterPhone },
              { label: "Pickup", value: `${formatDate(selectedBooking.startDate)} at ${selectedBooking.pickupTime}` },
              { label: "Return", value: `${formatDate(selectedBooking.endDate)} at ${selectedBooking.returnTime}` },
              { label: "Duration", value: `${calcDays(selectedBooking.startDate, selectedBooking.endDate)} days` },
              { label: "Delivery", value: selectedBooking.deliveryOption },
              { label: "Protection", value: selectedBooking.protectionPlan },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #0d0d0d", paddingBottom: "10px" }}>
                <span style={{ color: "#555", fontSize: "12px" }}>{label}</span>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
              </div>
            ))}

            {/* Pricing breakdown */}
            <div style={{ backgroundColor: "#0a0a0a", borderRadius: "6px", padding: "12px", marginBottom: "16px" }}>
              {[
                { label: "Base Price", value: selectedBooking.basePrice },
                { label: "Protection", value: selectedBooking.protectionPrice },
                { label: "Delivery", value: selectedBooking.deliveryPrice },
                { label: "Taxes", value: selectedBooking.taxes },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#555", fontSize: "12px" }}>{label}</span>
                  <span style={{ color: "#888", fontSize: "12px" }}>${value.toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #1a1a1a", paddingTop: "8px", marginTop: "4px" }}>
                <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>Total</span>
                <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>${selectedBooking.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAction(selectedBooking.id, "confirm")}
                    disabled={actionLoading}
                    style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => handleAction(selectedBooking.id, "cancel")}
                    disabled={actionLoading}
                    style={{ backgroundColor: "transparent", border: "1px solid rgba(193,18,31,0.3)", color: "#C1121F", padding: "10px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {selectedBooking.status === "confirmed" && (
                <>
                  <button
                    onClick={() => handleAction(selectedBooking.id, "activate")}
                    disabled={actionLoading}
                    style={{ backgroundColor: "#0096FF", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Mark as Active (Vehicle Picked Up)
                  </button>
                  <button
                    onClick={() => handleAction(selectedBooking.id, "cancel")}
                    disabled={actionLoading}
                    style={{ backgroundColor: "transparent", border: "1px solid rgba(193,18,31,0.3)", color: "#C1121F", padding: "10px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                  >
                    Cancel Booking
                  </button>
                </>
              )}
              {selectedBooking.status === "active" && (
                <button
                  onClick={() => handleAction(selectedBooking.id, "complete")}
                  disabled={actionLoading}
                  style={{ backgroundColor: "#00C864", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                >
                  Mark as Completed (Vehicle Returned)
                </button>
              )}
              <Link
                href={`/host/dashboard/messages?bookingId=${selectedBooking.id}`}
                style={{ backgroundColor: "transparent", border: "1px solid #222", color: "#888", padding: "10px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif", textDecoration: "none", textAlign: "center", display: "block" }}
              >
                Message Renter
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>Loading...</div>}>
      <BookingsPageInner />
    </Suspense>
  );
}
