import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Allow unoptimized local images to avoid errors when map images are missing
    unoptimized: true,
  },
};

export default nextConfig;
