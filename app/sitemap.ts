import { MetadataRoute } from 'next';
import { fetchStrapi } from '@/lib/api';
import { BASE_URL } from '@/lib/constants';
import { LOCALES, STATIC_ROUTES } from '@/lib/routes';

// service-page — це Strapi collection type (app/[locale]/services/[slug]), не запис
// у STATIC_ROUTES: шляхи для нього генеруються динамічно, по всіх slug'ах зі Strapi.
// slug не локалізований (спільний для uk/en), тож достатньо одного запиту.
async function getServicePageSlugs(): Promise<string[]> {
  const servicePages = await fetchStrapi('service-pages', {
    'fields[0]': 'slug',
    'pagination[pageSize]': '100',
  });

  return Array.isArray(servicePages) ? servicePages.map((page) => page.slug).filter(Boolean) : [];
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

  const servicePageSlugs = await getServicePageSlugs();

  const serviceEntries = servicePageSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/services/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...serviceEntries];
}
