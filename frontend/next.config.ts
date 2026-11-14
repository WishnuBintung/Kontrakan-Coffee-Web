import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  allowedDevOrigins: [
    "192.168.68.230",
    "192.168.68.*",
    "192.168.1.8",
    "192.168.1.*",
  ],
  ...(process.env.NODE_ENV === "development"
    ? {
        async rewrites() {
          return [
            { source: "/admin", destination: "/admin/index.html" },
            { source: "/admin/", destination: "/admin/index.html" },
          ];
        },
      }
    : {}),
};

export default nextConfig;
