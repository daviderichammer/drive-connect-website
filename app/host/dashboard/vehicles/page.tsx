"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
}

interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  color: string | null;
  licensePlate: string | null;
  vin: string | null;
  mileage: number | null;
  seats: number;
  fuelType: string;
  transmission: string;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  securityDeposit: number | null;
  mileageIncluded: number | null;
  hasGPS: boolean;
  hasBluetooth: boolean;
  hasCarPlay: boolean;
  hasChargingCable: boolean;
  hasChildSeat: boolean;
  offersAirportPickup: boolean;
  offersHomeDelivery: boolean;
  deliveryFee: number | null;
  description: string | null;
  vehicleRules: string | null;
  pickupInstructions: string | null;
  status: string;
  photos: string[];
  category: string;
  city: string | null;
  zipCode: string | null;
  rating: number;
  trips: number;
  unlimitedMiles: boolean;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
}

const CATEGORIES = ["Sedan", "SUV", "Luxury Sedan", "Luxury SUV", "Full-Size SUV", "Electric", "Sports", "Convertible", "Van", "Truck"];
const FUEL_TYPES = ["Gasoline", "Electric", "Hybrid", "Diesel"];
const TRANSMISSIONS = ["Automatic", "Manual"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    active: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
    inactive: { bg: "rgba(100,100,100,0.1)", text: "#888888" },
    pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  };
  const c = colors[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span
      style={{
        backgroundColor: c.bg,
        color: c.text,
        padding: "3px 8px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}

const emptyForm = {
  year: new Date().getFullYear().toString(),
  make: "",
  model: "",
  trim: "",
  color: "",
  licensePlate: "",
  vin: "",
  mileage: "",
  seats: "5",
  fuelType: "Gasoline",
  transmission: "Automatic",
  dailyRate: "",
  weeklyRate: "",
  monthlyRate: "",
  securityDeposit: "",
  mileageIncluded: "",
  hasGPS: false,
  hasBluetooth: false,
  hasCarPlay: false,
  hasChargingCable: false,
  hasChildSeat: false,
  offersAirportPickup: false,
  offersHomeDelivery: false,
  deliveryFee: "",
  description: "",
  vehicleRules: "",
  pickupInstructions: "",
  category: "Sedan",
  city: "",
  zipCode: "",
  unlimitedMiles: false,
};

type FormData = typeof emptyForm;

function VehiclesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [host, setHost] = useState<HostData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchVehicles = useCallback(async () => {
    const res = await fetch("/api/host/dashboard/vehicles");
    if (res.ok) {
      const data = await res.json();
      setVehicles(data.vehicles || []);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetch("/api/host/me"), fetch("/api/host/dashboard/vehicles")])
      .then(async ([meRes, vRes]) => {
        if (meRes.status === 401) { router.push("/host/login"); return; }
        const meData = await meRes.json();
        if (!meData.authenticated || !meData.host.onboardingCompleted) {
          router.push("/host/login"); return;
        }
        setHost(meData.host);
        if (vRes.ok) {
          const vData = await vRes.json();
          setVehicles(vData.vehicles || []);
        }
        setLoading(false);
        if (searchParams.get("action") === "add") setShowForm(true);
      })
      .catch(() => router.push("/host/login"));
  }, [router, searchParams]);

  const openEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setForm({
      year: v.year.toString(),
      make: v.make,
      model: v.model,
      trim: v.trim || "",
      color: v.color || "",
      licensePlate: v.licensePlate || "",
      vin: v.vin || "",
      mileage: v.mileage?.toString() || "",
      seats: v.seats.toString(),
      fuelType: v.fuelType,
      transmission: v.transmission,
      dailyRate: v.dailyRate.toString(),
      weeklyRate: v.weeklyRate?.toString() || "",
      monthlyRate: v.monthlyRate?.toString() || "",
      securityDeposit: v.securityDeposit?.toString() || "",
      mileageIncluded: v.mileageIncluded?.toString() || "",
      hasGPS: v.hasGPS,
      hasBluetooth: v.hasBluetooth,
      hasCarPlay: v.hasCarPlay,
      hasChargingCable: v.hasChargingCable,
      hasChildSeat: v.hasChildSeat,
      offersAirportPickup: v.offersAirportPickup,
      offersHomeDelivery: v.offersHomeDelivery,
      deliveryFee: v.deliveryFee?.toString() || "",
      description: v.description || "",
      vehicleRules: v.vehicleRules || "",
      pickupInstructions: v.pickupInstructions || "",
      category: v.category,
      city: v.city || "",
      zipCode: v.zipCode || "",
      unlimitedMiles: v.unlimitedMiles,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const url = editingId
      ? `/api/host/dashboard/vehicles/${editingId}`
      : "/api/host/dashboard/vehicles";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to save vehicle.");
      return;
    }

    setSuccess(editingId ? "Vehicle updated successfully." : "Vehicle added successfully.");
    setShowForm(false);
    setEditingId(null);
    await fetchVehicles();
  };

  const toggleStatus = async (v: Vehicle) => {
    const newStatus = v.status === "active" ? "inactive" : "active";
    const res = await fetch(`/api/host/dashboard/vehicles/${v.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setSuccess(`Vehicle ${newStatus === "active" ? "activated" : "deactivated"}.`);
      await fetchVehicles();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/host/dashboard/vehicles/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to delete vehicle.");
    } else {
      setSuccess("Vehicle deleted.");
      await fetchVehicles();
    }
    setDeleteConfirm(null);
  };

  const f = (key: keyof FormData, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>
        Loading vehicles...
      </div>
    );
  }

  if (!host) return null;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Vehicle Management</h2>
          <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>
            {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} in your fleet
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "Inter, sans-serif" }}
        >
          + Add Vehicle
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div style={{ backgroundColor: "rgba(193,18,31,0.1)", border: "1px solid rgba(193,18,31,0.3)", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "#C1121F", fontSize: "13px" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: "rgba(0,200,100,0.1)", border: "1px solid rgba(0,200,100,0.3)", borderRadius: "6px", padding: "12px 16px", marginBottom: "16px", color: "#00C864", fontSize: "13px" }}>
          {success}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", padding: "28px", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>
              {editingId ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>
            <button onClick={() => setShowForm(false)} style={{ background: "transparent", border: "none", color: "#555", cursor: "pointer", fontSize: "20px" }}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>VEHICLE DETAILS</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { key: "year", label: "Year *", type: "number" },
                { key: "make", label: "Make *", type: "text" },
                { key: "model", label: "Model *", type: "text" },
                { key: "trim", label: "Trim", type: "text" },
                { key: "color", label: "Color", type: "text" },
                { key: "licensePlate", label: "License Plate", type: "text" },
                { key: "vin", label: "VIN", type: "text" },
                { key: "mileage", label: "Current Mileage", type: "number" },
                { key: "seats", label: "Seats", type: "number" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "#666", fontSize: "11px", marginBottom: "6px", fontWeight: 600 }}>{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof FormData] as string}
                    onChange={(e) => f(key as keyof FormData, e.target.value)}
                    required={["year", "make", "model"].includes(key)}
                    style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "8px 12px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>

            {/* Selects */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { key: "fuelType", label: "Fuel Type", options: FUEL_TYPES },
                { key: "transmission", label: "Transmission", options: TRANSMISSIONS },
                { key: "category", label: "Category", options: CATEGORIES },
              ].map(({ key, label, options }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "#666", fontSize: "11px", marginBottom: "6px", fontWeight: 600 }}>{label}</label>
                  <select
                    value={form[key as keyof FormData] as string}
                    onChange={(e) => f(key as keyof FormData, e.target.value)}
                    style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "8px 12px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                  >
                    {options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>PRICING</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { key: "dailyRate", label: "Daily Rate ($) *" },
                { key: "weeklyRate", label: "Weekly Rate ($)" },
                { key: "monthlyRate", label: "Monthly Rate ($)" },
                { key: "securityDeposit", label: "Security Deposit ($)" },
                { key: "mileageIncluded", label: "Miles Included/Day" },
                { key: "deliveryFee", label: "Delivery Fee ($)" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "#666", fontSize: "11px", marginBottom: "6px", fontWeight: 600 }}>{label}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form[key as keyof FormData] as string}
                    onChange={(e) => f(key as keyof FormData, e.target.value)}
                    required={key === "dailyRate"}
                    style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "8px 12px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>

            {/* Location */}
            <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>LOCATION</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { key: "city", label: "City" },
                { key: "zipCode", label: "ZIP Code" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label style={{ display: "block", color: "#666", fontSize: "11px", marginBottom: "6px", fontWeight: 600 }}>{label}</label>
                  <input
                    type="text"
                    value={form[key as keyof FormData] as string}
                    onChange={(e) => f(key as keyof FormData, e.target.value)}
                    style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "8px 12px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif", boxSizing: "border-box" }}
                  />
                </div>
              ))}
            </div>

            {/* Features */}
            <p style={{ color: "#555", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>FEATURES & OPTIONS</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
              {[
                { key: "hasGPS", label: "GPS" },
                { key: "hasBluetooth", label: "Bluetooth" },
                { key: "hasCarPlay", label: "Apple CarPlay" },
                { key: "hasChargingCable", label: "Charging Cable" },
                { key: "hasChildSeat", label: "Child Seat" },
                { key: "offersAirportPickup", label: "Airport Pickup" },
                { key: "offersHomeDelivery", label: "Home Delivery" },
                { key: "unlimitedMiles", label: "Unlimited Miles" },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form[key as keyof FormData] as boolean}
                    onChange={(e) => f(key as keyof FormData, e.target.checked)}
                    style={{ accentColor: "#C1121F" }}
                  />
                  <span style={{ color: "#888", fontSize: "12px" }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Text areas */}
            {[
              { key: "description", label: "Description" },
              { key: "vehicleRules", label: "Vehicle Rules" },
              { key: "pickupInstructions", label: "Pickup Instructions" },
            ].map(({ key, label }) => (
              <div key={key} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", color: "#666", fontSize: "11px", marginBottom: "6px", fontWeight: 600 }}>{label}</label>
                <textarea
                  value={form[key as keyof FormData] as string}
                  onChange={(e) => f(key as keyof FormData, e.target.value)}
                  rows={3}
                  style={{ width: "100%", backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "6px", padding: "8px 12px", color: "#fff", fontSize: "13px", fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ backgroundColor: "transparent", border: "1px solid #333", color: "#888", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving..." : editingId ? "Update Vehicle" : "Add Vehicle"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      <div style={{ backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden" }}>
        {vehicles.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "#555" }}>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>No vehicles listed yet.</p>
            <p style={{ fontSize: "13px", marginBottom: "20px" }}>Add your first vehicle to start accepting bookings.</p>
            <button
              onClick={openAdd}
              style={{ backgroundColor: "#C1121F", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            >
              + Add Your First Vehicle
            </button>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1a1a1a" }}>
                {["Vehicle", "Category", "Daily Rate", "Status", "Bookings", "Revenue", "Rating", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} style={{ borderBottom: "1px solid #0d0d0d" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontWeight: 600, fontSize: "14px", margin: "0 0 2px" }}>
                      {v.year} {v.make} {v.model}
                    </p>
                    {v.trim && <p style={{ color: "#555", fontSize: "11px", margin: 0 }}>{v.trim}</p>}
                    {v.city && <p style={{ color: "#444", fontSize: "11px", margin: 0 }}>{v.city}</p>}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "12px", color: "#888" }}>{v.category}</td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 600 }}>
                    ${v.dailyRate.toFixed(0)}/day
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <StatusBadge status={v.status} />
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                    {v.totalBookings}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600 }}>
                    ${v.totalRevenue.toFixed(0)}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>
                    {v.rating > 0 ? `${v.rating} ★` : "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => openEdit(v)}
                        style={{ backgroundColor: "transparent", border: "1px solid #333", color: "#888", padding: "5px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(v)}
                        style={{ backgroundColor: "transparent", border: `1px solid ${v.status === "active" ? "#333" : "rgba(0,200,100,0.3)"}`, color: v.status === "active" ? "#888" : "#00C864", padding: "5px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                      >
                        {v.status === "active" ? "Pause" : "Activate"}
                      </button>
                      {deleteConfirm === v.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(v.id)}
                            style={{ backgroundColor: "rgba(193,18,31,0.2)", border: "1px solid rgba(193,18,31,0.4)", color: "#C1121F", padding: "5px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            style={{ backgroundColor: "transparent", border: "1px solid #333", color: "#888", padding: "5px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(v.id)}
                          style={{ backgroundColor: "transparent", border: "1px solid rgba(193,18,31,0.2)", color: "#C1121F", padding: "5px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardShell>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>Loading...</div>}>
      <VehiclesPageInner />
    </Suspense>
  );
}
