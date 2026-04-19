import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "saffron.town" }], // ← non-www triggers redirect
      destination: "https://www.saffron.town/:path*", // ← sends to www
      permanent: true,
    },
    {
      source: "/products",
      destination: "/shop",
      permanent: true,
    },
    {
      source: "/products/:path*",
      destination: "/shop/:path*",
      permanent: true,
    },
    {
      source: "/kesar",
      destination: "/shop",
      permanent: true,
    },
    {
      source: "/kashmir-saffron",
      destination: "/shop",
      permanent: true,
    },
    {
      source: "/blog/how-to-test-saffron-at-home",
      destination: "/blog/how-to-identify-fake-saffron",
      permanent: true,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
