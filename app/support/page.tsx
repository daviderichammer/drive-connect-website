"use client";

import { useState } from "react";
import Link from "next/link";

const faqCategories = [
  {
    category: "Booking Questions",
    icon: "📅",
    faqs: [
      {
        q: "How do I book a vehicle on Drive Connect?",
        a: "Search for vehicles by location and dates, select your vehicle, complete identity and insurance verification, review the rental agreement, and submit payment. The entire process is digital — no counters, no waiting.",
      },
      {
        q: "Can I modify or cancel my reservation?",
        a: "Reservation modifications and cancellations are handled through your renter dashboard. Cancellation policies vary by operator and are displayed before booking. Contact the operator directly through the platform messaging system.",
      },
      {
        q: "How far in advance can I book?",
        a: "You can book vehicles up to 12 months in advance. Same-day bookings are available with operators who have enabled that option.",
      },
    ],
  },
  {
    category: "Insurance Questions",
    icon: "🛡️",
    faqs: [
      {
        q: "What insurance do I need to rent a vehicle?",
        a: "You must upload proof of active personal auto insurance before completing a booking. Our system verifies your policy is active and meets minimum coverage requirements. You may also add a Drive Connect protection plan at checkout.",
      },
      {
        q: "Does my personal insurance cover rental vehicles?",
        a: "Most personal auto insurance policies extend coverage to rental vehicles, but coverage varies. Check with your insurance provider before renting. Drive Connect protection plans are available as supplemental coverage.",
      },
      {
        q: "What happens if I am in an accident?",
        a: "Contact emergency services first if needed. Then report the incident through the platform immediately. Document the scene with photos. The operator will guide you through the claims process. Drive Connect provides document management support throughout.",
      },
    ],
  },
  {
    category: "Payment Questions",
    icon: "💳",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "Drive Connect accepts credit cards, debit cards, Apple Pay, Google Pay, and ACH transfers. A security deposit authorization hold is placed at booking and released after successful vehicle return.",
      },
      {
        q: "When am I charged for my rental?",
        a: "Payment is collected at the time of booking confirmation. The security deposit is an authorization hold — not a charge — and is automatically released after the return inspection is complete.",
      },
      {
        q: "How do refunds work?",
        a: "Refunds are processed according to the operator's cancellation policy. Security deposit holds are released within 3-5 business days after vehicle return. Contact support if you have questions about a specific transaction.",
      },
    ],
  },
  {
    category: "Pickup & Return Questions",
    icon: "🚗",
    faqs: [
      {
        q: "How does airport pickup work?",
        a: "Operators offering airport delivery will meet you at a designated location at the airport. Specific pickup instructions are provided in your booking confirmation and through the platform messaging system.",
      },
      {
        q: "What do I need to bring at pickup?",
        a: "Bring the same driver's license you used during verification, and be prepared to confirm your identity. The operator may also verify your insurance card. All documentation should match what was submitted during booking.",
      },
      {
        q: "How do I return the vehicle?",
        a: "Return the vehicle to the agreed location at the agreed time. The operator will conduct a return inspection. You will receive a digital return confirmation. Leave a review to help build the trusted Drive Network community.",
      },
    ],
  },
  {
    category: "Operator Questions",
    icon: "🏢",
    faqs: [
      {
        q: "How do I become a Drive Network Partner?",
        a: "Submit a partner application through our website. Our team reviews all applications personally. We verify your business, vehicles, and insurance. Approval typically takes 2-3 business days.",
      },
      {
        q: "What fees does Drive Connect charge operators?",
        a: "Drive Connect charges lower platform fees than traditional rental platforms. Specific fee structures are provided during the application and onboarding process. We believe operators deserve to keep more of their revenue.",
      },
      {
        q: "Can I set my own pricing?",
        a: "Yes. Operators have full control over daily, weekly, and monthly pricing. You can also set delivery fees, additional driver fees, and other add-on pricing. Dynamic pricing tools will be available in a future update.",
      },
    ],
  },
  {
    category: "Technical Issues",
    icon: "⚙️",
    faqs: [
      {
        q: "I am having trouble uploading my documents. What should I do?",
        a: "Ensure your documents are in JPG, PNG, or PDF format and under 10MB. Make sure the document is clearly legible and not expired. If you continue to have issues, contact our support team directly.",
      },
      {
        q: "I cannot log into my account. What should I do?",
        a: "Use the Forgot Password option on the login page. If you continue to have issues, contact support with your registered email address and we will assist you promptly.",
      },
    ],
  },
];

