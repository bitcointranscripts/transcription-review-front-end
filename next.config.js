const withTM = require("next-transpile-modules")(["slate-transcript-editor"]);
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
  webpack: (config) => {
    // Ensure transpiling of the correct entry file
    config.resolve.alias['slate-transcript-editor'] = require.resolve('slate-transcript-editor/dist');
    config.resolve.alias = {
      ...config.resolve.alias,
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    };
    return config;
  },
};

module.exports = withTM(nextConfig);
