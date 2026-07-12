'use client'

import { useState } from 'react'
import NavLink from '../navLinks/NavLink'
import styles from './MobileMenu.module.scss'

// Інтерфейс для лінків, які приходять зі Strapi
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
                <NavLink
                  targetId={link.targetId}
                  activeClass={styles.active}
                  className={styles.mobileLink}
                >
                  {link.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Кнопка "Консультація" */}
        <div onClick={handleMobileClick}>
          <NavLink targetId="contacts" activeClass="" className={styles.sidebarBtn}>
            {btnText}
          </NavLink>
        </div>
      </div>
    </>
  )
}