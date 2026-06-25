"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
}

interface ClaimMessage {
  id: number;
  claimId: number;
  senderId: number;
  senderRole: string;
  message: string;
  attachmentUrl: string | null;
  sentAt: string;
}

interface DepositClaim {
  id: number;
  claimReference: string;
  bookingId: number;
  claimType: string;
  amount: number;
  description: string;
  evidenceUrls: string[];
  status: string;
  resolutionNotes: string | null;
  filedAt: string;
  resolvedAt: string | null;
  messages: ClaimMessage[];
  booking: {
    bookingReference: string;
    renterFirstName: string;
    renterLastName: string;
    renterEmail: string;
    startDate: string;
    endDate: string;
    vehicle: { year: number; make: string; model: string };
  } | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  filed: { bg: "rgba(255,180,0,0.1)", text: "#FFB400" },
  acknowledged: { bg: "rgba(0,150,255,0.1)", text: "#0096FF" },
  disputed: { bg: "rgba(255,50,50,0.1)", text: "#FF3232" },
  resolved: { bg: "rgba(0,200,100,0.1)", text: "#00C864" },
};

const CLAIM_TYPE_LABELS: Record<string, string> = {
  smoking: "Smoking", tire: "Tire Damage", interior: "Interior Damage",
  exterior: "Exterior Damage", fuel: "Fuel Charge", cleaning: "Cleaning Fee",
  missing_accessory: "Missing Accessory", late_return: "Late Return",
};

