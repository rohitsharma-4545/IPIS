import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/IPIS/ConfData",
        destination: "/api/IPIS/ConfData",
      },
    ];
  },
};

export default nextConfig;
