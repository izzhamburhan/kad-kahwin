import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo>, so the deploy workflow sets
// NEXT_PUBLIC_BASE_PATH=/kad-kahwin. Locally it is empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Lets phones on the same Wi-Fi open the dev server (npm run dev) via the LAN IP.
  allowedDevOrigins: ["10.26.112.41", "192.168.*.*", "10.*.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
