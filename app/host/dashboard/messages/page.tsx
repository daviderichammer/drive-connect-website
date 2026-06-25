"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";

interface HostData {
  id: number;
  email: string;
  businessName: string;
  ownerName: string;
  onboardingCompleted: boolean;
}

interface Conversation {
  bookingId: number;
  bookingReference: string;
  renterName: string;
  renterEmail: string;
  vehicle: string;
  lastMessage: { content: string; senderType: string; createdAt: string } | null;
  unreadCount: number;
  bookingStatus: string;
}

interface Message {
  id: number;
  bookingId: number;
  senderType: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [host, setHost] = useState<HostData | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/host/dashboard/messages");
    if (res.ok) {
      const data = await res.json();
      setConversations(data.conversations || []);
    }
  }, []);

  const fetchMessages = useCallback(async (bookingId: number) => {
    const res = await fetch(`/api/host/dashboard/messages?bookingId=${bookingId}`);
    if (res.ok) {
      const data = await res.json();
      setMessages(data.messages || []);
    }
  }, []);

  useEffect(() => {
    fetch("/api/host/me").then(async (res) => {
      if (res.status === 401) { router.push("/host/login"); return; }
      const d = await res.json();
      if (!d.authenticated || !d.host.onboardingCompleted) { router.push("/host/login"); return; }
      setHost(d.host);
      await fetchConversations();
      setLoading(false);

      const bid = searchParams.get("bookingId");
      if (bid) setSelectedBookingId(parseInt(bid));
    }).catch(() => router.push("/host/login"));
  }, [router, searchParams, fetchConversations]);

  useEffect(() => {
    if (selectedBookingId) {
      fetchMessages(selectedBookingId);
      const conv = conversations.find((c) => c.bookingId === selectedBookingId);
      if (conv) setSelectedConv(conv);
    }
  }, [selectedBookingId, conversations, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectConversation = (conv: Conversation) => {
    setSelectedBookingId(conv.bookingId);
    setSelectedConv(conv);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedBookingId) return;
    setSending(true);

    const res = await fetch("/api/host/dashboard/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: selectedBookingId, content: newMessage.trim() }),
    });

    setSending(false);
    if (res.ok) {
      setNewMessage("");
      await fetchMessages(selectedBookingId);
      await fetchConversations();
    }
  };

  const formatTime = (d: string) => {
    const date = new Date(d);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontFamily: "Inter, sans-serif" }}>
        Loading messages...
      </div>
    );
  }

  if (!host) return null;

  return (
    <DashboardShell hostName={host.ownerName} hostEmail={host.email} businessName={host.businessName}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, margin: "0 0 4px" }}>Messages</h2>
        <p style={{ color: "#555555", fontSize: "14px", margin: 0 }}>
          {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread message{conversations.reduce((sum, c) => sum + c.unreadCount, 0) !== 1 ? "s" : ""}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "0", backgroundColor: "#111111", border: "1px solid #1a1a1a", borderRadius: "8px", overflow: "hidden", minHeight: "600px" }}>
        {/* Conversation List */}
        <div style={{ borderRight: "1px solid #1a1a1a", overflowY: "auto" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #1a1a1a" }}>
            <p style={{ color: "#555", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
              CONVERSATIONS ({conversations.length})
            </p>
          </div>

          {conversations.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#555" }}>
              <p style={{ fontSize: "14px", marginBottom: "8px" }}>No messages yet.</p>
              <p style={{ fontSize: "12px" }}>Messages from renters will appear here.</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.bookingId}
                onClick={() => selectConversation(conv)}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #0d0d0d",
                  cursor: "pointer",
                  backgroundColor: selectedBookingId === conv.bookingId ? "rgba(193,18,31,0.05)" : "transparent",
                  borderLeft: selectedBookingId === conv.bookingId ? "2px solid #C1121F" : "2px solid transparent",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                    {conv.renterName}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {conv.unreadCount > 0 && (
                      <span style={{ backgroundColor: "#C1121F", color: "#fff", borderRadius: "10px", padding: "1px 6px", fontSize: "10px", fontWeight: 700 }}>
                        {conv.unreadCount}
                      </span>
                    )}
                    {conv.lastMessage && (
                      <span style={{ color: "#444", fontSize: "10px" }}>{formatTime(conv.lastMessage.createdAt)}</span>
                    )}
                  </div>
                </div>
                <p style={{ color: "#555", fontSize: "11px", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {conv.vehicle}
                </p>
                {conv.lastMessage && (
                  <p style={{ color: "#444", fontSize: "11px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {conv.lastMessage.senderType === "host" ? "You: " : ""}{conv.lastMessage.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Message Thread */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!selectedConv ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#444" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "16px", marginBottom: "8px" }}>Select a conversation</p>
                <p style={{ fontSize: "13px" }}>Choose a conversation from the left to view messages.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a" }}>
                <p style={{ color: "#fff", fontSize: "14px", fontWeight: 700, margin: "0 0 2px" }}>
                  {selectedConv.renterName}
                </p>
                <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>
                  {selectedConv.vehicle} · <span style={{ fontFamily: "monospace" }}>{selectedConv.bookingReference}</span>
                </p>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px", minHeight: "400px" }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#444", marginTop: "40px" }}>
                    <p style={{ fontSize: "14px", marginBottom: "8px" }}>No messages yet.</p>
                    <p style={{ fontSize: "12px" }}>Start the conversation below.</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isHost = msg.senderType === "host";
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: "flex",
                          justifyContent: isHost ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "70%",
                            backgroundColor: isHost ? "#C1121F" : "#1a1a1a",
                            borderRadius: isHost ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                            padding: "10px 14px",
                          }}
                        >
                          <p style={{ color: "#fff", fontSize: "13px", margin: "0 0 4px", lineHeight: 1.5 }}>
                            {msg.content}
                          </p>
                          <p style={{ color: isHost ? "rgba(255,255,255,0.5)" : "#444", fontSize: "10px", margin: 0, textAlign: isHost ? "right" : "left" }}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} style={{ padding: "16px 20px", borderTop: "1px solid #1a1a1a", display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    backgroundColor: "#0a0a0a",
                    border: "1px solid #222",
                    borderRadius: "6px",
                    padding: "10px 14px",
                    color: "#fff",
                    fontSize: "13px",
                    fontFamily: "Inter, sans-serif",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  style={{
                    backgroundColor: "#C1121F",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: sending || !newMessage.trim() ? "not-allowed" : "pointer",
                    fontFamily: "Inter, sans-serif",
                    opacity: sending || !newMessage.trim() ? 0.5 : 1,
                  }}
                >
                  {sending ? "..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
