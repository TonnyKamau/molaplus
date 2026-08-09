import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";
import { ScrollReveal } from "./_components/ScrollReveal";

export const metadata: Metadata = {
  metadataBase: new URL("https://molaplusafrica.com"),
  title: "MolaPlus Africa | Advanced Animal Nutrition",
  description:
    "Innovative animal feed supplements, probiotics, consultancy, and technical support for productive farms across East Africa.",
  openGraph: {
    title: "MolaPlus Africa | Healthy animals. Stronger farms.",
    description: "Advanced animal nutrition developed for productive East African farms.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "MolaPlus Africa — Healthy animals. Stronger farms." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MolaPlus Africa | Healthy animals. Stronger farms.",
    description: "Advanced animal nutrition developed for productive East African farms.",
    images: ["/og.png"],
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
        <SiteHeader />
        <div className="flex min-h-[60vh] flex-col overflow-x-clip">{children}</div>
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}

