import { MetadataRoute } from 'next';
import { fetchServicePages } from '@/lib/api';
import { BASE_URL } from '@/lib/constants';
import { LOCALES, STATIC_ROUTES } from '@/lib/routes';

// service-page — це Strapi collection type (app/[locale]/services/[slug]), не запис
// у STATIC_ROUTES: шляхи для нього генеруються динамічно, по всіх slug'ах зі Strapi.
// КОЛИСЬ slug був спільним для uk/en, тож один запит без locale вистачало — це
// перестало бути правдою після переструктурування каталогу послуг (різні slug'и
// на кожну локаль, плюс crypto — сторінка лише в en, без uk-пари). Тепер явно
// запитуємо slug'и ОКРЕМО для кожної локалі (fetchServicePages, той самий виклик,
// що й на /services), а не один спільний список, помножений на LOCALES —
// інакше на /en потрапляли б uk-only slug'и (404) і бракувало б en-only crypto.
async function getServicePageSlugsByLocale(): Promise<Record<string, string[]>> {
  const entries = await Promise.all(
    LOCALES.map(async (locale) => {
      const pages = await fetchServicePages(locale);
      return [locale, pages.map((page) => page.slug).filter(Boolean)] as const;
    })
  );

  return Object.fromEntries(entries);
}

// Автоматично будує sitemap.xml зі статичного реєстру сторінок у lib/routes.ts
// плюс динамічних service-page зі Strapi. Додав нову статичну сторінку в
// STATIC_ROUTES -> вона одразу з'явиться тут для кожної локалі; додав новий
// service-page в Strapi -> він так само з'явиться тут без правок цього файлу.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries = STATIC_ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );

  const slugsByLocale = await getServicePageSlugsByLocale();

  const serviceEntries = LOCALES.flatMap((locale) =>
    (slugsByLocale[locale] ?? []).map((slug) => ({
      url: `${BASE_URL}/${locale}/services/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...serviceEntries];
}
