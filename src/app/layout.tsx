import type { Metadata, Viewport } from "next";
import { BottomNav } from "@/components/navigation/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wedding Command Center",
  description: "Private family wedding management app",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#FBE9E7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 selection:bg-rose-100">
        <div className="flex-1 max-w-md w-full mx-auto pb-20 sm:pb-24">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
