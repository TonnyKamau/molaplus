import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "./_components/SiteHeader";
import { SiteFooter } from "./_components/SiteFooter";
import { BottomNav } from "./_components/BottomNav";
import { ScrollReveal } from "./_components/ScrollReveal";

export const metadata: Metadata = {
  title: "MolaPlus Africa | Advanced Animal Nutrition",
  description:
    "Innovative animal feed supplements, probiotics, consultancy, and technical support for productive farms across East Africa.",
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteHeader />
        <div className="flex min-h-[60vh] flex-col overflow-x-clip pb-24 lg:pb-0">{children}</div>
        <SiteFooter />
        <BottomNav />
        <ScrollReveal />
      </body>
    </html>
  );
}

