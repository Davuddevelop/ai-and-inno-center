import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only serves quality=75 unless explicitly allow-listed here.
    qualities: [75, 90],
  },
};

export default nextConfig;
