import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build to plain static HTML in /out. Every page is pre-rendered.
  output: "export",
  // Static hosting has no image optimizer, so serve images as they are.
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
