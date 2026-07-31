'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2 } from 'lucide-react'
import styles from './Toast.module.scss'

interface ToastProps {
  message: string
  closeLabel: string
  onClose: () => void
  durationMs?: number
}

// Час CSS-анімації зникнення (.closing у Toast.module.scss) — має співпадати
// з тривалістю там, інакше onClose спрацює до/після завершення анімації.
const EXIT_ANIMATION_MS = 250

export default function Toast({ message, closeLabel, onClose, durationMs = 4500 }: ToastProps) {
  const [closing, setClosing] = useState(false)
  // Той самий mount-gate, що в CookieBanner.tsx/ContactModal.tsx — portal у
  // document.body недоступний під час SSR.
  const [mounted, setMounted] = useState(false)

  const startClose = () => setClosing(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Автозникнення через durationMs.
  useEffect(() => {
    const timer = setTimeout(startClose, durationMs)
    return () => clearTimeout(timer)
  }, [durationMs])

  // Реальне розмонтування (виклик onClose) відкладене на час CSS-анімації
  // зникнення, щоб toast встиг плавно зникнути, а не пропав миттєво.
  useEffect(() => {
    if (!closing) return
    const timer = setTimeout(onClose, EXIT_ANIMATION_MS)
    return () => clearTimeout(timer)
  }, [closing, onClose])

  if (!mounted) return null

  // Портал у document.body — так само, як ContactModal.tsx. Без нього
  // position: fixed рахувався б відносно найближчого предка з transform/
  // will-change: transform (тут — обгортка <Reveal>, яка саме так анімує
  // появу секцій), а не справжнього viewport, і toast виїжджав би за межі
  // видимої області замість того, щоб бути прикріпленим до верху екрана.
  return createPortal(
    <div
      className={`${styles.toast} ${closing ? styles.closing : ''}`}
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className={styles.icon} aria-hidden="true" />
      <span className={styles.text}>{message}</span>
      <button type="button" className={styles.closeBtn} onClick={startClose} aria-label={closeLabel}>
        &times;
      </button>
    </div>,
    document.body
  )
}
