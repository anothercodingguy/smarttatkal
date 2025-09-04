/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config; // keep using Webpack
  },
};

module.exports = nextConfig;
