"use client";
import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface Review {
  id: number;
  rating: number;
  text: string | null;
  createdAt: string;
  vehicle: { year: number; make: string; model: string; photos: string | null };
  booking: { bookingReference: string; startDate: string; endDate: string };
}

interface PendingBooking {
  id: number;
  bookingReference: string;
  startDate: string;
  endDate: string;
  vehicle: { year: number; make: string; model: string; photos: string | null };
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            background: "none",
            border: "none",
            cursor: onChange ? "pointer" : "default",
            fontSize: "24px",
            color: star <= (hover || value) ? "#FFB400" : "#333333",
            padding: "0 2px",
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdParam = searchParams.get("bookingId");

  const [renter, setRenter] = useState<RenterData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "past">(bookingIdParam ? "pending" : "pending");

  // Review form state
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    bookingIdParam ? parseInt(bookingIdParam) : null
  );
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    const [reviewsRes, pendingRes] = await Promise.all([
      fetch("/api/renter/dashboard/reviews"),
      fetch("/api/renter/dashboard/trips?filter=pending_review"),
    ]);
    if (reviewsRes.ok) {
      const data = await reviewsRes.json();
      setReviews(data.reviews || []);
    }
    if (pendingRes.ok) {
      const data = await pendingRes.json();
      setPendingBookings(data.trips || []);
    }
  }, []);

  useEffect(() => {
    fetch("/api/renter/me").then(async (res) => {
      if (res.status === 401) { router.push("/renter/login"); return; }
      const d = await res.json();
      if (!d.authenticated) { router.push("/renter/login"); return; }
      setRenter(d.renter);
      await fetchData();
      setLoading(false);
    }).catch(() => router.push("/renter/login"));
  }, [router, fetchData]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || rating === 0) {
      setSubmitError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/renter/dashboard/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: selectedBookingId, rating, text: reviewText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }
      setSubmitSuccess(true);
      setSelectedBookingId(null);
      setRating(0);
      setReviewText("");
      await fetchData();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError("Network error.");
    }
    setSubmitting(false);
  };

  if (!renter) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    );
  }

  const selectedBooking = pendingBookings.find((b) => b.id === selectedBookingId);

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.375rem" }}>Reviews</h1>
        <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>Rate your rental experiences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {[
          { key: "pending" as const, label: `Pending Reviews (${pendingBookings.length})` },
          { key: "past" as const, label: `My Reviews (${reviews.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 18px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: activeTab === tab.key ? "#C1121F" : "#111111",
              color: activeTab === tab.key ? "#ffffff" : "#888888",
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

      {submitSuccess && (
        <div style={{
          backgroundColor: "rgba(0,200,100,0.1)",
          border: "1px solid rgba(0,200,100,0.3)",
          borderRadius: "8px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          color: "#00C864",
          fontSize: "14px",
          fontWeight: 600,
        }}>
          ✓ Review submitted successfully!
        </div>
      )}

      {/* Pending Reviews Tab */}
      {activeTab === "pending" && (
        <div style={{ display: "grid", gridTemplateColumns: selectedBookingId ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
          {/* Pending list */}
          <div>
            {loading ? (
              <div style={{ color: "#555555", fontSize: "14px", textAlign: "center", padding: "3rem" }}>Loading...</div>
            ) : pendingBookings.length === 0 ? (
              <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "3rem", textAlign: "center" }}>
                <p style={{ color: "#444444", fontSize: "14px", margin: 0 }}>No pending reviews</p>
                <p style={{ color: "#333333", fontSize: "12px", margin: "8px 0 0" }}>Reviews become available after completing a trip</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {pendingBookings.map((booking) => {
                  const photos = booking.vehicle.photos ? JSON.parse(booking.vehicle.photos) : [];
                  const photo = photos[0] || null;
                  const isSelected = selectedBookingId === booking.id;

                  return (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBookingId(isSelected ? null : booking.id)}
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
                      <div style={{ width: "90px", flexShrink: 0, backgroundColor: "#111111" }}>
                        {photo ? (
                          <img src={photo} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center", color: "#333333" }}>◈</div>
                        )}
                      </div>
                      <div style={{ flex: 1, padding: "14px" }}>
                        <h3 style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, margin: "0 0 4px" }}>
                          {booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}
                        </h3>
                        <p style={{ color: "#666666", fontSize: "12px", margin: "0 0 6px" }}>
                          {new Date(booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                        <span style={{ backgroundColor: "rgba(255,180,0,0.1)", color: "#FFB400", fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
                          Review Pending
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review form */}
          {selectedBookingId && selectedBooking && (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ color: "#ffffff", fontSize: "1.125rem", fontWeight: 700, margin: 0 }}>Leave a Review</h2>
                <button onClick={() => setSelectedBookingId(null)} style={{ background: "none", border: "none", color: "#666666", cursor: "pointer", fontSize: "18px" }}>✕</button>
              </div>

              <div style={{ backgroundColor: "#111111", borderRadius: "6px", padding: "1rem", marginBottom: "1.5rem" }}>
                <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 600, margin: "0 0 2px" }}>
                  {selectedBooking.vehicle.year} {selectedBooking.vehicle.make} {selectedBooking.vehicle.model}
                </p>
                <p style={{ color: "#555555", fontSize: "12px", margin: 0 }}>
                  {new Date(selectedBooking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(selectedBooking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              {submitError && (
                <div style={{ backgroundColor: "rgba(193,18,31,0.1)", border: "1px solid rgba(193,18,31,0.3)", borderRadius: "6px", padding: "0.875rem", marginBottom: "1.25rem", color: "#ff6b6b", fontSize: "13px" }}>
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Overall Rating
                  </label>
                  <StarRating value={rating} onChange={setRating} />
                  {rating > 0 && (
                    <p style={{ color: "#888888", fontSize: "12px", margin: "8px 0 0" }}>
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.5rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Your Review (Optional)
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this vehicle and host..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      backgroundColor: "#111111",
                      border: "1px solid #222222",
                      borderRadius: "6px",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "Inter, sans-serif",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || rating === 0}
                  style={{
                    width: "100%",
                    padding: "0.9375rem",
                    backgroundColor: submitting || rating === 0 ? "#333333" : "#C1121F",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: submitting || rating === 0 ? "not-allowed" : "pointer",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Past Reviews Tab */}
      {activeTab === "past" && (
        <div>
          {loading ? (
            <div style={{ color: "#555555", fontSize: "14px", textAlign: "center", padding: "3rem" }}>Loading...</div>
          ) : reviews.length === 0 ? (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "3rem", textAlign: "center" }}>
              <p style={{ color: "#444444", fontSize: "14px", margin: 0 }}>No reviews yet</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reviews.map((review) => {
                const photos = review.vehicle.photos ? JSON.parse(review.vehicle.photos) : [];
                const photo = photos[0] || null;

                return (
                  <div key={review.id} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", overflow: "hidden", display: "flex" }}>
                    <div style={{ width: "100px", flexShrink: 0, backgroundColor: "#111111" }}>
                      {photo ? (
                        <img src={photo} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center", color: "#333333" }}>◈</div>
                      )}
                    </div>
                    <div style={{ flex: 1, padding: "1.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                        <div>
                          <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 700, margin: "0 0 2px" }}>
                            {review.vehicle.year} {review.vehicle.make} {review.vehicle.model}
                          </h3>
                          <p style={{ color: "#555555", fontSize: "11px", margin: 0 }}>
                            {new Date(review.booking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(review.booking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <StarRating value={review.rating} />
                          <p style={{ color: "#444444", fontSize: "10px", margin: "4px 0 0" }}>
                            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                      {review.text && (
                        <p style={{ color: "#888888", fontSize: "13px", margin: 0, lineHeight: 1.6 }}>{review.text}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </RenterDashboardShell>
  );
}

function RenterReviewsPageInner() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    }>
      <ReviewsContent />
    </Suspense>
  );
}

export default function RenterReviewsPage() {
  return (
    <Suspense fallback={<div style={{color:"#888",padding:"40px",textAlign:"center"}}>Loading...</div>}>
      <RenterReviewsPageInner />
    </Suspense>
  );
}