export default function SupportPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <>
      {/* Header */}
      <section
        style={{
          backgroundColor: "#000000",
          padding: "5rem 1.5rem",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 6vw, 3.5rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              lineHeight: 1.05,
            }}
          >
            Support When{" "}
            <span style={{ color: "#DC2626" }}>You Need It.</span>
          </h1>
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "1.125rem",
              lineHeight: 1.8,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            We are here to help renters and operators alike. Find answers below or contact our team directly.
          </p>
        </div>
      </section>

      {/* SUPPORT OPTIONS */}
      <section style={{ padding: "3rem 1.5rem", backgroundColor: "#F5F5F5", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {[
              { icon: "💬", label: "Live Chat", desc: "Chat with our team", available: "Coming Soon" },
              { icon: "📧", label: "Email Support", desc: "support@driveconnect.com", available: "24-48hr response" },
              { icon: "📞", label: "Phone Support", desc: "Available for urgent issues", available: "Coming Soon" },
              { icon: "🚨", label: "Emergency Assistance", desc: "For active rental emergencies", available: "Coming Soon" },
            ].map((option) => (
              <div
                key={option.label}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  padding: "1.5rem",
                  border: "1px solid #e5e7eb",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.625rem" }}>{option.icon}</div>
                <h3 style={{ fontSize: "0.9375rem", fontWeight: 800, color: "#000000", marginBottom: "0.25rem" }}>
                  {option.label}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "#555555", marginBottom: "0.375rem" }}>{option.desc}</p>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: option.available === "Coming Soon" ? "#888888" : "#DC2626",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {option.available}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "#000000",
              letterSpacing: "-0.02em",
              marginBottom: "2.5rem",
            }}
          >
            Frequently Asked Questions
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2.5rem", alignItems: "start" }}>
            {/* Category nav */}
            <div style={{ position: "sticky", top: "80px" }}>
              {faqCategories.map((cat, i) => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    width: "100%",
                    padding: "0.75rem 1rem",
                    backgroundColor: activeCategory === i ? "#000000" : "transparent",
                    color: activeCategory === i ? "#ffffff" : "#555555",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textAlign: "left",
                    marginBottom: "0.25rem",
                    fontFamily: "Inter, sans-serif",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  <span>{cat.icon}</span>
                  {cat.category}
                </button>
              ))}
            </div>

            {/* FAQ items */}
            <div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#000000",
                  marginBottom: "1.5rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "2px solid #000000",
                }}
              >
                {faqCategories[activeCategory].icon} {faqCategories[activeCategory].category}
              </h3>
              {faqCategories[activeCategory].faqs.map((faq, i) => {
                const key = `${activeCategory}-${i}`;
                const isOpen = openFaq === key;
                return (
                  <div
                    key={key}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      marginBottom: "0.75rem",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : key)}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        padding: "1.125rem 1.25rem",
                        backgroundColor: isOpen ? "#000000" : "#ffffff",
                        color: isOpen ? "#ffffff" : "#000000",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ fontSize: "1.25rem", flexShrink: 0, marginLeft: "1rem" }}>
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          padding: "1.25rem",
                          backgroundColor: "#F5F5F5",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <p style={{ fontSize: "0.9375rem", color: "#444444", lineHeight: 1.7, margin: 0 }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#000000" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4vw, 2.5rem)",
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Contact Our Team
            </h2>
            <p style={{ color: "#888888", fontSize: "1rem" }}>
              Can&apos;t find your answer above? Send us a message and we will respond within 24-48 hours.
            </p>
          </div>

          {formStatus === "success" ? (
            <div
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid #1a1a1a",
                borderRadius: "12px",
                padding: "3rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                Message Sent
              </h3>
              <p style={{ color: "#888888", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                Thank you for contacting Drive Connect. Our team will respond within 24-48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #1a1a1a",
                  borderRadius: "12px",
                  padding: "2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Subject *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="">Select a topic...</option>
                    <option>Booking Question</option>
                    <option>Insurance Question</option>
                    <option>Claims Support</option>
                    <option>Payment Question</option>
                    <option>Pickup / Return Question</option>
                    <option>Operator / Partner Question</option>
                    <option>Technical Issue</option>
                    <option>Reservation Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#888888", marginBottom: "0.375rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or issue in detail..."
                    style={{ width: "100%", padding: "0.75rem 1rem", border: "1px solid #333333", borderRadius: "6px", fontSize: "0.9375rem", backgroundColor: "#1a1a1a", color: "#ffffff", outline: "none", fontFamily: "Inter, sans-serif", resize: "vertical" }}
                  />
                </div>
                {formStatus === "error" && (
                  <p style={{ color: "#DC2626", fontSize: "0.875rem", margin: 0 }}>
                    There was an error sending your message. Please try again or email us directly at support@driveconnect.com
                  </p>
                )}
                <button
                  type="submit"
                  disabled={formStatus === "submitting"}
                  style={{
                    backgroundColor: "#DC2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "1rem",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: formStatus === "submitting" ? "not-allowed" : "pointer",
                    opacity: formStatus === "submitting" ? 0.7 : 1,
                    fontFamily: "Inter, sans-serif",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  {formStatus === "submitting" ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Philosophy insert */}
      <div style={{ backgroundColor: "#DC2626", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.875rem", fontStyle: "italic", margin: 0 }}>
          &ldquo;Trust begins with communication.&rdquo;
        </p>
      </div>
    </>
  );
}
