import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async redirects() {
    return [
      {
        source: "/oauth",
        destination: "/oauth/callback",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/oauth/callback",
        destination: "/oauth/page",
      },
    ];
  },
};

export default nextConfig;
