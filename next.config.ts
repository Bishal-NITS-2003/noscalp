import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Fix lucid-cardano symlink issues
    config.resolve.symlinks = false;

    // Don't bundle lucid-cardano on server - it's client-only
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "lucid-cardano": false,
        "@peculiar/webcrypto": false,
        ws: false,
      };
    }

    return config;
  },
};

export default nextConfig;
