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

    // Fix lucid-cardano symlink issues
    config.resolve.symlinks = false;
    
    // Ignore problematic files during build
    if (isServer) {
      config.externals = [...(config.externals || []), 'lucid-cardano'];
    }

    return config;
  },
};

export default nextConfig;
