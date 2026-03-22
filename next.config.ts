import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.saffron.box" }],
      destination: "https://saffron.box/:path*",
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
