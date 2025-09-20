import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SalonAI - Smart Salon Management",
  description: "AI-powered scheduling and recommendation system for hair salons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-salon-light min-h-screen">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
