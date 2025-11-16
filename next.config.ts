import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Fix lucid-cardano symlink issues in Vercel
    config.resolve.symlinks = false;

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["lucid-cardano"],
  },
};

export default nextConfig;
