"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  licenseVerified: boolean;
}

interface Trip {
  id: number;
  bookingReference: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  status: string;
  totalPrice: number;
  vehicle: { year: number; make: string; model: string; photos: string | null; city: string | null };
  host: { businessName: string; ownerName: string; phone: string | null };
}

interface Stats {
  totalTrips: number;
  unreadMessages: number;
  favoritesCount: number;
  pendingReviews: number;
}

function StatCard({ label, value, sub, highlight, href }: { label: string; value: string | number; sub?: string; highlight?: boolean; href?: string }) {
  const inner = (
    <div style={{
      backgroundColor: "#111111",
      border: `1px solid ${highlight ? "rgba(193,18,31,0.3)" : "#1a1a1a"}`,
      borderRadius: "8px",
      padding: "20px 24px",
      cursor: href ? "pointer" : "default",
      transition: "border-color 0.15s",
    }}>
      <p style={{ color: "#555555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
        {label}
      </p>
      <p style={{ color: highlight ? "#C1121F" : "#ffffff", fontSize: "26px", fontWeight: 700, margin: "0 0 4px" }}>
        {value}
      </p>
      {sub && <p style={{ color: "#444444", fontSize: "11px", margin: 0 }}>{sub}</p>}
    </div>
  );
  if (href) return <Link href={href} style={{ textDecoration: "none" }}>{inner}</Link>;
  return inner;
}

function TripCard({ trip }: { trip: Trip }) {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const now = new Date();
  const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const photos = trip.vehicle.photos ? JSON.parse(trip.vehicle.photos) : [];
  const photo = photos[0] || null;

  const statusColors: Record<string, { bg: string; text: string }> = {
    confirmed: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
    pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
    active: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
  };
  const sc = statusColors[trip.status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };

  return (
    <div style={{
      backgroundColor: "#111111",
      border: "1px solid #1a1a1a",
      borderRadius: "8px",
      overflow: "hidden",
      display: "flex",
      gap: 0,
    }}>
      {/* Photo */}
      <div style={{ width: "120px", flexShrink: 0, backgroundColor: "#0a0a0a", position: "relative" }}>
        {photo ? (
          <img src={photo} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", minHeight: "100px", display: "flex", alignItems: "center", justifyContent: "center", color: "#333333", fontSize: "24px" }}>
            ◈
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
          <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 700, margin: 0 }}>
            {trip.vehicle.year} {trip.vehicle.make} {trip.vehicle.model}
          </h3>
          <span style={{ backgroundColor: sc.bg, color: sc.text, fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {trip.status}
          </span>
        </div>
        <p style={{ color: "#666666", fontSize: "12px", margin: "0 0 8px" }}>
          {start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#888888", fontSize: "12px" }}>
            {daysUntil > 0 ? `${daysUntil} day${daysUntil !== 1 ? "s" : ""} away` : "Starting today"}
          </span>
          <span style={{ color: "#C1121F", fontSize: "14px", fontWeight: 700 }}>
            ${trip.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RenterDashboardPage() {
  const router = useRouter();
  const [renter, setRenter] = useState<RenterData | null>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/renter/me").then(async (res) => {
      if (res.status === 401) { router.push("/renter/login"); return; }
      const d = await res.json();
      if (!d.authenticated) { router.push("/renter/login"); return; }
      setRenter(d.renter);

      // Fetch dashboard stats
      const statsRes = await fetch("/api/renter/dashboard/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setUpcomingTrips(statsData.upcomingTrips || []);
        setActiveTrips(statsData.activeTrips || []);
        setStats(statsData.stats);
      }
      setLoading(false);
    }).catch(() => router.push("/renter/login"));
  }, [router]);

  if (loading || !renter) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    );
  }

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.375rem" }}>
          Welcome back, {renter.firstName}
        </h1>
        <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>
          Manage your trips, messages, and account from here.
        </p>
      </div>

      {/* License verification banner */}
      {!renter.licenseVerified && (
        <div style={{
          backgroundColor: "rgba(255,180,0,0.08)",
          border: "1px solid rgba(255,180,0,0.2)",
          borderRadius: "8px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}>
          <div>
            <p style={{ color: "#FFB400", fontSize: "13px", fontWeight: 700, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              License Verification Pending
            </p>
            <p style={{ color: "#666666", fontSize: "13px", margin: 0 }}>
              Your driver&apos;s license is on file and will be verified before your first trip.
            </p>
          </div>
          <Link href="/renter/dashboard/settings" style={{
            backgroundColor: "rgba(255,180,0,0.15)",
            color: "#FFB400",
            padding: "8px 16px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "12px",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}>
            View Settings
          </Link>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <StatCard label="Total Trips" value={stats.totalTrips} sub="completed" />
          <StatCard label="Unread Messages" value={stats.unreadMessages} highlight={stats.unreadMessages > 0} href="/renter/dashboard/messages" />
          <StatCard label="Saved Vehicles" value={stats.favoritesCount} href="/renter/dashboard/favorites" />
          <StatCard label="Pending Reviews" value={stats.pendingReviews} highlight={stats.pendingReviews > 0} href="/renter/dashboard/reviews" />
        </div>
      )}

      {/* Active Trips */}
      {activeTrips.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ color: "#ffffff", fontSize: "1.0625rem", fontWeight: 700, margin: 0 }}>Active Trip</h2>
            <span style={{ backgroundColor: "rgba(0,150,255,0.1)", color: "#0096FF", fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", textTransform: "uppercase" }}>
              In Progress
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {activeTrips.map((trip) => (
              <Link key={trip.id} href={`/renter/dashboard/trips?id=${trip.id}`} style={{ textDecoration: "none" }}>
                <TripCard trip={trip} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Trips */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ color: "#ffffff", fontSize: "1.0625rem", fontWeight: 700, margin: 0 }}>Upcoming Trips</h2>
          <Link href="/renter/dashboard/trips" style={{ color: "#C1121F", fontSize: "13px", textDecoration: "none", fontWeight: 600 }}>
            View all →
          </Link>
        </div>
        {upcomingTrips.length === 0 ? (
          <div style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "8px",
            padding: "3rem",
            textAlign: "center",
          }}>
            <p style={{ color: "#444444", fontSize: "14px", margin: "0 0 1.25rem" }}>No upcoming trips</p>
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
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {upcomingTrips.map((trip) => (
              <Link key={trip.id} href={`/renter/dashboard/trips?id=${trip.id}`} style={{ textDecoration: "none" }}>
                <TripCard trip={trip} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ color: "#ffffff", fontSize: "1.0625rem", fontWeight: 700, margin: "0 0 1rem" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
          {[
            { label: "Find a Car", href: "/find-a-car", desc: "Browse available vehicles" },
            { label: "My Messages", href: "/renter/dashboard/messages", desc: "Chat with hosts" },
            { label: "Saved Vehicles", href: "/renter/dashboard/favorites", desc: "View your favorites" },
            { label: "Trip History", href: "/renter/dashboard/trips?filter=past", desc: "Past rentals & receipts" },
          ].map((action) => (
            <Link key={action.href} href={action.href} style={{ textDecoration: "none" }}>
              <div style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: "8px",
                padding: "1.25rem",
                transition: "border-color 0.15s",
              }}>
                <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 700, margin: "0 0 4px" }}>{action.label}</p>
                <p style={{ color: "#555555", fontSize: "11px", margin: 0 }}>{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </RenterDashboardShell>
  );
}
