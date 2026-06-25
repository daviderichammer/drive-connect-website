import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Drive Connect — Built For Operators. Designed For Travelers.",
  description:
    "Drive Connect is a trusted peer-to-peer vehicle rental platform. Lower prices for renters. Higher revenue for operators. No unnecessary middleman.",
  keywords:
    "car rental, peer to peer rental, vehicle rental, Drive Connect, rental platform, luxury car rental",
  openGraph: {
    title: "Drive Connect",
    description: "Built For Operators. Designed For Travelers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
