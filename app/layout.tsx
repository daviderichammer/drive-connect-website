import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Drive Connect — The Marketplace Built for Professional Vehicle Operators",
  description:
    "Drive Connect is the customer-facing marketplace of the Global Drive Holdings ecosystem, connecting professional vehicle operators with customers through integrated technology, protection, service, and operational infrastructure.",
  keywords:
    "professional vehicle operators, independent rental operators, fleet marketplace, vehicle lifecycle, Drive Connect, Global Drive Holdings, Drive KeZ",
  openGraph: {
    title: "Drive Connect — Built for Professional Vehicle Operators",
    description:
      "More than a marketplace. An ecosystem for professional vehicle operators and their customers.",
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
