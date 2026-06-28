
// 'use client'

// import { useState } from 'react'
// import styles from './Header.module.scss'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import Logo from '../logo/Logo'
// import Button from '../button/Button'

// const links = [
//   { id: 1, titleUk: "Головна", titleEn: "Home", url: "/" },
//   { id: 2, titleUk: "Про нас", titleEn: "About", url: "/about" },
//   { id: 3, titleUk: "Послуги", titleEn: "Services", url: "/services" },
//   { id: 4, titleUk: "Контакти", titleEn: "Contacts", url: "/contacts" },
// ]

// const Header = () => {
//   const pathname = usePathname()
//   const locale = pathname.startsWith('/en') ? 'en' : 'uk'
//   const [open, setOpen] = useState(false)

//   const switchLocale = (newLocale: 'uk' | 'en') => {
//     const withoutLocale = pathname.replace(/^\/(uk|en)/, '')
//     return `/${newLocale}${withoutLocale || ''}`
//   }

//   return (
//     <header className={styles.header}>
//       <div className="container">
//         <div className={styles.wrapper}>
//           <Logo />

//           {/* Десктопне меню */}
//           <nav className={styles.menu}>
//             <ul className={styles.list}>
//               {links.map(link => (
//                 <li key={link.id}>
//                   <Link
//                     href={`/${locale}${link.url}`}
//                     className={`${styles.link} ${pathname === `/${locale}${link.url}` ? styles.active : ""}`}
//                   >
//                     {locale === 'uk' ? link.titleUk : link.titleEn}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* Перемикач мов */}
//           <div className={styles.langSwitch}>
//             <Link href={switchLocale('uk')} className={locale === 'uk' ? styles.activeLang : ''}>ua</Link> /{" "}
//             <Link href={switchLocale('en')} className={locale === 'en' ? styles.activeLang : ''}>en</Link>
//           </div>

//           {/* Кнопка тільки для десктопу */}
//           <Button href='#' className={styles.headerBtn}>Консультація</Button>

//           {/* Кнопка бургер */}
//           <button className={styles.burger} onClick={() => setOpen(true)}>☰</button>
//         </div>
//       </div>

//       {/* Мобільне меню */}
//       <div className={`${styles.sidebar} ${open ? styles.active : ""}`}>
//         <button className={styles.closeBtn} onClick={() => setOpen(false)}>×</button>
//         <ul>
//           {links.map(link => (
//             <li key={link.id}>
//               <Link href={`/${locale}${link.url}`} onClick={() => setOpen(false)}>
//                 {locale === 'uk' ? link.titleUk : link.titleEn}
//               </Link>
//             </li>
//           ))}

//         </ul>
//         <Button href='#' className={styles.sidebarBtn}>Консультація</Button>
//       </div>
//     </header>
//   )
// }

// export default Header

// import styles from './Header.module.scss'
// import Logo from '../logo/Logo'
// import Button from '../button/Button'
// import NavLink from '../navLinks/NavLink'
// import MobileMenu from '../mobileMenu/MobileMenu'
// import LangSwitch from '../langSwitch/LangSwitch' // Імпортуємо наш новий перемикач

// const links = [
//   { id: 1, titleUk: "Головна", titleEn: "Home", url: "/" },
//   { id: 2, titleUk: "Про нас", titleEn: "About", url: "/about" },
//   { id: 3, titleUk: "Послуги", titleEn: "Services", url: "/services" },
//   { id: 4, titleUk: "Контакти", titleEn: "Contacts", url: "/contacts" },
// ]

// interface HeaderProps {
//   params: { locale?: 'uk' | 'en' }
// }

// export default function Header({ params }: HeaderProps) {
//   // Надійно беремо локаль, яка прийшла від Layout
//   const locale = params.locale || 'uk'

//   return (
//     <header className={styles.header}>
//       <div className="container">
//         <div className={styles.wrapper}>
//           <Logo />

//           {/* Десктопне меню */}
//           <nav className={styles.menu}>
//             <ul className={styles.list}>
//               {links.map(link => {
//                 // Формуємо чистий шлях: для головної просто /[locale], для інших /[locale]/about
//                 const cleanUrl = link.url === "/" ? "" : link.url
//                 return (
//                   <li key={link.id}>
//                     <NavLink
//                       href={`/${locale}${cleanUrl}`}
//                       activeClass={styles.active}
//                       className={styles.link}
//                     >
//                       {locale === 'uk' ? link.titleUk : link.titleEn}
//                     </NavLink>
//                   </li>
//                 )
//               })}
//             </ul>
//           </nav>

//           {/* Інтелектуальний перемикач мов */}
//           <LangSwitch currentLocale={locale} />

//           <Button href={`/${locale}/contacts`} className={styles.headerBtn}>
//             {locale === 'uk' ? 'Консультація' : 'Consultation'}
//           </Button>

//           {/* Мобільне меню */}
//           <MobileMenu links={links} locale={locale} />
//         </div>
//       </div>
//     </header>
//   )
// }

import styles from './Header.module.scss'
import Logo from '../logo/Logo'
import Button from '../button/Button'
import NavLink from '../navLinks/NavLink'
import MobileMenu from '../mobileMenu/MobileMenu'
import LangSwitch from '../langSwitch/LangSwitch'

const links = [
  { id: 1, titleUk: "Головна", titleEn: "Home", targetId: "head" },
  { id: 2, titleUk: "Про нас", titleEn: "About", targetId: "about" },
  { id: 3, titleUk: "Послуги", titleEn: "Services", targetId: "services" },
  { id: 4, titleUk: "Контакти", titleEn: "Contacts", targetId: "contacts" },
]

interface HeaderProps {
  params: { locale?: 'uk' | 'en' }
}

export default function Header({ params }: HeaderProps) {
  const locale = params.locale || 'uk'

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <Logo />

          {/* Десктопне меню */}
          <nav className={styles.menu}>
            <ul className={styles.list}>
              {links.map(link => (
                <li key={link.id}>
                  <NavLink
                    targetId={link.targetId}
                    activeClass={styles.active}
                    className={styles.link}
                  >
                    {locale === 'uk' ? link.titleUk : link.titleEn}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <LangSwitch currentLocale={locale} />

          {/* Кнопка "Консультація" теж може плавно скролити до форми контактів */}
          <NavLink targetId="contacts" activeClass="" className={styles.headerBtn}>
            {locale === 'uk' ? 'Консультація' : 'Consultation'}
          </NavLink>

          <MobileMenu links={links} locale={locale} />
        </div>
      </div>
    </header>
  )
}