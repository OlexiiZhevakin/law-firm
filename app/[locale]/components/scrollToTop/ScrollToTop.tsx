'use client'

import { useEffect, useState } from 'react'
import styles from './ScrollToTop.module.scss'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Перевіряємо рівень скролу сторінки
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Плавний політ на самий верх вікна браузера
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    // Очищаємо хеш в URL для чистоти адресного рядка
    window.history.pushState(null, '', ' ')
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className={styles.scrollTopBtn}
      aria-label="Вгору"
    >
      ↑
    </button>
  )
}