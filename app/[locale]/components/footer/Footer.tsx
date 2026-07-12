import Link from "next/link"
import styles from './Footer.module.scss'
import { fetchStrapi } from '@/lib/api'

export interface LinkItem {
  id: number
  label: string
  url: string
}

interface FooterProps {
  params: { locale?: 'uk' | 'en' }
}

export default async function Footer({ params }: FooterProps) {
  const locale = params.locale || 'uk'

  // Робимо запит до Strapi. 
  // Вказуємо конкретні поля для populate, оскільки ти використовуєш URLSearchParams у fetchStrapi
  const footerData = await fetchStrapi('footer', {
    locale: locale,
    'populate[navLinks]': '*',
    'populate[legalLinks]': '*'
  });

  // Дістаємо дані з дефолтними значеннями на випадок порожнього Strapi
  const logoTitle = footerData?.logoTitle || 'HARLIB';
  const logoSubtitle = footerData?.logoSubtitle || 'FINANCIAL LAW BOUTIQUE';
  const brandDescription = footerData?.brandDescription || '';

  const navTitle = footerData?.navTitle || (locale === 'uk' ? 'САЙТ' : 'NAVIGATION');
  const navLinks: LinkItem[] = footerData?.navLinks || [];

  const legalTitle = footerData?.legalTitle || (locale === 'uk' ? 'ЮРИДИЧНА ІНФОРМАЦІЯ' : 'LEGAL INFO');
  const legalLinks: LinkItem[] = footerData?.legalLinks || [];

  const copyrightText = footerData?.copyrightText || '© 2026 HARLIB. HARLIB надає юридичні консультації...';

  return (
    <footer className={styles.footer}>
      <div className="container">

        {/* Верхня частина з трьома колонками */}
        <div className={styles.wrapper}>

          {/* 1. Колонка: Лого + опис */}
          <div className={styles.brandColumn}>
            <div className={styles.logoBlock}>
              <Link href={`/${locale}`} className={styles.logoLink}>
                <svg
                  viewBox="0 0 100 100"
                  width={32}
                  height={32}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="square"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.svgIcon}
                >
                  <line x1="25" y1="35" x2="25" y2="80" />
                  <line x1="50" y1="20" x2="50" y2="80" />
                  <line x1="75" y1="20" x2="75" y2="65" />
                  <line x1="25" y1="57.5" x2="50" y2="57.5" />
                  <line x1="50" y1="42.5" x2="75" y2="42.5" />
                  <rect x="44" y="51.5" width="12" height="12" fill="currentColor" stroke="none" />
                  <rect x="44" y="36.5" width="12" height="12" fill="currentColor" stroke="none" />
                  <rect x="19" y="51.5" width="12" height="12" fill="currentColor" stroke="none" />
                  <rect x="69" y="36.5" width="12" height="12" fill="currentColor" stroke="none" />
                </svg>
                <div className={styles.logoTextWrapper}>
                  <span className={styles.logoTitle}>{logoTitle}</span>
                  <span className={styles.logoSubtitle}>{logoSubtitle}</span>
                </div>
              </Link>
            </div>

            <p className={styles.brandText}>
              {brandDescription.split('\n').map((line: string, i: number) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          </div>

          {/* 2. Колонка: Навігація */}
          <div className={styles.column}>
            <h3 className={styles.title}>{navTitle}</h3>
            <ul className={styles.list}>
              {navLinks.map((link) => (
                <li key={link.id}>
                  {/* Захист: якщо url немає, ставимо '#' */}
                  <Link href={link.url?.startsWith('#') ? `/${locale}${link.url}` : (link.url || '#')}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Колонка: Юридична інформація */}
          <div className={styles.column}>
            <h3 className={styles.title}>{legalTitle}</h3>
            <ul className={styles.list}>
              {legalLinks.map((link) => (
                <li key={link.id}>
                  {/* Захист: якщо url немає, ставимо '#' */}
                  <Link href={link.url?.startsWith('#') ? `/${locale}${link.url}` : (link.url || '#')}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Нижня частина з лінією та копірайтом */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>{copyrightText}</p>
        </div>

      </div>
    </footer>
  )
}