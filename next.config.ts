import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

/** Keep module resolution inside this repo (avoids picking a parent lockfile / stale Prisma client). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/blog/kesar-during-pregnancy",
        destination: "/blog/saffron-for-pregnancy",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/our-story",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://salesiq.zohopublic.in https://*.zohocdn.com https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://checkout.razorpay.com https://*.razorpay.com;
              style-src 'self' 'unsafe-inline' https://*.zohocdn.com https://*.razorpay.com;
              img-src 'self' blob: data: https://cdn.sanity.io https://images.unsplash.com https://plus.unsplash.com https://*.zohocdn.com https://www.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://*.razorpay.com;
              font-src 'self' data: https://*.zohocdn.com https://*.razorpay.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              frame-src 'self' https://salesiq.zohopublic.in https://*.razorpay.com;
              connect-src 'self' https://salesiq.zohopublic.in https://*.zohocdn.com https://www.google-analytics.com https://cdn.sanity.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://api.razorpay.com https://*.razorpay.com https://lumberjack.razorpay.com;
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "unsafe-none",
          },
        ],
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
