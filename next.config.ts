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
  experimental: {
    // Замінює всі згенеровані Next.js <link rel="stylesheet"> на inline
    // <style> у продакшн-білді — прибирає саме той HTML→CSS-запит-ланцюжок,
    // який Lighthouse позначав як "запити, що блокують відображення" (~820мс
    // на мобільному). Безпечно тут: (1) CSS цього сайту невеликий (~11KB
    // gzip сумарно на сторінку — це не Bootstrap/MUI-масштаб, де inline
    // шкодив би TTFB), (2) style-src уже має 'unsafe-inline' у CSP
    // (proxy.ts) — inline-стилі без nonce не блокуються, (3) кожна сторінка
    // тут і так повністю динамічна (ƒ, через headers() для nonce), тож
    // "styles use <link> для prerendered сторінок" (задокументоване
    // обмеження цієї фічі) сюди не застосовується — нема кешованих
    // prerendered варіантів, які плутались би з inline-версією.
    // Не працює в `next dev` (лише production build) — це очікувано.
    inlineCss: true,
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