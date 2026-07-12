import styles from './Header.module.scss'
import Logo from '../logo/Logo'
import NavLink from '../navLinks/NavLink'
import MobileMenu from '../mobileMenu/MobileMenu'
import LangSwitch from '../langSwitch/LangSwitch'
import { fetchStrapi } from '@/lib/api' // Підключаємо нашу утиліту (шлях може відрізнятися залежно від твоєї структури)

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

  // Робимо запит в 1 рядок! Вказуємо endpoint 'header' і передаємо параметри
  const headerData = await fetchStrapi('header', {
    locale: locale,
    populate: '*'
  });

  // Безпечно дістаємо дані (якщо Strapi вимкнений, підставимо дефолтні значення)
  const links: LinkItem[] = headerData?.navLinks || [];
  const btnText = headerData?.buttonText || (locale === 'uk' ? 'Консультація' : 'Consultation');

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <Logo />

          <nav className={styles.menu}>
            <ul className={styles.list}>
              {links.map(link => (
                <li key={link.id}>
                  <NavLink
                    targetId={link.targetId}
                    activeClass={styles.active}
                    className={styles.link}
                  >
                    {link.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <LangSwitch currentLocale={locale} />

          <NavLink targetId="contacts" activeClass="" className={styles.headerBtn}>
            {btnText}
          </NavLink>

          <MobileMenu links={links} btnText={btnText} locale={locale} />
        </div>
      </div>
    </header>
  )
}