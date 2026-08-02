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
  // 301-редиректи для видалених/перейменованих сторінок послуг (переструктурування
  // каталогу 2026-08). Без них уже проіндексовані/збережені в закладках старі URL
  // давали б 404 замість перенаправлення на актуальний контент.
  async redirects() {
    return [
      // uk: сторінку про страхові ліцензії видалено, зміст перенесено в licensing
      {
        source: '/uk/services/licenziya-strahovoi',
        destination: '/uk/services/licensing',
        permanent: true,
      },
      // uk: сторінку про віртуальні активи видалено повністю (en-версія лишається
      // окремою crypto-сторінкою, але uk-пари в неї більше немає) — ведемо в каталог.
      {
        source: '/uk/services/virtualni-aktyvy',
        destination: '/uk/services',
        permanent: true,
      },
      // en: та сама логіка, що й для uk — insurance-сторінки в en теж більше немає.
      {
        source: '/en/services/licenziya-strahovoi',
        destination: '/en/services',
        permanent: true,
      },
      // en: virtualni-aktyvy перейменовано (не видалено) на crypto.
      {
        source: '/en/services/virtualni-aktyvy',
        destination: '/en/services/crypto',
        permanent: true,
      },
      // en: решта перейменованих slug'ів (контент і documentId ті самі, змінився
      // лише slug — див. lib/api.ts fetchServicePageSlugInLocale/LangSwitch.tsx).
      {
        source: '/en/services/istotna-uchast',
        destination: '/en/services/qualifying-holding',
        permanent: true,
      },
      {
        source: '/en/services/kapitalizaciya',
        destination: '/en/services/capital',
        permanent: true,
      },
      {
        source: '/en/services/korporatyvne-upravlinnya',
        destination: '/en/services/governance',
        permanent: true,
      },
      {
        source: '/en/services/kerivnyky',
        destination: '/en/services/senior-management',
        permanent: true,
      },
      {
        source: '/en/services/rekrutyng-komplaens',
        destination: '/en/services/compliance-hiring',
        permanent: true,
      },
      {
        source: '/en/services/komplaens-produktu',
        destination: '/en/services/product-review',
        permanent: true,
      },
      {
        source: '/en/services/abonentske-obslugovuvannya',
        destination: '/en/services/ongoing-counsel',
        permanent: true,
      },
    ]
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