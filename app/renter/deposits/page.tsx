"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface DepositEntry {
  booking: {
    id: number;
    bookingReference: string;
    startDate: string;
    endDate: string;
    status: string;
    vehicle: { year: number; make: string; model: string };
    host: { businessName: string; ownerName: string; phone: string | null };
  };
  deposit: {
    id: number;
    amountRequired: number;
    amountCollected: number | null;
    collectionMethod: string | null;
    status: string;
    collectedAt: string | null;
    returnedAt: string | null;
    notes: string | null;
  } | null;
}

interface DepositTier {
  vehicleClass: string;
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  collected: { bg: "rgba(220,38,38,0.1)", text: "#DC2626" },
  returned: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
  partial_return: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
  disputed: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] || { bg: "rgba(100,100,100,0.1)", text: "#888888" };
  return (
    <span style={{ backgroundColor: c.bg, color: c.text, padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function RenterDepositsPage() {
  const router = useRouter();
  const [renter, setRenter] = useState<RenterData | null>(null);
  const [deposits, setDeposits] = useState<DepositEntry[]>([]);
  const [tiers, setTiers] = useState<DepositTier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [renterRes, depositsRes] = await Promise.all([
        fetch("/api/renter/me"),
        fetch("/api/renter/deposits"),
      ]);
      if (!renterRes.ok) { router.push("/renter/login"); return; }
      const renterData = await renterRes.json();
      setRenter(renterData.renter);
      if (depositsRes.ok) {
        const d = await depositsRes.json();
        setDeposits(d.deposits || []);
        setTiers(d.tiers || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888" }}>Loading deposits...</div>
    </div>
  );

  if (!renter) return null;

  const heldCount = deposits.filter(d => d.deposit?.status === "collected").length;
  const returnedCount = deposits.filter(d => d.deposit?.status === "returned").length;

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ padding: "32px", maxWidth: "900px" }}>
        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: 700, margin: 0 }}>Security Deposits</h1>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "6px" }}>
            Track your security deposit status for each booking.
          </p>
        </div>

        {/* How It Works Banner */}
        <div style={{ backgroundColor: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "18px 20px", marginBottom: "28px" }}>
          <h3 style={{ color: "#DC2626", fontSize: "14px", fontWeight: 700, margin: "0 0 10px 0" }}>How Security Deposits Work</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { step: "1", title: "At Pickup", desc: "Pay the security deposit directly to the operator in cash, card, or their preferred method." },
              { step: "2", title: "During Rental", desc: "The operator holds your deposit. Drive Connect tracks the status for your records." },
              { step: "3", title: "At Return", desc: "The operator returns your deposit when you return the vehicle in good condition." },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: "12px" }}>
                <div style={{ width: "24px", height: "24px", backgroundColor: "#DC2626", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ color: "#fff", fontSize: "13px", fontWeight: 600, marginBottom: "3px" }}>{s.title}</div>
                  <div style={{ color: "#666", fontSize: "12px", lineHeight: "1.4" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "14px", padding: "10px 14px", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "6px", color: "#888", fontSize: "12px" }}>
            <strong style={{ color: "#aaa" }}>Important:</strong> Drive Connect does NOT collect or hold security deposits. All deposit transactions are directly between you and the operator.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Currently Held", value: heldCount, color: "#DC2626" },
            { label: "Returned", value: returnedCount, color: "#00C864" },
            { label: "Total Bookings", value: deposits.length, color: "#fff" },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
              <div style={{ color: stat.color, fontSize: "24px", fontWeight: 700 }}>{stat.value}</div>
              <div style={{ color: "#666", fontSize: "12px", marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Deposit Tiers Reference */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px", marginBottom: "28px" }}>
          <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: "0 0 14px 0" }}>Standard Deposit Amounts by Vehicle Type</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {tiers.map(tier => (
              <div key={tier.vehicleClass} style={{ backgroundColor: "#111", borderRadius: "8px", padding: "14px", textAlign: "center" }}>
                <div style={{ color: "#DC2626", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>{tier.vehicleClass}</div>
                <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>${tier.defaultAmount}</div>
                <div style={{ color: "#555", fontSize: "11px", marginTop: "3px" }}>${tier.minAmount}–${tier.maxAmount} range</div>
              </div>
            ))}
          </div>
          <div style={{ color: "#555", fontSize: "12px", marginTop: "12px" }}>Operators may set their own deposit amount within the tier range.</div>
        </div>

        {/* Deposits List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ color: "#fff", fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0" }}>Your Bookings & Deposits</h3>
          {deposits.length === 0 ? (
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "40px", textAlign: "center", color: "#555", fontSize: "14px" }}>
              No bookings found.
            </div>
          ) : (
            deposits.map((entry, i) => (
              <div key={i} style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "10px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ color: "#DC2626", fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>{entry.booking.bookingReference}</div>
                    <div style={{ color: "#fff", fontSize: "14px", fontWeight: 600 }}>
                      {entry.booking.vehicle.year} {entry.booking.vehicle.make} {entry.booking.vehicle.model}
                    </div>
                    <div style={{ color: "#666", fontSize: "12px", marginTop: "2px" }}>
                      {entry.booking.host.businessName} · {new Date(entry.booking.startDate).toLocaleDateString()} – {new Date(entry.booking.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {entry.deposit ? (
                      <>
                        <div style={{ color: "#fff", fontSize: "20px", fontWeight: 700 }}>${entry.deposit.amountRequired.toFixed(2)}</div>
                        <div style={{ marginTop: "4px" }}><StatusBadge status={entry.deposit.status} /></div>
                      </>
                    ) : (
                      <div style={{ color: "#555", fontSize: "13px" }}>No deposit record</div>
                    )}
                  </div>
                </div>

                {entry.deposit && (
                  <div style={{ backgroundColor: "#111", borderRadius: "8px", padding: "12px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                    <div>
                      <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", marginBottom: "3px" }}>Method</div>
                      <div style={{ color: "#aaa", fontSize: "13px", textTransform: "capitalize" }}>{entry.deposit.collectionMethod || "Not yet collected"}</div>
                    </div>
                    <div>
                      <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", marginBottom: "3px" }}>Collected</div>
                      <div style={{ color: "#aaa", fontSize: "13px" }}>{entry.deposit.collectedAt ? new Date(entry.deposit.collectedAt).toLocaleDateString() : "—"}</div>
                    </div>
                    <div>
                      <div style={{ color: "#555", fontSize: "11px", textTransform: "uppercase", marginBottom: "3px" }}>Returned</div>
                      <div style={{ color: entry.deposit.returnedAt ? "#00C864" : "#aaa", fontSize: "13px" }}>{entry.deposit.returnedAt ? new Date(entry.deposit.returnedAt).toLocaleDateString() : "—"}</div>
                    </div>
                  </div>
                )}

                {!entry.deposit && entry.booking.status === "confirmed" && (
                  <div style={{ backgroundColor: "rgba(255,180,0,0.05)", border: "1px solid rgba(255,180,0,0.2)", borderRadius: "8px", padding: "10px 14px" }}>
                    <span style={{ color: "#FFB400", fontSize: "13px" }}>
                      ⚠ Security deposit required at pickup. Contact your operator for the amount and preferred payment method.
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </RenterDashboardShell>
  );
}
