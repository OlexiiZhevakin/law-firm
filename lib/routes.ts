export const LOCALES = ['uk', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'uk';

// hreflang коди для alternates.languages (uk -> uk-UA, як у попередній ручній реалізації)
export const LOCALE_HREFLANG: Record<Locale, string> = {
  uk: 'uk-UA',
  en: 'en',
};

export type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never';

export interface StaticRoute {
  /** Шлях сторінки без локалі, без кінцевого слеша. '' — головна сторінка. */
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

/**
 * Реєстр усіх статичних сторінок сайту (крім тих, що Strapi генерує динамічно).
 * app/sitemap.ts автоматично проходить по LOCALES x STATIC_ROUTES —
 * тому нову сторінку достатньо додати сюди один раз, і вона з'явиться
 * в sitemap.xml для всіх локалей одразу.
 */
export const STATIC_ROUTES: StaticRoute[] = [
  { path: '', changeFrequency: 'monthly', priority: 1 },
  { path: '/services', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
];
