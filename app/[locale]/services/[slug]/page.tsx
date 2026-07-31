import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { fetchStrapiBySlug, fetchContactData } from '@/lib/api';
import { generatePageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd, buildServiceJsonLd, SITE_NAV_NAMES } from '@/lib/jsonld';
import { BASE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/routes';
import type { Metadata } from 'next';
import ArticleNav, { type ArticleNavSection } from './ArticleNav';
import Contacts from '../../home/section/contacts/Contacts';
import JsonLd from '../../components/seo/JsonLd';
import Breadcrumbs from '../Breadcrumbs';
import styles from './page.module.scss';

interface ContentBlock {
  id: number;
  heading?: string;
  body?: string;
}

interface ServicePageData {
  h1?: string;
  metaTitle?: string;
  metaDescription?: string;
  mainContent?: ContentBlock[];
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getServicePage(locale: Locale, slug: string): Promise<ServicePageData | null> {
  return fetchStrapiBySlug('service-pages', slug, {
    locale,
    'populate[mainContent]': '*',
  });
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

  return generatePageMetadata({
    locale: currentLocale,
    path: `/services/${slug}`,
    title: data.metaTitle || data.h1 || slug,
    description: data.metaDescription || data.h1 || (data.mainContent?.[0]?.body ?? ''),
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
                {block.body && <p className={styles.blockBody}>{block.body}</p>}
              </section>
            ))}
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
