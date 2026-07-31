"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from '../header/Header.module.scss'

interface LangSwitchProps {
  currentLocale: 'uk' | 'en'
}

// Замінює лише перший сегмент шляху (локаль), а не весь pathname на корінь —
// /uk/services/licensing -> /en/services/licensing, /uk -> /en. Slug сторінок
// послуг спільний для uk/en (той самий documentId, перевірено окремо через
// Strapi API), тож заміна сегмента без додаткового API-запиту безпечна.
function buildLocalizedHref(pathname: string, targetLocale: string): string {
  const segments = pathname.split('/')
  // segments[0] завжди порожній рядок (pathname починається з "/"),
  // segments[1] — поточна локаль.
  segments[1] = targetLocale
  return segments.join('/') || `/${targetLocale}`
}

export default function LangSwitch({ currentLocale }: LangSwitchProps) {
  const pathname = usePathname()
  // Ініціалізуємо стан порожнім рядком
  const [hash, setHash] = useState('')

  useEffect(() => {
    // 1. Оновлюємо хеш асинхронно через планувальник подій, щоб уникнути каскадного рендеру
    const initialHash = window.location.hash
    if (initialHash) {
      setTimeout(() => setHash(initialHash), 0)
    }

    const handleHashChange = () => setHash(window.location.hash)

    // 2. Підписуємося на зміну хешу
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <div className={styles.langSwitch}>
      <Link
        href={`${buildLocalizedHref(pathname, 'uk')}${hash}`}
        className={currentLocale === 'uk' ? styles.activeLang : ''}
      >
        ua
      </Link>
      <span className={styles.divider}> / </span>
      <Link
        href={`${buildLocalizedHref(pathname, 'en')}${hash}`}
        className={currentLocale === 'en' ? styles.activeLang : ''}
      >
        en
      </Link>
    </div>
  )
}