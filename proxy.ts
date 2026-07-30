import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // Список підтримуваних локалей
  locales: ['uk', 'en'],

  // Локаль за замовчуванням
  defaultLocale: 'uk',
});

export async function proxy(request: NextRequest) {
  // Nonce-based CSP (замість script-src 'unsafe-inline') — за офіційним
  // патерном Next.js 16 (node_modules/next/dist/docs/01-app/02-guides/
  // content-security-policy.md): унікальний nonce на кожен запит, прокидається
  // і в CSP-заголовок, і в кастомний x-nonce, який Server Components читають
  // через headers() і застосовують до власних inline-скриптів.
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: http://31.131.18.174:1331;
    font-src 'self' data:;
    connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com http://31.131.18.174:1331;
  `.replace(/\s{2,}/g, ' ').trim();

  // Мутуємо request.headers ДО виклику next-intl — next-intl всередині
  // конструює власний NextResponse (redirect/rewrite/next()) з ЦЬОГО ж
  // request-об'єкта за посиланням, тож x-nonce/CSP на request-заголовках
  // долітають до Next.js рендер-пайплайна незалежно від того, який саме
  // response next-intl зрештою поверне.
  request.headers.set('x-nonce', nonce);
  request.headers.set('Content-Security-Policy', cspHeader);

  const response = intlMiddleware(request);

  // Окремо виставляємо CSP і на response — це вже реальний HTTP-заголовок,
  // який браузер отримає і буде застосовувати як enforcing policy.
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  // Відповідність лише інтернаціоналізованим шляхам
  matcher: ['/', '/(uk|en)/:path*'],
};