export default function OperatorClaimDetailPage() {
  const router = useRouter();
  const params = useParams();
  const claimId = params?.id as string;

  const [host, setHost] = useState<HostData | null>(null);
  const [claim, setClaim] = useState<DepositClaim | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [hostRes, claimRes] = await Promise.all([
        fetch("/api/host/me"),
        fetch(`/api/claims/${claimId}/message`),
      ]);
      if (!hostRes.ok) { router.push("/host/login"); return; }
      const hostData = await hostRes.json();
      setHost(hostData.host);
      if (claimRes.ok) {
        const c = await claimRes.json();
        setClaim(c.claim);
      }
    } catch {
      setError("Failed to load claim.");
    } finally {
      setLoading(false);
    }
  }, [router, claimId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setSendingMessage(true);
    setError("");
    try {
      const res = await fetch(`/api/claims/${claimId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send."); return; }
      setNewMessage("");
      fetchData();
    } catch { setError("Network error."); }
    finally { setSendingMessage(false); }
  };

  const handleResolve = async () => {
    setResolving(true);
    setError("");
    try {
      const res = await fetch(`/api/claims/${claimId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolutionNotes }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed."); return; }
      setSuccess("Claim marked as resolved.");
      setShowResolveModal(false);
      fetchData();
    } catch { setError("Network error."); }
    finally { setResolving(false); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888" }}>Loading claim...</div>
    </div>
  );

  if (!host || !claim) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#888" }}>Claim not found.</div>
    </div>
  );

  const statusColor = STATUS_COLORS[claim.status] || { bg: "rgba(100,100,100,0.1)", text: "#888" };

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      <div style={{ padding: "32px", maxWidth: "900px" }}>
        <button onClick={() => router.push("/operator/claims")}
          style={{ backgroundColor: "transparent", border: "none", color: "#666", fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "20px" }}>
          ← Back to Claims
        </button>

        {/* Claim Header */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <h2 style={{ color: "#DC2626", fontSize: "18px", fontWeight: 700, margin: 0 }}>{claim.claimReference}</h2>
                <span style={{ backgroundColor: statusColor.bg, color: statusColor.text, padding: "3px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                  {claim.status}
                </span>
                <span style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#aaa", padding: "3px 10px", borderRadius: "4px", fontSize: "11px" }}>
                  {CLAIM_TYPE_LABELS[claim.claimType] || claim.claimType}
                </span>
              </div>
              {claim.booking && (
                <div style={{ color: "#666", fontSize: "13px" }}>
                  Booking <span style={{ color: "#DC2626" }}>{claim.booking.bookingReference}</span> — {claim.booking.renterFirstName} {claim.booking.renterLastName} ({claim.booking.renterEmail})
                </div>
              )}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#fff", fontSize: "28px", fontWeight: 700 }}>${claim.amount.toFixed(2)}</div>
              <div style={{ color: "#555", fontSize: "12px" }}>Filed {new Date(claim.filedAt).toLocaleDateString()}</div>
            </div>
          </div>

          <div style={{ backgroundColor: "#111", borderRadius: "8px", padding: "14px", marginBottom: "16px" }}>
            <div style={{ color: "#888", fontSize: "11px", textTransform: "uppercase", marginBottom: "6px" }}>Description</div>
            <div style={{ color: "#ddd", fontSize: "14px", lineHeight: "1.5" }}>{claim.description}</div>
          </div>

          {claim.evidenceUrls.length > 0 && (
            <div>
              <div style={{ color: "#888", fontSize: "11px", textTransform: "uppercase", marginBottom: "8px" }}>Evidence Photos</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {claim.evidenceUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`Evidence ${i + 1}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #333" }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {claim.resolutionNotes && (
            <div style={{ backgroundColor: "rgba(0,200,100,0.05)", border: "1px solid rgba(0,200,100,0.2)", borderRadius: "8px", padding: "12px", marginTop: "14px" }}>
              <div style={{ color: "#00C864", fontSize: "11px", textTransform: "uppercase", marginBottom: "4px" }}>Resolution Notes</div>
              <div style={{ color: "#aaa", fontSize: "13px" }}>{claim.resolutionNotes}</div>
            </div>
          )}

          {claim.status !== "resolved" && (
            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button onClick={() => setShowResolveModal(true)}
                style={{ backgroundColor: "#00C864", color: "#000", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                Mark Resolved
              </button>
            </div>
          )}
        </div>

        {/* Message Thread */}
        <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: 0 }}>Communication Thread</h3>
          </div>

          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
            {claim.messages.length === 0 ? (
              <div style={{ color: "#555", fontSize: "14px", textAlign: "center", padding: "20px" }}>No messages yet.</div>
            ) : (
              claim.messages.map((msg) => {
                const isOperator = msg.senderRole === "operator";
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: isOperator ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "70%", backgroundColor: isOperator ? "rgba(220,38,38,0.15)" : "#111", border: `1px solid ${isOperator ? "rgba(220,38,38,0.3)" : "#222"}`, borderRadius: "10px", padding: "12px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", gap: "16px" }}>
                        <span style={{ color: isOperator ? "#DC2626" : "#0096FF", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                          {isOperator ? "You (Operator)" : "Renter"}
                        </span>
                        <span style={{ color: "#555", fontSize: "11px" }}>{new Date(msg.sentAt).toLocaleString()}</span>
                      </div>
                      <div style={{ color: "#ddd", fontSize: "13px", lineHeight: "1.5" }}>{msg.message}</div>
                      {msg.attachmentUrl && (
                        <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#DC2626", fontSize: "12px", marginTop: "6px", display: "block" }}>
                          📎 Attachment
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {claim.status !== "resolved" && (
            <div style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a" }}>
              {error && <div style={{ color: "#DC2626", fontSize: "13px", marginBottom: "10px" }}>{error}</div>}
              {success && <div style={{ color: "#00C864", fontSize: "13px", marginBottom: "10px" }}>{success}</div>}
              <div style={{ display: "flex", gap: "10px" }}>
                <textarea
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message to the renter..."
                  rows={3}
                  style={{ flex: 1, backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "14px", resize: "vertical" }}
                  onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handleSendMessage(); }}
                />
                <button onClick={handleSendMessage} disabled={sendingMessage || !newMessage.trim()}
                  style={{ backgroundColor: "#DC2626", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: sendingMessage ? "not-allowed" : "pointer", alignSelf: "flex-end", opacity: sendingMessage ? 0.7 : 1 }}>
                  {sendingMessage ? "Sending..." : "Send"}
                </button>
              </div>
              <div style={{ color: "#444", fontSize: "11px", marginTop: "6px" }}>Ctrl+Enter to send</div>
            </div>
          )}
        </div>

        {/* Resolve Modal */}
        {showResolveModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
            <div style={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "440px" }}>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: "0 0 16px 0" }}>Mark Claim Resolved</h3>
              <p style={{ color: "#888", fontSize: "13px", marginBottom: "16px" }}>
                Marking this claim as resolved indicates the matter has been settled between you and the renter.
              </p>
              <textarea
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder="Describe how the claim was resolved (optional)..."
                rows={4}
                style={{ width: "100%", backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px", padding: "12px 14px", color: "#fff", fontSize: "14px", resize: "vertical", boxSizing: "border-box" }}
              />
              {error && <div style={{ color: "#DC2626", fontSize: "13px", marginTop: "10px" }}>{error}</div>}
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button onClick={handleResolve} disabled={resolving}
                  style={{ flex: 1, backgroundColor: "#00C864", color: "#000", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 700, cursor: resolving ? "not-allowed" : "pointer" }}>
                  {resolving ? "Saving..." : "Mark Resolved"}
                </button>
                <button onClick={() => { setShowResolveModal(false); setError(""); }}
                  style={{ flex: 1, backgroundColor: "transparent", color: "#aaa", border: "1px solid #333", borderRadius: "8px", padding: "12px", fontSize: "14px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
