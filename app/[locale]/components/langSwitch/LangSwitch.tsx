"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '../header/Header.module.scss'

interface LangSwitchProps {
  currentLocale: 'uk' | 'en'
}

export default function LangSwitch({ currentLocale }: LangSwitchProps) {
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
        href={`/uk${hash}`}
        className={currentLocale === 'uk' ? styles.activeLang : ''}
      >
        ua
      </Link>
      <span className={styles.divider}> / </span>
      <Link
        href={`/en${hash}`}
        className={currentLocale === 'en' ? styles.activeLang : ''}
      >
        en
      </Link>
    </div>
  )
}