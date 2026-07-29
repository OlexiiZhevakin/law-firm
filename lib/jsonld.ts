import { BASE_URL, CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME } from './constants';
import type { Locale } from './routes';

/** JSON-LD не має єдиної строгої TS-схеми в цьому проєкті — кожен білдер
 * повертає звичайний об'єкт, типізований лише як "серіалізовний у JSON". */
export type JsonLdObject = Record<string, unknown>;

/** Мінімальна сутність організації — рендериться глобально в layout.tsx
 * на кожній сторінці сайту. Детальні дані (адреса, телефон, керівник)
 * навмисно тут відсутні — вони на /about (buildLegalServiceJsonLd/buildPersonJsonLd). */
export function buildOrganizationJsonLd(locale: Locale): JsonLdObject {
  const isUk = locale === 'uk';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: isUk ? 'HARLIB Юридичний Бутик' : 'HARLIB Law Boutique',
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/icon.png`,
  };
}

/** Повна сутність компанії (адреса, контакти, години роботи) — тільки на /about,
 * найрелевантнішій сторінці для цих даних. */
export function buildLegalServiceJsonLd(locale: Locale): JsonLdObject {
  const isUk = locale === 'uk';

  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: isUk ? 'HARLIB Юридичний Бутик' : 'HARLIB Law Boutique',
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/icon.png`,
    image: `${BASE_URL}/og-image.jpg`,
    description: isUk
      ? 'HARLIB — юридичний бутік для банків, страхових і небанківських фінансових установ, фінтех-компаній і крипто-сервісів — в Україні, ЄС, Великобританії та Азії.'
      : 'HARLIB is a legal boutique for banks, insurance and non-bank financial institutions, fintech companies and crypto-services — in Ukraine, the EU, the UK, and Asia.',
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: isUk ? 'вулиця Михайла Грушевського, 3' : '3 Mykhaila Hrushevskoho St',
      addressLocality: isUk ? 'Київ' : 'Kyiv',
      addressRegion: isUk ? 'Київська область' : 'Kyiv region',
      postalCode: '01001',
      addressCountry: 'UA',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00',
    },
  };
}

interface PersonJsonLdInput {
  locale: Locale;
  name: string;
  jobTitle: string;
  imageUrl: string;
  /** Реальне посилання (напр. LinkedIn). Якщо немає — не передавай поле:
   * краще відсутній sameAs, ніж фейкове значення в structured data. */
  sameAs?: string[];
}

export function buildPersonJsonLd({ locale, name, jobTitle, imageUrl, sameAs }: PersonJsonLdInput): JsonLdObject {
  const jsonLd: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url: `${BASE_URL}/${locale}/about`,
    image: imageUrl,
    worksFor: {
      '@type': 'LegalService',
      name: SITE_NAME,
    },
  };

  if (sameAs && sameAs.length > 0) {
    jsonLd.sameAs = sameAs;
  }

  return jsonLd;
}

/** AboutPage — WebPage-підтип, що прямо сигналізує пошуковику: ця сторінка
 * описує організацію (mainEntity), а не є довільним контентом. */
export function buildAboutPageJsonLd(locale: Locale): JsonLdObject {
  const isUk = locale === 'uk';

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isUk ? 'Про HARLIB' : 'About HARLIB',
    url: `${BASE_URL}/${locale}/about`,
    mainEntity: {
      '@type': 'LegalService',
      name: SITE_NAME,
    },
  };
}

export interface ItemListEntry {
  name: string;
  url: string;
  description?: string;
}

/** ItemList на /services — допомагає Google зрозуміти структуру каталогу послуг. */
export function buildItemListJsonLd(items: ItemListEntry[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

interface ServiceJsonLdInput {
  locale: Locale;
  name: string;
  description?: string;
  url: string;
}

/** Service — на кожну сторінку /services/[slug]. */
export function buildServiceJsonLd({ locale, name, description, url }: ServiceJsonLdInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    ...(description ? { description } : {}),
    url,
    provider: {
      '@type': 'LegalService',
      name: SITE_NAME,
      url: `${BASE_URL}/${locale}`,
    },
  };
}

interface WebPageJsonLdInput {
  name: string;
  description?: string;
  url: string;
}

/** WebPage — для юридичних сторінок (/privacy, /cookies-policy), які теж
 * мають індексуватись і бути видимі Google як частина сайту. */
export function buildWebPageJsonLd({ name, description, url }: WebPageJsonLdInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    ...(description ? { description } : {}),
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}
