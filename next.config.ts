import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lzxhpwzcqzqavavmrgsn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    qualities: [75, 80, 85, 90, 95, 100],
  },
  allowedDevOrigins: ["hertha-colonnaded-ellison.ngrok-free.dev"],
};

export default nextConfig;
