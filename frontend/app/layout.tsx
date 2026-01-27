import type React from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nexus",
  description: "Nexus",
  generator: "v0.app",
  icons: {
    icon: "https://storage.googleapis.com/aiml-coe-web-app/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
