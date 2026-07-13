'use client'

import { useState } from 'react'
import NavLink from '../navLinks/NavLink'
import LangSwitch from '../langSwitch/LangSwitch' // <--- Додаємо імпорт
import styles from './MobileMenu.module.scss'

export interface LinkItem {
  id: number
  title: string
  targetId: string
}

interface MobileMenuProps {
  links: LinkItem[]
  btnText: string
  locale: string
}

export default function MobileMenu({ links, btnText, locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  const handleMobileClick = () => {
    setOpen(false)
  }

  return (
    <>
      <button
        className={styles.burger}
        onClick={() => setOpen(true)}
        aria-label="Відкрити меню"
        aria-expanded={open}
      >
        ☰
      </button>

      <div className={`${styles.sidebar} ${open ? styles.active : ""}`} aria-hidden={!open}>
        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
          aria-label="Закрити меню"
        >
          &times;
        </button>

        <nav className={styles.mobileNav}>
          <ul>
            {links.map(link => (
              <li key={link.id} onClick={handleMobileClick}>
                <NavLink targetId={link.targetId} activeClass={styles.active} className={styles.mobileLink}>
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Додаємо перемикач мов у мобільне меню */}
        <div className={styles.mobileLang}>
          <LangSwitch currentLocale={locale as 'uk' | 'en'} />
        </div>

        <div onClick={handleMobileClick}>
          <NavLink targetId="contacts" activeClass="" className={styles.sidebarBtn}>
            {btnText}
          </NavLink>
        </div>
      </div>
    </>
  )
}