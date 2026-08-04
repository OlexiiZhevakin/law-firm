import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { fetchStrapiBySlug, fetchContactData, fetchServicePageSlugInLocale } from '@/lib/api';
import { generatePageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd, buildServiceJsonLd, SITE_NAV_NAMES } from '@/lib/jsonld';
import { BASE_URL } from '@/lib/constants';
import { LOCALES, type Locale } from '@/lib/routes';
import type { Metadata } from 'next';
import ArticleNav, { type ArticleNavSection } from './ArticleNav';
import Contacts from '../../home/section/contacts/Contacts';
import ServiceCtaButton from './ServiceCtaButton';
import JsonLd from '../../components/seo/JsonLd';
import Breadcrumbs from '../Breadcrumbs';
import styles from './page.module.scss';

interface StepItem {
  id: number;
  number?: string;
  title?: string;
  items?: string;
}

interface ContentBlock {
  id: number;
  heading?: string;
  body?: string;
  // "Етапи роботи"-стиль секцій (номер + заголовок + список дій на крок) —
  // текстовий body тут не підходить (потребує вкладеної структури: номер,
  // власний заголовок, власний список), тож для таких секцій body
  // ігнорується, а рендериться steps. Дет. в CLAUDE.md, "Service pages".
  steps?: StepItem[];
  // Опційне посилання в кінці блоку (напр. "Види установ" -> "Придбання
  // діючої фінансової установи") — єдиний спосіб дати реальний internal
  // link всередині service-page контенту без переходу всієї схеми на
  // rich text/blocks заради одного посилання.
  linkText?: string;
  linkHref?: string;
}

