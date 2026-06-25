"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface Trip {
  id: number;
  bookingReference: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  basePrice: number;
  protectionPrice: number;
  deliveryPrice: number;
  taxes: number;
  protectionPlan: string;
  deliveryOption: string;
  deliveryAddress: string | null;
  vehicle: {
    id: number;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    photos: string | null;
    city: string | null;
    pickupInstructions: string | null;
  };
  host: {
    businessName: string;
    ownerName: string;
    phone: string | null;
    email: string;
  };
  hasReview: boolean;
  reviewId: number | null;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
    active: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
    completed: { bg: "rgba(100,100,100,0.1)", text: "#888888" },
    cancelled: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
    pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  };
  const sc = colors[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span style={{ backgroundColor: sc.bg, color: sc.text, fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {status}
    </span>
  );
}

function TripDetail({ trip, onCancel, onClose }: { trip: Trip; onCancel: (id: number) => void; onClose: () => void }) {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const now = new Date();
  const isUpcoming = start > now && ["confirmed", "pending"].includes(trip.status);
  const isActive = trip.status === "active";
  const isPast = trip.status === "completed" || trip.status === "cancelled";
  const photos = trip.vehicle.photos ? JSON.parse(trip.vehicle.photos) : [];
  const photo = photos[0] || null;

  // Countdown
  const msUntilStart = start.getTime() - now.getTime();
  const daysUntil = Math.floor(msUntilStart / (1000 * 60 * 60 * 24));
  const hoursUntil = Math.floor((msUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  // Return countdown for active trips
  const msUntilEnd = end.getTime() - now.getTime();
  const daysUntilReturn = Math.floor(msUntilEnd / (1000 * 60 * 60 * 24));
  const hoursUntilReturn = Math.floor((msUntilEnd % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this trip?")) return;
    setCancelling(true);
    setCancelError("");
    try {
      const res = await fetch("/api/renter/dashboard/trips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: trip.id, action: "cancel" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCancelError(data.error || "Failed to cancel.");
        setCancelling(false);
        return;
      }
      onCancel(trip.id);
    } catch {
      setCancelError("Network error.");
      setCancelling(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "#0a0a0a",
      border: "1px solid #1a1a1a",
      borderRadius: "10px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "4px" }}>
            <h2 style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>
              {trip.vehicle.year} {trip.vehicle.make} {trip.vehicle.model}
            </h2>
            <StatusBadge status={trip.status} />
          </div>
          <p style={{ color: "#555555", fontSize: "12px", margin: 0 }}>Ref: {trip.bookingReference}</p>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666666", cursor: "pointer", fontSize: "20px" }}>✕</button>
      </div>

      {/* Photo */}
      {photo && (
        <div style={{ height: "200px", overflow: "hidden" }}>
          <img src={photo} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}

      <div style={{ padding: "1.5rem" }}>
        {/* Countdown for upcoming */}
        {isUpcoming && msUntilStart > 0 && (
          <div style={{
            backgroundColor: "rgba(193,18,31,0.08)",
            border: "1px solid rgba(193,18,31,0.2)",
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}>
            <p style={{ color: "#888888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Trip Starts In</p>
            <p style={{ color: "#C1121F", fontSize: "2rem", fontWeight: 800, margin: 0 }}>
              {daysUntil}d {hoursUntil}h
            </p>
          </div>
        )}

        {/* Return countdown for active */}
        {isActive && msUntilEnd > 0 && (
          <div style={{
            backgroundColor: "rgba(0,150,255,0.08)",
            border: "1px solid rgba(0,150,255,0.2)",
            borderRadius: "8px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}>
            <p style={{ color: "#888888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Return In</p>
            <p style={{ color: "#0096FF", fontSize: "2rem", fontWeight: 800, margin: 0 }}>
              {daysUntilReturn}d {hoursUntilReturn}h
            </p>
          </div>
        )}

        {/* Trip dates */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ backgroundColor: "#111111", borderRadius: "6px", padding: "1rem" }}>
            <p style={{ color: "#555555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Pickup</p>
            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>
              {start.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </p>
            <p style={{ color: "#888888", fontSize: "12px", margin: 0 }}>{trip.pickupTime}</p>
          </div>
          <div style={{ backgroundColor: "#111111", borderRadius: "6px", padding: "1rem" }}>
            <p style={{ color: "#555555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Return</p>
            <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>
              {end.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </p>
            <p style={{ color: "#888888", fontSize: "12px", margin: 0 }}>{trip.returnTime}</p>
          </div>
        </div>

        {/* Host contact */}
        <div style={{ backgroundColor: "#111111", borderRadius: "6px", padding: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#555555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>Host</p>
          <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 4px" }}>{trip.host.businessName || trip.host.ownerName}</p>
          {trip.host.phone && (
            <a href={`tel:${trip.host.phone}`} style={{ color: "#C1121F", fontSize: "13px", textDecoration: "none" }}>
              {trip.host.phone}
            </a>
          )}
        </div>

        {/* Delivery info */}
        {trip.deliveryOption && (
          <div style={{ backgroundColor: "#111111", borderRadius: "6px", padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ color: "#555555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
              {trip.deliveryOption === "airport" ? "Airport Pickup" : trip.deliveryOption === "delivery" ? "Home Delivery" : "Pickup Location"}
            </p>
            {trip.deliveryAddress && (
              <p style={{ color: "#ffffff", fontSize: "13px", margin: 0 }}>{trip.deliveryAddress}</p>
            )}
            {trip.vehicle.pickupInstructions && (
              <p style={{ color: "#888888", fontSize: "12px", margin: "6px 0 0" }}>{trip.vehicle.pickupInstructions}</p>
            )}
          </div>
        )}

        {/* Price breakdown */}
        <div style={{ backgroundColor: "#111111", borderRadius: "6px", padding: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ color: "#555555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 10px" }}>Receipt</p>
          {[
            { label: "Base rental", value: trip.basePrice },
            { label: `Protection (${trip.protectionPlan})`, value: trip.protectionPrice },
            { label: "Delivery", value: trip.deliveryPrice },
            { label: "Taxes & fees", value: trip.taxes },
          ].map((item) => item.value > 0 && (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "#666666", fontSize: "13px" }}>{item.label}</span>
              <span style={{ color: "#888888", fontSize: "13px" }}>${item.value.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "1px solid #1a1a1a", marginTop: "4px" }}>
            <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700 }}>Total</span>
            <span style={{ color: "#C1121F", fontSize: "14px", fontWeight: 700 }}>${trip.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(isUpcoming || isActive) && (
            <Link href={`/renter/dashboard/messages?bookingId=${trip.id}`} style={{
              display: "block",
              padding: "0.875rem",
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Message Host
            </Link>
          )}

          {isPast && !trip.hasReview && trip.status === "completed" && (
            <Link href={`/renter/dashboard/reviews?bookingId=${trip.id}`} style={{
              display: "block",
              padding: "0.875rem",
              backgroundColor: "#C1121F",
              color: "#ffffff",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>
              Leave a Review
            </Link>
          )}

          {isUpcoming && (
            <>
              {cancelError && (
                <p style={{ color: "#ff6b6b", fontSize: "12px", margin: 0, textAlign: "center" }}>{cancelError}</p>
              )}
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  padding: "0.875rem",
                  backgroundColor: "transparent",
                  color: "#ff6b6b",
                  border: "1px solid rgba(255,50,50,0.3)",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: cancelling ? "not-allowed" : "pointer",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {cancelling ? "Cancelling..." : "Cancel Trip"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TripsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = searchParams.get("filter") || "upcoming";
  const selectedId = searchParams.get("id") ? parseInt(searchParams.get("id")!) : null;

  const [renter, setRenter] = useState<RenterData | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [filter, setFilter] = useState(filterParam);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async (f: string) => {
    setLoading(true);
    const res = await fetch(`/api/renter/dashboard/trips?filter=${f}`);
    if (res.ok) {
      const data = await res.json();
      setTrips(data.trips || []);
      if (selectedId) {
        const found = data.trips.find((t: Trip) => t.id === selectedId);
        if (found) setSelectedTrip(found);
      }
    }
    setLoading(false);
  }, [selectedId]);

  useEffect(() => {
    fetch("/api/renter/me").then(async (res) => {
      if (res.status === 401) { router.push("/renter/login"); return; }
      const d = await res.json();
      if (!d.authenticated) { router.push("/renter/login"); return; }
      setRenter(d.renter);
      await fetchTrips(filter);
    }).catch(() => router.push("/renter/login"));
  }, [router, filter, fetchTrips]);

  const handleFilterChange = (f: string) => {
    setFilter(f);
    setSelectedTrip(null);
    fetchTrips(f);
  };

  const handleCancel = (id: number) => {
    setTrips((prev) => prev.map((t) => t.id === id ? { ...t, status: "cancelled" } : t));
    if (selectedTrip?.id === id) setSelectedTrip((prev) => prev ? { ...prev, status: "cancelled" } : null);
  };

  if (!renter) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    );
  }

  const photos = (trip: Trip) => trip.vehicle.photos ? JSON.parse(trip.vehicle.photos) : [];

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.375rem" }}>My Trips</h1>
        <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>View and manage all your rentals</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "active", label: "Active" },
          { key: "past", label: "Past" },
          { key: "all", label: "All" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: filter === tab.key ? "#C1121F" : "#111111",
              color: filter === tab.key ? "#ffffff" : "#888888",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedTrip ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
        {/* Trip list */}
        <div>
          {loading ? (
            <div style={{ color: "#555555", fontSize: "14px", textAlign: "center", padding: "3rem" }}>Loading trips...</div>
          ) : trips.length === 0 ? (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "#444444", fontSize: "14px", margin: "0 0 1.25rem" }}>No {filter !== "all" ? filter : ""} trips found</p>
              {filter !== "past" && (
                <Link href="/find-a-car" style={{
                  display: "inline-block",
                  backgroundColor: "#C1121F",
                  color: "#ffffff",
                  padding: "10px 24px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  Find a Car
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {trips.map((trip) => {
                const start = new Date(trip.startDate);
                const end = new Date(trip.endDate);
                const photo = photos(trip)[0] || null;
                const isSelected = selectedTrip?.id === trip.id;

                return (
                  <div
                    key={trip.id}
                    onClick={() => setSelectedTrip(isSelected ? null : trip)}
                    style={{
                      backgroundColor: isSelected ? "#111111" : "#0a0a0a",
                      border: `1px solid ${isSelected ? "#C1121F" : "#1a1a1a"}`,
                      borderRadius: "8px",
                      overflow: "hidden",
                      display: "flex",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div style={{ width: "100px", flexShrink: 0, backgroundColor: "#111111" }}>
                      {photo ? (
                        <img src={photo} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", minHeight: "90px", display: "flex", alignItems: "center", justifyContent: "center", color: "#333333" }}>◈</div>
                      )}
                    </div>
                    <div style={{ flex: 1, padding: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                        <h3 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, margin: 0 }}>
                          {trip.vehicle.year} {trip.vehicle.make} {trip.vehicle.model}
                        </h3>
                        <StatusBadge status={trip.status} />
                      </div>
                      <p style={{ color: "#666666", fontSize: "12px", margin: "0 0 6px" }}>
                        {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#555555", fontSize: "11px" }}>{trip.bookingReference}</span>
                        <span style={{ color: "#C1121F", fontSize: "13px", fontWeight: 700 }}>${trip.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trip detail panel */}
        {selectedTrip && (
          <div>
            <TripDetail trip={selectedTrip} onCancel={handleCancel} onClose={() => setSelectedTrip(null)} />
          </div>
        )}
      </div>
    </RenterDashboardShell>
  );
}

function RenterTripsPageInner() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    }>
      <TripsContent />
    </Suspense>
  );
}

export default function RenterTripsPage() {
  return (
    <Suspense fallback={<div style={{color:"#888",padding:"40px",textAlign:"center"}}>Loading...</div>}>
      <RenterTripsPageInner />
    </Suspense>
  );
}
