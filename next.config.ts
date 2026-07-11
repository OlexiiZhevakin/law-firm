import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/uk",
        permanent: true, // Вказує, що це постійний редирект (301), що найкраще для SEO
      },
    ];
  },
};

export default nextConfig;