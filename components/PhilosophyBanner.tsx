"use client";

import { useState, useEffect } from "react";

const philosophyStatements = [
  "Business works best when everyone succeeds together.",
  "Platforms should create trust. Not conflict.",
  "Operators deserve infrastructure built around their businesses.",
  "Customers deserve professional vehicle experiences.",
  "Trust creates better transactions.",
  "Technology should remove inefficiency.",
  "No one should win at someone else's expense.",
  "Healthy markets create healthy businesses.",
  "Professional operators deserve connected infrastructure.",
  "Better information creates better markets.",
  "Simple systems create better customer experiences.",
  "Protection exists to create trust.",
  "Aligned incentives create healthier markets.",
  "Everyone succeeds together.",
  "Fairness creates trust.",
  "Trust lowers friction.",
  "Efficient markets create better outcomes.",
];

interface PhilosophyBannerProps {
  dark?: boolean;
}

export default function PhilosophyBanner({ dark = false }: PhilosophyBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % philosophyStatements.length);
        setVisible(true);
      }, 500);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: dark ? "#000000" : "#F5F5F5",
        borderTop: dark ? "1px solid #1a1a1a" : "1px solid #e5e7eb",
        borderBottom: dark ? "1px solid #1a1a1a" : "1px solid #e5e7eb",
        padding: "1.25rem 1.5rem",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <p
        style={{
          fontSize: "0.9375rem",
          fontWeight: 500,
          fontStyle: "italic",
          color: dark ? "#cccccc" : "#333333",
          margin: 0,
          transition: "opacity 0.5s ease, transform 0.5s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(6px)",
        }}
      >
        &ldquo;{philosophyStatements[currentIndex]}&rdquo;
      </p>
    </div>
  );
}
