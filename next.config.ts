import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const pageFrameHeaders = [{ key: "X-Frame-Options", value: "DENY" }];

const cardImageHeaders = [
  { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
  { key: "Content-Type", value: "image/png" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
    ],
  },
  async rewrites() {
    return [
      { source: "/twitter-image", destination: "/og-image.png" },
      { source: "/opengraph-image", destination: "/og-image.png" },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/",
        headers: pageFrameHeaders,
      },
      {
        source: "/og-image.png",
        headers: cardImageHeaders,
      },
      {
        source: "/twitter-image",
        headers: cardImageHeaders,
      },
      {
        source: "/opengraph-image",
        headers: cardImageHeaders,
      },
    ];
  },
};

export default nextConfig;
