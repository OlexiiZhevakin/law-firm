import Link from 'next/link'
import Image from 'next/image'
import styles from './Header.module.scss'
import NavLink from '../navLinks/NavLink'
import MobileMenu from '../mobileMenu/MobileMenu'
import LangSwitch from '../langSwitch/LangSwitch'
import { fetchStrapi } from '@/lib/api'

export interface LinkItem {
  id: number;
  title: string;
  targetId: string;
}

interface HeaderProps {
  params: { locale?: 'uk' | 'en' }
}

export default async function Header({ params }: HeaderProps) {
  const locale = params.locale || 'uk'

  const headerData = await fetchStrapi('header', {
    locale: locale,
    populate: '*'
  });

  const links: LinkItem[] = headerData?.navLinks || [];
  const btnText = headerData?.buttonText || (locale === 'uk' ? 'Консультація' : 'Consultation');

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>

          <Link href={`/${locale}`} className={styles.logoLink} aria-label="HARLIB Home">
            <Image
              src="/logo.png"
              alt="HARLIB Financial Law Boutique"
              className={styles.logoImg}
              width={150} /* Вкажи реальну ширину твого логотипа в пікселях */
              height={40} /* Вкажи реальну висоту */
              priority    /* Каже браузеру завантажити цю картинку першою */
            />
          </Link>

          <nav className={styles.menu}>
            <ul className={styles.list}>
              {links.map(link => (
                <li key={link.id}>
                  <NavLink targetId={link.targetId} activeClass={styles.active} className={styles.link}>
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Обгортка для десктопного перемикача мов */}
          <div className={styles.desktopLang}>
            <LangSwitch currentLocale={locale as 'uk' | 'en'} />
          </div>

          <NavLink targetId="contacts" activeClass="" className={styles.headerBtn}>
            {btnText}
          </NavLink>

          <MobileMenu links={links} btnText={btnText} locale={locale} />
        </div>
      </div>
    </header>
  )
}