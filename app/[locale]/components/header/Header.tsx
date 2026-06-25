  'use client'

  import styles from './Header.module.scss'
  import Link from 'next/link'
  import { usePathname } from 'next/navigation'
  import Logo from '../logo/Logo'
  import Button from '../button/Button'
  import DarkMode from '../darkModel/DarkMode'

  const links = [
    { id: 1, titleUk: "Головна", titleEn: "Home", url: "/" },
    { id: 2, titleUk: "Про нас", titleEn: "About", url: "/about" },
    { id: 3, titleUk: "Послуги", titleEn: "Services", url: "/services" },
    { id: 4, titleUk: "Контакти", titleEn: "Contacts", url: "/contacts" },
  ]

  const Header = () => {
    const pathname = usePathname();
    const locale = pathname.startsWith('/en') ? 'en' : 'uk';

    // Функція для перемикання локалі
    const switchLocale = (newLocale: 'uk' | 'en') => {
      // видаляємо поточну локаль із URL і додаємо нову
      const withoutLocale = pathname.replace(/^\/(uk|en)/, '');
      return `/${newLocale}${withoutLocale || ''}`;
    };

    return (
      <header className={styles.header}>
        <div className="container">
          <div className={styles.wrapper}>

            <Logo/>

            <nav className={styles.menu}>
              
              <ul className={styles.list}>
                {links.map(link => (
                  <li key={link.id}>
                    <Link
                      href={`/${locale}${link.url}`}
                      className={`${styles.link} ${pathname === `/${locale}${link.url}` ? styles.active : ""}`}
                    >
                      {locale === 'uk' ? link.titleUk : link.titleEn}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Перемикач мов */}
              
            </nav>
            {/* <DarkMode /> */}
            <div className={styles.langSwitch}>
              <Link href={switchLocale('uk')} className={locale === 'uk' ? styles.activeLang : ''}>ua</Link> /{" "}
              <Link href={switchLocale('en')} className={locale === 'en' ? styles.activeLang : ''}>en</Link>
              
            </div>
            <Button href='#' className={styles.headerBtn}>Консультація</Button>
          </div>
        </div>
      </header>
    )
  }

  export default Header;