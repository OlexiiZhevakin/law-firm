/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '31.131.18.174', // Ваш IP
        port: '1331',              // Ваш порт
        pathname: '/uploads/**',   // Шлях, де Strapi зберігає файли
      },
    ],
  },
};

module.exports = nextConfig;