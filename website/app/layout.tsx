import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://deposittrack.app"),
  title: {
    default: "DepositTrack — Protect Security Deposits with Verified Photo Evidence",
    template: "%s · DepositTrack",
  },
  description:
    "Create move-in and move-out inspection reports with photos, signatures, GPS verification, and downloadable PDFs. Protect security deposits with verified photo evidence.",
  keywords: [
    "security deposit",
    "move-in inspection",
    "move-out inspection",
    "rental inspection app",
    "tenant landlord report",
    "property condition report",
  ],
  openGraph: {
    title: "DepositTrack — Protect Security Deposits with Verified Photo Evidence",
    description:
      "Move-in and move-out inspection reports with photos, signatures, GPS verification, and PDFs.",
    url: "https://deposittrack.app",
    siteName: "DepositTrack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DepositTrack",
    description:
      "Protect security deposits with verified photo evidence. Move-in and move-out reports in minutes.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E7C66",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
