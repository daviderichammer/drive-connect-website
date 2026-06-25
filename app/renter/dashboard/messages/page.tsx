"use client";
import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RenterDashboardShell from "@/components/RenterDashboardShell";

interface RenterData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface Conversation {
  bookingId: number;
  bookingReference: string;
  vehicle: string;
  hostName: string;
  lastMessage: { content: string; senderType: string; createdAt: string } | null;
  unreadCount: number;
  bookingStatus: string;
}

interface Message {
  id: number;
  content: string;
  senderType: string;
  createdAt: string;
  isRead: boolean;
}

interface BookingInfo {
  id: number;
  bookingReference: string;
  vehicle: { year: number; make: string; model: string };
  host: { businessName: string; ownerName: string };
  status: string;
}

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingIdParam = searchParams.get("bookingId");

  const [renter, setRenter] = useState<RenterData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    bookingIdParam ? parseInt(bookingIdParam) : null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/renter/dashboard/messages");
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations || []);
    }
  }, []);

  const fetchMessages = useCallback(async (bookingId: number) => {
    const res = await fetch(`/api/renter/dashboard/messages?bookingId=${bookingId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
      setBookingInfo(data.booking || null);
    }
  }, []);

  useEffect(() => {
    fetch("/api/renter/me").then(async (res) => {
      if (res.status === 401) { router.push("/renter/login"); return; }
      const d = await res.json();
      if (!d.authenticated) { router.push("/renter/login"); return; }
      setRenter(d.renter);
      await fetchConversations();
      setLoading(false);
    }).catch(() => router.push("/renter/login"));
  }, [router, fetchConversations]);

  useEffect(() => {
    if (selectedBookingId) {
      fetchMessages(selectedBookingId);
    }
  }, [selectedBookingId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedBookingId || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/renter/dashboard/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: selectedBookingId, content: newMessage.trim() }),
      });
      if (res.ok) {
        setNewMessage("");
        await fetchMessages(selectedBookingId);
        await fetchConversations();
      }
    } catch {
      // ignore
    }
    setSending(false);
  };

  if (!renter) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <RenterDashboardShell renterName={`${renter.firstName} ${renter.lastName}`} renterEmail={renter.email}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#ffffff", fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.375rem" }}>Messages</h1>
        <p style={{ color: "#555555", fontSize: "0.9375rem", margin: 0 }}>Communicate with your hosts</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedBookingId ? "280px 1fr" : "1fr", gap: "1.5rem", height: "calc(100vh - 220px)", minHeight: "400px" }}>
        {/* Conversation list */}
        <div style={{
          backgroundColor: "#0a0a0a",
          border: "1px solid #1a1a1a",
          borderRadius: "10px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a" }}>
            <p style={{ color: "#888888", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              Conversations ({conversations.length})
            </p>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#555555", fontSize: "13px" }}>Loading...</div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#444444", fontSize: "13px" }}>
                No conversations yet.<br />
                <span style={{ fontSize: "11px" }}>Messages appear after booking.</span>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.bookingId}
                  onClick={() => setSelectedBookingId(conv.bookingId)}
                  style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid #111111",
                    cursor: "pointer",
                    backgroundColor: selectedBookingId === conv.bookingId ? "#111111" : "transparent",
                    transition: "background-color 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                    <p style={{ color: "#ffffff", fontSize: "13px", fontWeight: 600, margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.hostName}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                      {conv.unreadCount > 0 && (
                        <span style={{ backgroundColor: "#C1121F", color: "#ffffff", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "10px" }}>
                          {conv.unreadCount}
                        </span>
                      )}
                      {conv.lastMessage && (
                        <span style={{ color: "#444444", fontSize: "10px" }}>{formatTime(conv.lastMessage.createdAt)}</span>
                      )}
                    </div>
                  </div>
                  <p style={{ color: "#666666", fontSize: "11px", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.vehicle}
                  </p>
                  {conv.lastMessage && (
                    <p style={{ color: "#444444", fontSize: "11px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {conv.lastMessage.senderType === "renter" ? "You: " : ""}{conv.lastMessage.content}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message thread */}
        {selectedBookingId && (
          <div style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Thread header */}
            {bookingInfo && (
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, margin: "0 0 2px" }}>
                    {bookingInfo.host.businessName || bookingInfo.host.ownerName}
                  </p>
                  <p style={{ color: "#555555", fontSize: "11px", margin: 0 }}>
                    {bookingInfo.vehicle.year} {bookingInfo.vehicle.make} {bookingInfo.vehicle.model} · {bookingInfo.bookingReference}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBookingId(null)}
                  style={{ background: "none", border: "none", color: "#666666", cursor: "pointer", fontSize: "18px" }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "#444444", fontSize: "13px", marginTop: "2rem" }}>
                  No messages yet. Send the first message.
                </div>
              ) : (
                messages.map((msg) => {
                  const isRenter = msg.senderType === "renter";
                  return (
                    <div key={msg.id} style={{ display: "flex", justifyContent: isRenter ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "70%",
                        backgroundColor: isRenter ? "#C1121F" : "#1a1a1a",
                        borderRadius: isRenter ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        padding: "10px 14px",
                      }}>
                        {!isRenter && (
                          <p style={{ color: "#888888", fontSize: "10px", fontWeight: 700, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Host
                          </p>
                        )}
                        <p style={{ color: "#ffffff", fontSize: "14px", margin: "0 0 4px", lineHeight: 1.5 }}>{msg.content}</p>
                        <p style={{ color: isRenter ? "rgba(255,255,255,0.6)" : "#555555", fontSize: "10px", margin: 0, textAlign: "right" }}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSend} style={{ padding: "1rem 1.25rem", borderTop: "1px solid #1a1a1a", display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: "0.75rem 1rem",
                  backgroundColor: "#111111",
                  border: "1px solid #222222",
                  borderRadius: "6px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "Inter, sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: sending || !newMessage.trim() ? "#333333" : "#C1121F",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: sending || !newMessage.trim() ? "not-allowed" : "pointer",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {sending ? "..." : "Send"}
              </button>
            </form>
          </div>
        )}

        {/* No conversation selected */}
        {!selectedBookingId && conversations.length > 0 && (
          <div style={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #1a1a1a",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#444444",
            fontSize: "14px",
          }}>
            Select a conversation to view messages
          </div>
        )}
      </div>
    </RenterDashboardShell>
  );
}

function RenterMessagesPageInner() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", backgroundColor: "#000000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#ffffff", fontSize: "14px", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}

export default function RenterMessagesPage() {
  return (
    <Suspense fallback={<div style={{color:"#888",padding:"40px",textAlign:"center"}}>Loading...</div>}>
      <RenterMessagesPageInner />
    </Suspense>
  );
}
