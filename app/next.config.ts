import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Proxy /proxy/api/* to the backend so browser never hits HTTP directly
  async rewrites() {
    const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://178.104.133.115";
    return [
      {
        source: "/proxy/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
