import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS export for Bluehost shared hosting (served by Apache
  // alongside the PHP API). No Node server required.
  output: "export",
  trailingSlash: true,
  images: {
    // Apache serves the images directly; Next's image optimizer needs a server.
    unoptimized: true,
  },
};

export default nextConfig;
