"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../header/Header.module.scss'

interface LangSwitchProps {
  currentLocale: 'uk' | 'en'
}

export default function LangSwitch({ currentLocale }: LangSwitchProps) {
  const pathname = usePathname()

  // Функція замінює префікс мови в поточному URL (наприклад, /en/services -> /uk/services)
  const getSecondaryLanguagePath = (targetLocale: string) => {
    if (!pathname) return `/${targetLocale}`
    const segments = pathname.split('/')
    segments[1] = targetLocale // Замінюємо сегмент мови [1]
    return segments.join('/')
  }

  return (
    <div className={styles.langSwitch}>
      <Link
        href={getSecondaryLanguagePath('uk')}
        className={currentLocale === 'uk' ? styles.activeLang : ''}
      >
        ua
      </Link>
      <span className={styles.divider}> / </span>
      <Link
        href={getSecondaryLanguagePath('en')}
        className={currentLocale === 'en' ? styles.activeLang : ''}
      >
        en
      </Link>
    </div>
  )
}