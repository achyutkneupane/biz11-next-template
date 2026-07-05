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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; connect-src 'self' https://api.stripe.com https://ecomkit.test; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com https://ecomkit.test; font-src 'self' data:; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
