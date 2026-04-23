import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  return createMiddleware({
    // Список підтримуваних локалей
    locales: ['uk', 'en'],

    // Локаль за замовчуванням
    defaultLocale: 'uk',
  })(request);
}

export const config = {
  // Відповідність лише інтернаціоналізованим шляхам
  matcher: ['/', '/(uk|en)/:path*'],
};
