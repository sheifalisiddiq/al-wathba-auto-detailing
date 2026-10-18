import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { business, services } from "@/lib/site-data";

const display = localFont({
  src: [
    { path: "./fonts/clash-display-500.woff2", weight: "500" },
    { path: "./fonts/clash-display-600.woff2", weight: "600" },
    { path: "./fonts/clash-display-700.woff2", weight: "700" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
});

const body = localFont({
  src: [
    { path: "./fonts/satoshi-400.woff2", weight: "400" },
    { path: "./fonts/satoshi-500.woff2", weight: "500" },
    { path: "./fonts/satoshi-700.woff2", weight: "700" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const arabic = Tajawal({ subsets: ["arabic"], weight: ["700", "800"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  title: { default: "AL WATHBAH | Premium Car Detailing, PPF & Ceramic Coating · Sharjah & Ajman", template: "%s | AL WATHBAH" },
  description: "Premium car detailing studio in Sharjah & Ajman. Paint protection film, color PPF, wraps, ceramic coating, window tinting, polishing and VIP wash — because every part matters.",
  keywords: ["Al Wathbah", "car detailing Sharjah", "car detailing Ajman", "PPF UAE", "color PPF", "vehicle wrap", "ceramic coating", "window tinting"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "AL WATHBAH",
    title: "AL WATHBAH | Premium Car Detailing Studio",
    description: "Paint protection, color PPF, wraps, ceramic coating and detailing in Sharjah & Ajman.",
  },
};

export const viewport: Viewport = { themeColor: "#0b0b0c", colorScheme: "dark", width: "device-width", initialScale: 1, viewportFit: "cover" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: business.name,
  legalName: business.legalName,
  slogan: business.promise,
  areaServed: ["Sharjah", "Ajman"],
  sameAs: [business.instagram],
  makesOffer: services.map((service) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: service.title } })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${arabic.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
