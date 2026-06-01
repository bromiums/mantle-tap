import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pino', 'thread-stream'],
  transpilePackages: ['@privy-io/react-auth'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/trustwallet/assets/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/gmx/:network/:path*',
        destination: 'https://:network-api.gmxinfra.io/:path*',
      },
    ];
  },
};

export default nextConfig;
