// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: '31.131.18.174', // Ваш IP
//         port: '1331',              // Ваш порт
//         pathname: '/uploads/**',   // Шлях, де Strapi зберігає файли
//       },
//     ],
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */

// Content-Security-Policy більше НЕ тут — вона тепер генерується per-request
// у proxy.ts (nonce-based, замінює script-src 'unsafe-inline'). Статичний
// заголовок у next.config.ts не міг би нести унікальний nonce на кожен запит.
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '31.131.18.174',
        port: '1331',
        pathname: '/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
};

export default nextConfig;