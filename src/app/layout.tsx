import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Forms & Reports",
  description: "Select, fill, and export inspection forms as reports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-app-bg text-app-text">
        <Header />
        {children}
      </body>
    </html>
  );
}
