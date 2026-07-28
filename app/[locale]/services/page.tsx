import Link from 'next/link';
import { fetchServicePages } from '@/lib/api';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/lib/routes';
import type { Metadata } from 'next';
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

  return (
    <main className="container">
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
