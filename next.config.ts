import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // necessário se usa <Image />
  },
};

export default nextConfig;
