'use client'

import { useState } from 'react'
import Button from '../button/Button'
import NavLink from '../navLinks/NavLink' // Імпортуємо наш плавний скрол
import styles from './MobileMenu.module.scss'

interface LinkItem {
  id: number
  titleUk: string
  titleEn: string
  targetId: string
}

interface MobileMenuProps {
  links: LinkItem[]
  locale: 'uk' | 'en'
}

export default function MobileMenu({ links, locale }: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  // Функція для плавного скролу з одночасним закриттям меню
  const handleMobileClick = () => {
    setOpen(false)
  }

  return (
    <>
      {/* Кнопка бургер */}
      <button
        className={styles.burger}
        onClick={() => setOpen(true)}
        aria-label="Відкрити меню"
        aria-expanded={open}
      >
        ☰
      </button>

      {/* Мобільне меню */}
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
                {/* 👇 Замість Link використовуємо наш NavLink */}
                <NavLink
                  targetId={link.targetId}
                  activeClass={styles.active}
                  className={styles.mobileLink}
                >
                  {locale === 'uk' ? link.titleUk : link.titleEn}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Кнопка "Консультація" в мобільці теж скролить до контактів */}
        <div onClick={handleMobileClick}>
          <NavLink targetId="contacts" activeClass="" className={styles.sidebarBtn}>
            {locale === 'uk' ? 'Консультація' : 'Consultation'}
          </NavLink>
        </div>
      </div>
    </>
  )
}