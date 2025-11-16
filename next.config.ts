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

    // Externalize lucid-cardano for server-side
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("lucid-cardano");
    }

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["lucid-cardano"],
  },
  transpilePackages: ["lucid-cardano"],
};

export default nextConfig;
