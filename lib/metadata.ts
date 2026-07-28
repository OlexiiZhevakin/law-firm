import type { Metadata } from 'next';
import { SITE_NAME } from './constants';
import { DEFAULT_LOCALE, LOCALES, LOCALE_HREFLANG, type Locale } from './routes';

/** Текст, окремий для кожної локалі. Рядок теж дозволений, якщо текст однаковий для всіх мов. */
export type LocalizedText = string | Record<Locale, string>;
export type LocalizedList = string[] | Record<Locale, string[]>;

function resolveText(value: LocalizedText, locale: Locale): string {
  return typeof value === 'string' ? value : value[locale];
}

function resolveList(value: LocalizedList, locale: Locale): string[] {
  return Array.isArray(value) ? value : value[locale];
}

function normalizePath(path: string): string {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * canonical (самопосилання на поточну локаль) + hreflang на всі локалі,
 * для конкретного шляху (без префіксу локалі).
 */
export function getAlternates(locale: Locale, path: string): Metadata['alternates'] {
  const normalizedPath = normalizePath(path);

  return {
    canonical: `/${locale}${normalizedPath}`,
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [LOCALE_HREFLANG[l], `/${l}${normalizedPath}`])
      ),
      'x-default': `/${DEFAULT_LOCALE}${normalizedPath}`,
    },
  };
}

interface PageMetadataInput {
  locale: Locale;
  /** Шлях сторінки без локалі, напр. '' для головної, '/privacy' для політики приватності. */
  path: string;
  title: LocalizedText;
  description: LocalizedText;
  keywords?: LocalizedList;
  /** Абсолютний або кореневий шлях до OG-картинки. За замовчуванням /og-image.jpg. */
  image?: string;
  /** Позначити сторінку як таку, що не повинна індексуватись (напр. дублікати, чернетки). */
  noIndex?: boolean;
}

/**
 * Універсальний генератор Metadata для сторінки. Кожна сторінка викликає це
 * зі своїм унікальним title/description/keywords — не копіює один і той самий
 * generateMetadata між сторінками (інакше вони конкуруватимуть в пошуку).
 * Title заголовка сторінки автоматично отримує суфікс " | HARLIB" через
 * title.template, визначений у app/[locale]/layout.tsx.
 */
export function generatePageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  image,
  noIndex,
}: PageMetadataInput): Metadata {
  const resolvedTitle = resolveText(title, locale);
  const resolvedDescription = resolveText(description, locale);
  const resolvedKeywords = keywords ? resolveList(keywords, locale) : undefined;
  const normalizedPath = normalizePath(path);
  const url = `/${locale}${normalizedPath}`;
  const ogImage = image ?? '/og-image.jpg';

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    alternates: getAlternates(locale, path),
    openGraph: {
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      url,
      siteName: SITE_NAME,
      title: resolvedTitle,
      description: resolvedDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
  };
}
