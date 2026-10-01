import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo lives inside a folder that has its own lockfile; pin the root.
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
