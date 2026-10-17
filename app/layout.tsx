import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/400.css";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: { default: "AL WATHBAH | Premium Automotive Detailing & Protection", template: "%s | AL WATHBAH" },
  description: "Premium automotive detailing, paint protection, styling, wrapping, tinting, polishing, and ceramic coating studio in the UAE.",
  keywords: ["Al Wathbah", "car detailing UAE", "paint protection film", "color PPF", "vehicle wraps", "ceramic coating", "window tinting"],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0d0e10", colorScheme: "dark", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>;
}
