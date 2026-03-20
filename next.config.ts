import type { NextConfig } from "next"
// import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
// import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());

// if (process.env.NODE_ENV === "development") {
//   await setupDevPlatform();
// }

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./image-loader.ts",
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

