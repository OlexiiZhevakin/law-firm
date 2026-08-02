"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from '../header/Header.module.scss'

interface LangSwitchProps {
  currentLocale: 'uk' | 'en'
}

// Замінює лише перший сегмент шляху (локаль), а не весь pathname на корінь —
// /uk/about -> /en/about, /uk -> /en. Безпечно для БУДЬ-ЯКОЇ сторінки, ОКРІМ
// /services/[slug] (див. нижче) — там slug більше не спільний між uk/en після
// переструктурування каталогу послуг.
function buildLocalizedHref(pathname: string, targetLocale: string): string {
  const segments = pathname.split('/')
  // segments[0] завжди порожній рядок (pathname починається з "/"),
  // segments[1] — поточна локаль.
  segments[1] = targetLocale
  return segments.join('/') || `/${targetLocale}`
}

const SERVICE_DETAIL_RE = /^\/[a-z]{2}\/services\/([^/]+)$/

export default function LangSwitch({ currentLocale }: LangSwitchProps) {
  const pathname = usePathname()
  // Ініціалізуємо стан порожнім рядком
  const [hash, setHash] = useState('')
  // undefined = ще не резолвнули (або сторінка не потребує резолву);
  // null = резолвнули, і пари в іншій локалі немає (напр. crypto — лише en).
  const [alternateSlug, setAlternateSlug] = useState<string | null | undefined>(undefined)

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

  const otherLocale = currentLocale === 'uk' ? 'en' : 'uk'
  const serviceMatch = pathname.match(SERVICE_DETAIL_RE)

  // slug сторінок послуг більше НЕ спільний між uk/en (переструктурування
  // каталогу послуг: /uk/services/kapitalizaciya <-> /en/services/capital) —
  // наївна заміна сегмента локалі тут більше не безпечна. Header/LangSwitch
  // рендеряться в app/[locale]/layout.tsx, сиблінгом до самої сторінки (не
  // батько/дитина), тож серверні дані сторінки (documentId/альтернативний
  // slug, які вже правильно порахувані для hreflang у generateMetadata
  // сторінки) сюди напряму не прокинути. Замість цього — легкий клієнтський
  // запит до власного /api/service-page-locale-slug (тонкий проксі до
  // Strapi), лише коли pathname реально виглядає як сторінка послуги.
  useEffect(() => {
    // Коли serviceMatch немає, hrefFor нижче взагалі не читає alternateSlug
    // (окрема гілка для "не сторінка послуги") — скидати стан тут нема
    // потреби, це заощаджує зайвий setState у ефекті без serviceMatch.
    if (!serviceMatch) return

    const slug = serviceMatch[1]
    let cancelled = false

    fetch(
      `/api/service-page-locale-slug?slug=${encodeURIComponent(slug)}&fromLocale=${currentLocale}&toLocale=${otherLocale}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAlternateSlug(data.slug ?? null)
      })
      .catch(() => {
        if (!cancelled) setAlternateSlug(null)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, currentLocale, otherLocale])

  function hrefFor(targetLocale: 'uk' | 'en'): string {
    if (targetLocale === currentLocale) {
      return `${pathname}${hash}`
    }

    if (!serviceMatch) {
      // Будь-яка інша сторінка сайту — та сама перевірена наївна заміна
      // сегмента, що й раніше.
      return `${buildLocalizedHref(pathname, targetLocale)}${hash}`
    }

    if (alternateSlug) {
      return `/${targetLocale}/services/${alternateSlug}`
    }

    // Ще не резолвнули (undefined) АБО резолвнули, що пари немає (null, напр.
    // crypto -> uk) — в обох випадках безпечний фолбек на каталог послуг:
    // ніколи не 404, і самокоригується в межах мілісекунд після монтування,
    // щойно /api/service-page-locale-slug відповість конкретним slug'ом.
    return `/${targetLocale}/services`
  }

  return (
    <div className={styles.langSwitch}>
      <Link
        href={hrefFor('uk')}
        className={currentLocale === 'uk' ? styles.activeLang : ''}
      >
        ua
      </Link>
      <span className={styles.divider}> / </span>
      <Link
        href={hrefFor('en')}
        className={currentLocale === 'en' ? styles.activeLang : ''}
      >
        en
      </Link>
    </div>
  )
}
