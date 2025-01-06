import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/oauth',
        destination: '/oauth/callback',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/oauth/callback',
        destination: '/oauth/page',
      },
    ];
  },
};

export default nextConfig;
