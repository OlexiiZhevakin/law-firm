import { BASE_URL, CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME } from './constants';
import { STATIC_ROUTES, type Locale } from './routes';

/** JSON-LD не має єдиної строгої TS-схеми в цьому проєкті — кожен білдер
 * повертає звичайний об'єкт, типізований лише як "серіалізовний у JSON". */
export type JsonLdObject = Record<string, unknown>;

/** Стабільний @id-якір повного LegalService-вузла (buildLegalServiceJsonLd) —
 * один і той самий рядок незалежно від локалі/сторінки, щоб інші вузли (Person.worksFor,
 * AboutPage.mainEntity) могли ПОСИЛАТИСЯ на нього через { "@id": ... } замість
 * дублювання власного мінімального LegalService-об'єкта. Без цього Google Rich
 * Results Test бачив три окремі сутності типу LegalService на /about — два з них
 * порожні заглушки (лише "name": "HARLIB"). */
export const LEGAL_SERVICE_ID = `${BASE_URL}/#legalservice`;

/**
 * Об'єднує кілька вже побудованих вузлів в один спільний JSON-LD документ
 * ({ "@context", "@graph": [...] }) замість плоского масиву окремих об'єктів,
 * кожен зі своїм власним "@context". @id-посилання між вузлами (напр.
 * Person.worksFor -> LegalService) резолвяться коректно лише тоді, коли всі
 * пов'язані вузли лежать в одному @graph одного документа — саме тому /about
 * використовує це, а не просто масив (`[buildX(), buildY()]`) напряму в <JsonLd>.
 * Кожен окремий build*JsonLd() лишається валідним і сам по собі (зі своїм
 * "@context") — на випадок, якщо колись знадобиться використати його одиночно.
 */
export function buildJsonLdGraph(nodes: JsonLdObject[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map((node) => {
      const nodeWithoutContext = { ...node };
      delete nodeWithoutContext['@context'];
      return nodeWithoutContext;
    }),
  };
}

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

/** Локалізовані назви для "головних" пунктів навігації (@see buildSiteNavigationJsonLd,
 * buildBreadcrumbJsonLd) — STATIC_ROUTES не має поля назви, тож мапінг
 * path -> назва тримається тут, поруч із рештою JSON-LD, а не вигаданий
 * окремий реєстр. Експортується, щоб /services і /services/[slug] могли
 * взяти ті самі "Головна"/"Послуги", а не дублювати рядки локально. */
export const SITE_NAV_NAMES: Record<string, { uk: string; en: string }> = {
  '': { uk: 'Головна', en: 'Home' },
  '/about': { uk: 'Про нас', en: 'About Us' },
  '/services': { uk: 'Послуги', en: 'Services' },
};

/** SiteNavigationElement — підказка Google для sitelinks при брендовому запиті
 * "harlib". Рендериться глобально в layout.tsx поруч з Organization (та сама
 * причина: навігація спільна для всього сайту, не по-сторінкова).
 *
 * Список береться з STATIC_ROUTES (lib/routes.ts), а не вигаданий заново —
 * але не всі STATIC_ROUTES потрапляють сюди: /privacy і /cookies-policy
 * (priority 0.3, "yearly") — юридичні сторінки в футері, а не пункти головної
 * навігації, тож не годяться для sitelinks-підказки. Поріг priority >= 0.7
 * природно відділяє "головні" розділи (''=1, /about=0.7, /services=0.8) від
 * другорядних, використовуючи вже наявне поле, а не нову довільну ознаку. */
export function buildSiteNavigationJsonLd(locale: Locale): JsonLdObject {
  const mainRoutes = STATIC_ROUTES.filter(
    (route) => route.priority >= 0.7 && SITE_NAV_NAMES[route.path]
  );

  const names = mainRoutes.map((route) => SITE_NAV_NAMES[route.path][locale]);
  const urls = mainRoutes.map((route) => `${BASE_URL}/${locale}${route.path}`);

  // "Контакти" не є окремим STATIC_ROUTE — немає самостійної сторінки /contacts,
  // це секція на головній (той самий якір #contacts, що вже в navLinks
  // Strapi-хедера). Додається окремо, а не вигадується неіснуючий роут.
  names.push(locale === 'uk' ? 'Контакти' : 'Contact');
  urls.push(`${BASE_URL}/${locale}#contacts`);

  return {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: names,
    url: urls,
  };
}

/** Повна сутність компанії (адреса, контакти, години роботи) — тільки на /about,
 * найрелевантнішій сторінці для цих даних. */
export function buildLegalServiceJsonLd(locale: Locale): JsonLdObject {
  const isUk = locale === 'uk';

  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': LEGAL_SERVICE_ID,
    name: isUk ? 'HARLIB Юридичний Бутик' : 'HARLIB Law Boutique',
    url: `${BASE_URL}/${locale}`,
    logo: `${BASE_URL}/icon.png`,
    // Реальний логотип із Header/Footer (public/logo-header.png) — не /og-image.jpg,
    // такого файлу немає в public/ (404), і саме тому Google Rich Results Test
    // не бачив валідного зображення для цієї сутності.
    image: `${BASE_URL}/logo-header.png`,
    description: isUk
      ? 'HARLIB — юридичний бутік для банків, страхових і небанківських фінансових установ, фінтех-компаній і крипто-сервісів — в Україні, ЄС, Великобританії та Азії.'
      : 'HARLIB is a legal boutique for banks, insurance and non-bank financial institutions, fintech companies and crypto-services — in Ukraine, the EU, the UK, and Asia.',
    telephone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: isUk ? 'вул. М. Грушевського, 3' : '3 Mykhaila Hrushevskoho St',
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
    // priceRange навмисно НЕ заповнюється: юридичні послуги HARLIB не мають
    // фіксованого/публічного цінового діапазону (кожен кейс — індивідуальна
    // оцінка), на відміну від ресторану чи магазину, де це поле й задумане.
    // Google позначає priceRange як необов'язкове — вигадане значення на
    // кшталт "$$$" було б недостовірними даними в structured data.
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
    // Посилання на вже повний LegalService-вузол (buildLegalServiceJsonLd),
    // а не дубльований мінімальний об'єкт — резолвиться, бо обидва вузли
    // потрапляють в один @graph через buildJsonLdGraph() на /about.
    worksFor: { '@id': LEGAL_SERVICE_ID },
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
    // Те саме посилання через @id, що й у buildPersonJsonLd — не дублюємо
    // мінімальний LegalService-об'єкт вдруге.
    mainEntity: { '@id': LEGAL_SERVICE_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** BreadcrumbList — на /services (2 рівні: Головна → Послуги) і
 * /services/[slug] (3 рівні: Головна → Послуги → назва послуги). Формат
 * ListItem.item (не .url) — саме так, як задокументовано в Google's власному
 * прикладі розмітки breadcrumb (developers.google.com/search/docs/appearance/
 * structured-data/breadcrumb), на відміну від buildItemListJsonLd вище, де
 * це загальний ItemList, а не спеціально розпізнаваний Google breadcrumb-тип.
 * `items` — уже повний, локалізований і абсолютний список (сторінка сама
 * будує його через SITE_NAV_NAMES + власні дані), `locale` йде в `inLanguage`. */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], locale: Locale): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: locale,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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
