'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './ArticleNav.module.scss'

export interface ArticleNavSection {
  id: string
  heading: string
}

interface ArticleNavProps {
  sections: ArticleNavSection[]
  title: string
}

interface IndicatorPosition {
  top: number
  height: number
}

export default function ArticleNav({ sections, title }: ArticleNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [indicator, setIndicator] = useState<IndicatorPosition | null>(null)
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({})

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // rootMargin зміщує "точку спрацювання" ближче до верху вʼюпорта,
    // щоб заголовок ставав активним одразу після того, як зайде під шапку,
    // а не лише коли опиниться точно в центрі екрана.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  // Позиція рухомого індикатора рахується від реальних DOM-вимірів пунктів
  // списку (не жорстко), бо висота тексту заголовка відрізняється між
  // локалями та залежить від переносу рядків.
  useEffect(() => {
    const updateIndicator = () => {
      if (!activeId) {
        setIndicator(null)
        return
      }
      const el = itemRefs.current[activeId]
      if (el) {
        setIndicator({ top: el.offsetTop, height: el.offsetHeight })
      }
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeId])

  if (sections.length === 0) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.pushState(null, '', `#${id}`)
    setActiveId(id)
  }

  return (
    <>
      <aside className={styles.aside} aria-label={title}>
        <p className={styles.asideTitle}>{title}</p>
        <ul className={styles.navList}>
          {indicator && (
            <span
              className={styles.indicator}
              style={{ transform: `translateY(${indicator.top}px)`, height: indicator.height }}
              aria-hidden="true"
            />
          )}
          {sections.map((section) => (
            <li
              key={section.id}
              ref={(el) => {
                itemRefs.current[section.id] = el
              }}
            >
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={`${styles.navLink} ${activeId === section.id ? styles.active : ''}`}
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <details className={styles.mobileNav}>
        <summary className={styles.mobileSummary}>{title}</summary>
        <ul className={styles.mobileList}>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => handleClick(e, section.id)}
                className={`${styles.mobileNavLink} ${activeId === section.id ? styles.active : ''}`}
              >
                {section.heading}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </>
  )
}
