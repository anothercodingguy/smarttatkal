import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Only use rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
      ];
    }
    return [];
  },
  // For production, we'll need to deploy the backend separately
  // and update the frontend to use the production backend URL
};

export default nextConfig;
