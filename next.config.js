const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
    ],
  },
  transpilePackages: ['slate-transcript-editor'],
  webpack: (config) => {
    // Resolve React dependencies for local development of slate-transcript-editor
    // This configuration is only necessary when working with a local version of the library
    // It prevents "Invalid hook call" errors by ensuring consistent React versions
    config.resolve.alias['react'] = path.resolve('./node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve('./node_modules/react-dom');
    return config;
  },
};

module.exports = nextConfig;
