import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"], qualities: [40, 75, 85, 90] },
  allowedDevOrigins: ["192.168.70.132"],
};

export default nextConfig;
