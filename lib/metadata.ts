import type { Metadata } from 'next';
import { BASE_URL, SITE_NAME } from './constants';
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
 * За замовчуванням той самий шлях однаковий для всіх локалей (правда для
 * переважної більшості сторінок сайту). `localizedPaths` — точковий виняток
 * для сторінок, де шлях (slug) РІЗНИЦЯ між локалями (напр. service-page після
 * переструктурування каталогу послуг: /uk/services/kapitalizaciya має пару
 * /en/services/capital, не /en/services/kapitalizaciya) — передайте мапу з
 * реальним шляхом на кожну локаль. Значення `null` означає "цієї локалі
 * свідомо не існує" (напр. crypto-сторінка існує лише в en) — така локаль
 * пропускається в languages, hreflang на неіснуючу сторінку не генерується.
 */
type LocalizedPathOverrides = Partial<Record<Locale, string | null>>;

/**
 * canonical (самопосилання на поточну локаль) + hreflang на всі локалі,
 * для конкретного шляху (без префіксу локалі).
 */
export function getAlternates(
  locale: Locale,
  path: string,
  localizedPaths?: LocalizedPathOverrides
): Metadata['alternates'] {
  const normalizedPath = normalizePath(path);

  const pathForLocale = (l: Locale): string | null => {
    if (!localizedPaths || !(l in localizedPaths)) return normalizedPath;
    const override = localizedPaths[l];
    return override === null ? null : normalizePath(override as string);
  };

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const p = pathForLocale(l);
    if (p === null) continue;
    languages[LOCALE_HREFLANG[l]] = `/${l}${p}`;
  }

  // x-default вказує на дефолтну локаль сайту (uk) — якщо ЦІЄЇ конкретної
  // сторінки в дефолтній локалі не існує (crypto), x-default коректно
  // вказувати на саму поточну сторінку (єдину, що реально існує), а не на
  // неіснуючий /uk/... шлях.
  const defaultPath = pathForLocale(DEFAULT_LOCALE);
  languages['x-default'] =
    defaultPath !== null ? `/${DEFAULT_LOCALE}${defaultPath}` : `/${locale}${normalizedPath}`;

  return {
    canonical: `/${locale}${normalizedPath}`,
    languages,
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
  /** Див. getAlternates — точковий виняток для сторінок з різним шляхом per-locale. */
  localizedPaths?: LocalizedPathOverrides;
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
  localizedPaths,
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
    // Однакові для кожної сторінки — тримаємо тут (в одному місці), а не
    // дублюємо в кожному generateMetadata() чи в layout.tsx.
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    alternates: getAlternates(locale, path, localizedPaths),
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
