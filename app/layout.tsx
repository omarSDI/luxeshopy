import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Suspense } from 'react';
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import WhatsAppButton from "./components/WhatsAppButton";
import VisitorTracker from "./components/VisitorTracker";
import FBPixelScript from "./components/FBPixelScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuxeShopy | Shop Premium Watches & Luxury Gear",
  description: "Experience excellence with LuxeShopy. Discover our curated collection of luxury timepieces and premium tech. Quality gear for the modern visionary.",
  keywords: ["watches", "luxury", "tech", "luxeshopy", "fashion", "premium"],
  openGraph: {
    title: "LuxeShopy - Premium Collection",
    description: "Quality gear for the modern visionary.",
    url: "https://luxeshopy.tn",
    siteName: "LuxeShopy",
    images: [
      {
        url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "LuxeShopy Luxury Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LanguageProvider>
            <Suspense fallback={null}>
              <FBPixelScript />
            </Suspense>
            <VisitorTracker />
            {children}
            <Toaster
              position="top-right"
              richColors
              toastOptions={{
                style: {
                  background: '#111827',
                  color: '#fff',
                  border: '1px solid #f9c94d',
                },
              }}
            />
            <WhatsAppButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
