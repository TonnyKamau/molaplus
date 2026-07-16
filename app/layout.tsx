import type { Metadata } from "next";
import "./globals.css";
import { MobileNav } from "./_components/MobileNav";

export const metadata: Metadata = {
  title: "MolaPlus Africa | Advanced Animal Nutrition",
  description:
    "Innovative animal feed supplements, probiotics, consultancy, and technical support for productive farms across East Africa.",
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
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
