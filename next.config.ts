import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/kesar-during-pregnancy",
        destination: "/blog/saffron-for-pregnancy",
        permanent: true,
      },
    ];
  },
  serverExternalPackages: ["pdfkit"],
  images: {
    // Cap generated widths so ultra-wide viewports don’t pull 3840px assets (see deviceSizes).
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [65, 68, 70, 75, 80],
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
