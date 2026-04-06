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
  },
  allowedDevOrigins: ["hertha-colonnaded-ellison.ngrok-free.dev"],
};

export default nextConfig;
