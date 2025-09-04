/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      turbo: false, // disable Turbopack
    },
    webpack: (config) => {
      return config; // keep using Webpack
    },
  };
  
  module.exports = nextConfig;

  