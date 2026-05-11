import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { BRAND_LOGO_PATH } from "@/lib/siteBranding";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL != null && process.env.NEXT_PUBLIC_SITE_URL !== ""
    ? new URL(
        process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
          ? process.env.NEXT_PUBLIC_SITE_URL
          : `https://${process.env.NEXT_PUBLIC_SITE_URL}`,
      )
    : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "BobbieD's Sweet Treats",
  description:
    "From celebrations to craving's, Bobbie D's sweet treats has the perfect dessert for every moment!",
  authors: [{ name: "BobbieD's Sweet Treats" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl.href,
    siteName: "BobbieD's Sweet Treats",
    title: "BobbieD's Sweet Treats",
    description:
      "From celebrations to craving's, Bobbie D's sweet treats has the perfect dessert for every moment!",
    images: [
      {
        url: BRAND_LOGO_PATH,
        alt: "BobbieD's Sweet Treats",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "BobbieD's Sweet Treats",
    description: "Delicious Confections Fresh Daily",
    images: [BRAND_LOGO_PATH],
  },
  icons: {
    icon: [
      {
        url: BRAND_LOGO_PATH,
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: BRAND_LOGO_PATH,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#c96b3c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
