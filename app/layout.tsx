import type { Metadata, Viewport } from "next";
/* Order matters: site overrides in globals must win over the storefront baseline. */
import "./storefront.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bobbiedsweettreats.com"),
  title: "BobbieD's Sweet Treats",
  description:
    "From celebrations to craving's, Bobbie D's sweet treats has the perfect dessert for every moment!",
  authors: [{ name: "BobbieD's Sweet Treats" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bobbiedsweettreats.com/",
    siteName: "BobbieD's Sweet Treats",
    title: "BobbieD's Sweet Treats",
    description:
      "From celebrations to craving's, Bobbie D's sweet treats has the perfect dessert for every moment!",
    images: [
      {
        url: "/site-media/52700c3579e2b7c7.jpg",
        alt: "BobbieD's Sweet Treats",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "BobbieD's Sweet Treats",
    description: "Delicious Confections Fresh Daily",
    images: [
      "/site-media/52700c3579e2b7c7.jpg",
    ],
  },
  icons: {
    icon: [
      {
        url: "/site-media/52700c3579e2b7c7.jpg",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/site-media/52700c3579e2b7c7.jpg",
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
        {children}
      </body>
    </html>
  );
}
