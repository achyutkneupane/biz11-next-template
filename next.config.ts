import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["ecom-front.test"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ecomkit.test",
      },
    ],
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