interface ServicePageData {
  documentId?: string;
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  mainContent?: ContentBlock[];
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Всі service-page записи в Strapi мають " | HARLIB" буквально в кінці
// metaTitle (авторський текст, скопійований з SEO-брифів разом із суфіксом
// бренду) — але app/[locale]/layout.tsx's title.template ("%s | HARLIB")
// вже додає той самий суфікс автоматично для БУДЬ-ЯКОГО вкладеного сегмента
// (services/[slug] лежить під [locale], не в ньому самому — на відміну від
// app/[locale]/page.tsx, де суфікс дійсно треба дописувати вручну, див.
// коментар там-таки). Без цього стрипу кожна сторінка послуги показувала
// "... | HARLIB | HARLIB" в <title> — підтверджено на живій /en/services/
// capital (не лише на цій, щойно оновленій сторінці), тобто це наскрізний,
// а не щойно внесений баг. Виправлено тут (єдине місце, що формує title для
// service-page), а не в Strapi-контенті — 19 записів редагувати не треба.
const HARLIB_SUFFIX_RE = /\s*\|\s*HARLIB\s*$/i;
function stripHarlibSuffix(title: string): string {
  return title.replace(HARLIB_SUFFIX_RE, '');
}

async function getServicePage(locale: Locale, slug: string): Promise<ServicePageData | null> {
  return fetchStrapiBySlug('service-pages', slug, {
    locale,
    'populate[mainContent][populate]': 'steps',
  });
}

// slug більше НЕ спільний між uk/en (переструктурування каталогу послуг) —
// щоб hreflang не вказував на неіснуючий /{otherLocale}/services/{той самий slug},
// дізнаємось РЕАЛЬНИЙ slug цього documentId в кожній іншій локалі. Відсутність
// локалізації (напр. crypto — лише в en) — очікуваний стан, не помилка:
// fetchServicePageSlugInLocale повертає null, і ця локаль просто випадає з
// hreflang (див. getAlternates/LocalizedPathOverrides у lib/metadata.ts).
async function getLocalizedPaths(documentId: string, currentLocale: Locale): Promise<Partial<Record<Locale, string | null>>> {
  const otherLocales = LOCALES.filter((l) => l !== currentLocale);
  const entries = await Promise.all(
    otherLocales.map(async (l) => {
      const slug = await fetchServicePageSlugInLocale(documentId, l);
      return [l, slug ? `/services/${slug}` : null] as const;
    })
  );
  return Object.fromEntries(entries);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale = locale as Locale;
  const data = await getServicePage(currentLocale, slug);

  if (!data) {
    return generatePageMetadata({
      locale: currentLocale,
      path: `/services/${slug}`,
      title: slug,
      description: '',
      noIndex: true,
    });
  }

  const localizedPaths = data.documentId
    ? await getLocalizedPaths(data.documentId, currentLocale)
    : undefined;

  return generatePageMetadata({
    locale: currentLocale,
    path: `/services/${slug}`,
    title: stripHarlibSuffix(data.metaTitle || data.h1 || slug),
    description: data.metaDescription || data.h1 || (data.mainContent?.[0]?.body ?? ''),
    localizedPaths,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const currentLocale = locale as Locale;
  const [data, contactData] = await Promise.all([
    getServicePage(currentLocale, slug),
    fetchContactData(currentLocale),
  ]);

  if (!data) {
    notFound();
  }

  const blocks = data.mainContent ?? [];
  // Перший блок без heading трактуємо як вступний абзац, решта — як H2-секції.
  const hasIntro = blocks.length > 0 && !blocks[0].heading;
  const introBlock = hasIntro ? blocks[0] : null;
  const contentBlocks = hasIntro ? blocks.slice(1) : blocks;

  const sections: ArticleNavSection[] = contentBlocks
    .filter((block): block is ContentBlock & { heading: string } => Boolean(block.heading))
    .map((block) => ({ id: `section-${block.id}`, heading: block.heading }));

  const serviceJsonLd = buildServiceJsonLd({
    locale: currentLocale,
    name: data.h1 || slug,
    description: data.metaDescription,
    url: `${BASE_URL}/${currentLocale}/services/${slug}`,
  });

  // Головна → Послуги → {назва цієї послуги} (3 рівні) — той самий
  // SITE_NAV_NAMES, що й на /services, плюс реальна назва сторінки
  // (data.h1, не slug), як і скрізь на цій сторінці (h1, JSON-LD Service).
  const breadcrumbLevels = [
    { name: SITE_NAV_NAMES[''][currentLocale], path: `/${currentLocale}` },
    { name: SITE_NAV_NAMES['/services'][currentLocale], path: `/${currentLocale}/services` },
    { name: data.h1 || slug, path: `/${currentLocale}/services/${slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(
    breadcrumbLevels.map((level) => ({ name: level.name, url: `${BASE_URL}${level.path}` })),
    currentLocale
  );

  const nonce = (await headers()).get('x-nonce') || undefined;

  return (
    <>
      <JsonLd data={[serviceJsonLd, breadcrumbJsonLd]} nonce={nonce} />
      <main className="container">
        <div className={styles.wrapper}>
          <article className={styles.main}>
            <Breadcrumbs items={breadcrumbLevels.map((level) => ({ name: level.name, href: level.path }))} />
            <h1 className={styles.h1}>{data.h1 || slug}</h1>

            {introBlock?.body && <p className={styles.intro}>{introBlock.body}</p>}

            {contentBlocks.map((block) => (
              <section
                key={block.id}
                id={block.heading ? `section-${block.id}` : undefined}
                className={styles.block}
              >
                {block.heading && <h2 className={styles.blockHeading}>{block.heading}</h2>}

                {block.steps && block.steps.length > 0 ? (
                  <ol className={styles.stepsList}>
                    {block.steps.map((step) => (
                      <li key={step.id} className={styles.stepItem}>
                        {step.number && <span className={styles.stepNumber}>{step.number}</span>}
                        {step.title && <h3 className={styles.stepTitle}>{step.title}</h3>}
                        {step.items && <p className={styles.stepBody}>{step.items}</p>}
                      </li>
                    ))}
                  </ol>
                ) : (
                  block.body && <p className={styles.blockBody}>{block.body}</p>
                )}

                {block.linkText && block.linkHref && (
                  <Link href={block.linkHref} className={styles.afterLink}>
                    {block.linkText} →
                  </Link>
                )}
              </section>
            ))}

            <ServiceCtaButton locale={currentLocale} data={contactData} />
          </article>

          <ArticleNav
            sections={sections}
            title={currentLocale === 'uk' ? 'На цій сторінці' : 'On this page'}
          />
        </div>
      </main>

      {contactData && <Contacts locale={currentLocale} data={contactData} />}
    </>
  );
}
