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

// Модульна змінна (НЕ React-стан) — навмисно, щоб пережити ремаунт нижче.
// Клік по UA/EN веде на /${targetLocale}/поточна-сторінка — це справжня
// Next.js навігація між різними значеннями сегмента [locale], а він тут
// найзовнішній динамічний сегмент усього застосунку (Header монтується
// у app/[locale]/layout.tsx, і жодного layout над ним немає). Перевірено
// емпірично (мітка на DOM-вузлі .sidebar зникає після такого переходу),
// що Next.js у цьому випадку не зберігає React-стан цього піддерева —
// сам вузол .sidebar пересворюється заново, тож useState `open` скидається
// до початкового false, і меню виглядає так, ніби само закрилось, хоча
// жоден onClick цього явно не робить. Звичайна змінна модуля переживає
// таке пересворення компонента (це не React-стан, а просто виконання
// JS-модуля, яке не переривається клієнтською навігацією), але коректно
// скидається при СПРАВЖНЬОМУ перезавантаженні сторінки (нове виконання
// модуля) — саме та межа персистентності, яка тут потрібна.
let wasOpenAcrossLocaleSwitch = false

export default function MobileMenu({ links, btnText, locale }: MobileMenuProps) {
  // Лінива ініціалізація (не useEffect після монтування!) — це і є фікс
  // видимого "миготіння" слайду при зміні мови. useEffect-варіант спершу
  // рендерив .sidebar БЕЗ .active (transform: translateX(-100%)), а тоді на
  // наступному тіку додавав .active — і CSS-transition на transform (0.3s)
  // чесно програвав цю зміну, бо для браузера це два реальні пофарбовані
  // стани того самого DOM-вузла. З лінивим ініціалізатором `open` одразу
  // (на першому ж рендері) дорівнює `true`, коли ремаунт стався після
  // відкритого меню — .sidebar.active існує з першого пофарбованого кадру,
  // без "до" і "після" в межах цього вузла, тож transition просто нічого не
  // застосовує (нема зміни style, яку можна б анімувати). Реальне відкриття
  // через гамбургер (де flagа немає) як і раніше стартує з false і потім
  // реально змінюється на true при кліку — там анімація лишається.
  const [open, setOpen] = useState(() => wasOpenAcrossLocaleSwitch)

  const openMenu = () => {
    setOpen(true)
    wasOpenAcrossLocaleSwitch = true
  }

  const closeMenu = () => {
    setOpen(false)
    wasOpenAcrossLocaleSwitch = false
  }

  // Пункти навігації й кнопка "Консультація" закривають меню при кліку, як
  // і раніше. Перемикач мови (LangSwitch, нижче) свідомо НЕ викликає це —
  // клік по UA/EN має лишати меню відкритим.
  const handleMobileClick = () => {
    closeMenu()
  }

  return (
    <>
      <button
        className={styles.burger}
        onClick={openMenu}
        aria-label="Відкрити меню"
        aria-expanded={open}
      >
        ☰
      </button>

      {/* inert (той самий підхід, що вже в ContactModal.tsx) знімає посилання
          всередині закритого меню і з фокус-порядку, і з accessibility-дерева
          одночасно — без цього aria-hidden сам по собі не заважав Tab
          заходити в приховане меню (axe: aria-hidden-focus). */}
      <div className={`${styles.sidebar} ${open ? styles.active : ""}`} aria-hidden={!open} inert={!open}>
        <button
          className={styles.closeBtn}
          onClick={closeMenu}
          aria-label="Закрити меню"
        >
          &times;
        </button>

        {/* menuBody — усі три секції (нав/мова/CTA) як один блок з
            margin: auto 0, центрований по вертикалі в сайдбарі; closeBtn
            лишається зафіксованим зверху окремо від цього центрування. */}
        <div className={styles.menuBody}>
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

          {/* Перемикач мов — окрема логічна група з відступом зверху, той
              самий ритм, що й у .ctaGroup нижче (див. MobileMenu.module.scss) */}
          <div className={styles.mobileLangGroup}>
            <div className={styles.mobileLang}>
              <LangSwitch currentLocale={locale as 'uk' | 'en'} />
            </div>
          </div>

          <div className={styles.ctaGroup} onClick={handleMobileClick}>
            <NavLink targetId="contacts" activeClass="" className={styles.sidebarBtn}>
              {btnText}
            </NavLink>
          </div>
        </div>
      </div>
    </>
  )
}