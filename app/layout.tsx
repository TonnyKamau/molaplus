import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteChrome } from "./_components/SiteChrome";
import { Toaster } from "./_components/Toaster";
import { SITE_KEYWORDS, SITE_NAME, SITE_URL } from "../lib/seo";

const defaultDescription =
  "MolaPlus makes animal feed supplements, livestock feeds, probiotics and organic crop fertilizers for livestock, poultry and crop farmers in Kenya, Tanzania, Uganda, Zambia and Côte d'Ivoire, with farm consultancy and technical support.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MolaPlus | Animal Feed Supplements, Livestock Feeds & Organic Fertilizers",
    template: "%s | MolaPlus",
  },
  description: defaultDescription,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Agriculture",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Paste the codes from Google Search Console / Bing Webmaster Tools into .env
  // (GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION) and rebuild.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: "/",
    locale: "en_KE",
    alternateLocale: ["fr_CI"],
    title: "MolaPlus | Healthy animals. Stronger farms.",
    description: defaultDescription,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "MolaPlus — Healthy animals. Stronger farms." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MolaPlus | Healthy animals. Stronger farms.",
    description: defaultDescription,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00512c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="color-scheme" content="only light" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
      </body>
    </html>
  );
}

