import type { Metadata, Viewport } from "next";
import { MirrorLinkInterceptor } from "@/components/MirrorLinkInterceptor";
import { BRAND_LOGO_PATH } from "@/lib/siteBranding";
/* Order matters: site overrides in globals must win over the storefront baseline. */
import "./storefront.css";
import "./globals.css";

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
  themeColor: "#FF9A6D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <body
        className="x x-fonts-cantarell x-fonts-poppins"
        suppressHydrationWarning
      >
        <MirrorLinkInterceptor />
        {children}
      </body>
    </html>
  );
}
