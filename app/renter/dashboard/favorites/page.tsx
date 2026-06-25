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
}

interface FavoriteVehicle {
  favoriteId: number;
  vehicleId: number;
  savedAt: string;
  vehicle: {
    id: number;
    year: number;
    make: string;
    model: string;
    trim: string | null;
    dailyRate: number;
    photos: string | null;
    city: string | null;
    rating: number;
    trips: number;
    offersAirportPickup: boolean;
    offersHomeDelivery: boolean;
    unlimitedMiles: boolean;
    category: string;
    host: { businessName: string; ownerName: string };
    status: string;
  };
}

export default function RenterFavoritesPage() {
  const router = useRouter();
  const [renter, setRenter] = useState<RenterData | null>(null);
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/renter/me").then(async (res) => {
      if (res.status === 401) { router.push("/renter/login"); return; }
      const d = await res.json();
      if (!d.authenticated) { router.push("/renter/login"); return; }
      setRenter(d.renter);

      const favRes = await fetch("/api/renter/dashboard/favorites");
      if (favRes.ok) {
        const data = await favRes.json();
        setFavorites(data.favorites || []);
      }
      setLoading(false);
    }).catch(() => router.push("/renter/login"));
  }, [router]);

  const handleRemove = async (vehicleId: number) => {
    setRemoving(vehicleId);
    try {
      const res = await fetch(`/api/renter/dashboard/favorites?vehicleId=${vehicleId}`, { method: "DELETE" });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.vehicleId !== vehicleId));
      }
    } catch {
      // ignore
    }
    setRemoving(null);
  };

  if (!renter) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    );
  }

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.375rem" }}>Saved Vehicles</h1>
        <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>
          {favorites.length} vehicle{favorites.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {loading ? (
        <div style={{ color: "#555555", fontSize: "14px", textAlign: "center", padding: "3rem" }}>Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1a1a1a",
          borderRadius: "10px",
          padding: "4rem",
          textAlign: "center",
        }}>
          <p style={{ color: "#444444", fontSize: "16px", margin: "0 0 0.5rem" }}>No saved vehicles yet</p>
          <p style={{ color: "#333333", fontSize: "13px", margin: "0 0 1.5rem" }}>
            Save vehicles from search results to quickly book them later
          </p>
          <Link href="/find-a-car" style={{
            display: "inline-block",
            backgroundColor: "#C1121F",
            color: "#ffffff",
            padding: "10px 28px",
            borderRadius: "6px",
            textDecoration: "none",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>
            Browse Vehicles
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
          {favorites.map((fav) => {
            const photos = fav.vehicle.photos ? JSON.parse(fav.vehicle.photos) : [];
            const photo = photos[0] || null;
            const isAvailable = fav.vehicle.status === "active";

            return (
              <div key={fav.favoriteId} style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: "10px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}>
                {/* Photo */}
                <div style={{ height: "180px", backgroundColor: "#111111", position: "relative", overflow: "hidden" }}>
                  {photo ? (
                    <img src={photo} alt="vehicle" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333333", fontSize: "32px" }}>
                      ◈
                    </div>
                  )}
                  {!isAvailable && (
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <span style={{ color: "#888888", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, padding: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <h3 style={{ color: "#ffffff", fontSize: "15px", fontWeight: 700, margin: 0 }}>
                      {fav.vehicle.year} {fav.vehicle.make} {fav.vehicle.model}
                    </h3>
                    <span style={{ color: "#C1121F", fontSize: "15px", fontWeight: 800, flexShrink: 0 }}>
                      ${fav.vehicle.dailyRate}/day
                    </span>
                  </div>

                  <p style={{ color: "#666666", fontSize: "12px", margin: "0 0 8px" }}>
                    {fav.vehicle.host.businessName || fav.vehicle.host.ownerName}
                    {fav.vehicle.city && ` · ${fav.vehicle.city}`}
                  </p>

                  {/* Badges */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {fav.vehicle.offersAirportPickup && (
                      <span style={{ backgroundColor: "#111111", color: "#888888", fontSize: "10px", padding: "2px 7px", borderRadius: "4px" }}>Airport</span>
                    )}
                    {fav.vehicle.offersHomeDelivery && (
                      <span style={{ backgroundColor: "#111111", color: "#888888", fontSize: "10px", padding: "2px 7px", borderRadius: "4px" }}>Delivery</span>
                    )}
                    {fav.vehicle.unlimitedMiles && (
                      <span style={{ backgroundColor: "#111111", color: "#888888", fontSize: "10px", padding: "2px 7px", borderRadius: "4px" }}>Unlimited Miles</span>
                    )}
                  </div>

                  {/* Rating */}
                  {fav.vehicle.rating > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "10px" }}>
                      <span style={{ color: "#FFB400", fontSize: "12px" }}>★</span>
                      <span style={{ color: "#888888", fontSize: "12px" }}>{fav.vehicle.rating.toFixed(1)} ({fav.vehicle.trips} trips)</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ padding: "0 1rem 1rem", display: "flex", gap: "0.5rem" }}>
                  {isAvailable && (
                    <Link href={`/vehicles/${fav.vehicleId}`} style={{
                      flex: 1,
                      display: "block",
                      padding: "9px",
                      backgroundColor: "#C1121F",
                      color: "#ffffff",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontSize: "12px",
                      fontWeight: 700,
                      textAlign: "center",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}>
                      Book Now
                    </Link>
                  )}
                  <button
                    onClick={() => handleRemove(fav.vehicleId)}
                    disabled={removing === fav.vehicleId}
                    style={{
                      padding: "9px 14px",
                      backgroundColor: "transparent",
                      border: "1px solid #222222",
                      borderRadius: "6px",
                      color: "#666666",
                      fontSize: "12px",
                      cursor: removing === fav.vehicleId ? "not-allowed" : "pointer",
                      fontFamily: "Inter, sans-serif",
                    }}
                    title="Remove from favorites"
                  >
                    {removing === fav.vehicleId ? "..." : "✕"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </RenterDashboardShell>
  );
}
