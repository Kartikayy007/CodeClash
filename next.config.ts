import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  swcMinify: true,
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
