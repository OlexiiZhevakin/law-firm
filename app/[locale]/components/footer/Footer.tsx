import Image from 'next/image'
import Link from "next/link"
import styles from './Footer.module.scss'
import { fetchStrapi } from '@/lib/api'
import CookieSettingsLink from '../cookies/CookieSettingsLink'

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

  // Робимо запит до Strapi
  const footerData = await fetchStrapi('footer', {
    locale: locale,
    'populate[navLinks]': '*',
    'populate[legalLinks]': '*'
  });

  const brandDescription = footerData?.brandDescription || '';

  const navTitle = footerData?.navTitle || (locale === 'uk' ? 'САЙТ' : 'NAVIGATION');
  const navLinks: LinkItem[] = footerData?.navLinks || [];

  const legalTitle = footerData?.legalTitle || (locale === 'uk' ? 'ЮРИДИЧНА ІНФОРМАЦІЯ' : 'LEGAL INFO');
  const legalLinks: LinkItem[] = footerData?.legalLinks || [];

  const copyrightText = footerData?.copyrightText || '© 2026 HARLIB. HARLIB надає юридичні консультації...';

  // Універсальна функція для правильного формування посилань
  const getLocalizedUrl = (url?: string) => {
    if (!url) return '#';
    // Якщо це зовнішнє посилання, пошта або телефон — нічого не змінюємо
    if (url.startsWith('http') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return url;
    }
    // Якщо це якір (наприклад, #contacts)
    if (url.startsWith('#')) {
      return `/${locale}${url}`;
    }
    // Якщо це внутрішня сторінка з правильним слешем (наприклад, /privacy-policy)
    if (url.startsWith('/')) {
      return `/${locale}${url}`;
    }
    // Якщо забули написати слеш у Strapi (наприклад, privacy-policy)
    return `/${locale}/${url}`;
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.wrapper}>

          {/* 1. Колонка: Лого + опис */}
          <div className={styles.brandColumn}>
            <div className={styles.logoBlock}>
              <Link href={`/${locale}`} className={styles.logoLink} aria-label="HARLIB Home">
                <Image
                  src="/logo-footer.png"
                  alt="HARLIB Financial Law Boutique"
                  className={styles.logoImg}
                  width={150}
                  height={40}
                />
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
                  <Link href={getLocalizedUrl(link.url)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Колонка: Юридична інформація (Тільки для англійської) */}
          {locale === 'en' && (
            <div className={styles.column}>
              <h3 className={styles.title}>{legalTitle}</h3>
              <ul className={styles.list}>
                {legalLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={getLocalizedUrl(link.url)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Нижня частина з лінією та копірайтом */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>{copyrightText}</p>
          <CookieSettingsLink locale={locale as 'uk' | 'en'} />
        </div>

      </div>
    </footer>
  )
}