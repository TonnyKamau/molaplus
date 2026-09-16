import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "acgjxvqcwpeuclcfvgak.supabase.co",
        pathname: "/storage/v1/object/public/molaplus-blog-images/**",
      },
    ],
  },
};

export default nextConfig;
