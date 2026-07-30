import Link from 'next/link';
import { headers } from 'next/headers';
import { fetchServicePages } from '@/lib/api';
import { generatePageMetadata } from '@/lib/metadata';
import { buildItemListJsonLd } from '@/lib/jsonld';
import { BASE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/routes';
import type { Metadata } from 'next';
import JsonLd from '../components/seo/JsonLd';
import styles from './page.module.scss';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  return generatePageMetadata({
    locale: currentLocale,
    path: '/services',
    title: currentLocale === 'uk' ? 'Послуги' : 'Services',
    description:
      currentLocale === 'uk'
        ? 'Реєстрація, ліцензування та регуляторний супровід фінансових установ — усі напрямки роботи HARLIB.'
        : 'Registration, licensing and regulatory support for financial institutions — every HARLIB service.',
  });
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale as Locale;
  const servicePages = await fetchServicePages(currentLocale);

  const itemListJsonLd = buildItemListJsonLd(
    servicePages.map((page) => ({
      name: page.h1,
      url: `${BASE_URL}/${currentLocale}/services/${page.slug}`,
      description: page.metaDescription,
    }))
  );
  const nonce = (await headers()).get('x-nonce') || undefined;

  return (
    <main className="container">
      {servicePages.length > 0 && <JsonLd data={itemListJsonLd} nonce={nonce} />}
      <div className={styles.wrapper}>
        <h1 className={styles.h1}>{currentLocale === 'uk' ? 'Послуги' : 'Services'}</h1>

        {servicePages.length === 0 ? (
          <p className={styles.empty}>
            {currentLocale === 'uk' ? 'Сторінки послуг ще не додані.' : 'No service pages yet.'}
          </p>
        ) : (
          <ul className={styles.list}>
            {servicePages.map((page) => (
              <li key={page.slug} className={styles.card}>
                <Link href={`/${currentLocale}/services/${page.slug}`} className={styles.cardLink}>
                  <h2 className={styles.cardTitle}>{page.h1}</h2>
                  {page.metaDescription && <p className={styles.cardDesc}>{page.metaDescription}</p>}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
