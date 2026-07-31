'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Send, MessageCircle, Phone } from 'lucide-react'
import styles from './ContactModal.module.scss'

export interface ContactModalData {
  telegramUrl?: string
  whatsappUrl?: string
  phones?: Array<{ id: number; label: string; value: string }>
}

interface ContactModalProps {
  open: boolean
  onClose: () => void
  locale: 'uk' | 'en'
  data: ContactModalData | null
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

export default function ContactModal({ open, onClose, locale, data }: ContactModalProps) {
  // Той самий mount-gate трюк, що в CookieBanner.tsx — не рендеримо модалку
  // до першого клієнтського рендеру, щоб уникнути flash/mismatch при гідратації.
  const [mounted, setMounted] = useState(false)
  // Унікальний per-instance id — на сторінці тепер можуть одночасно існувати
  // кілька ContactModal (Header і QuickContactButton), і без цього обидва
  // рендерили б однаковий id="contact-modal-title" (невалідний HTML/a11y).
  const titleId = useId()
  const overlayRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Поки модалка відкрита, решта сторінки стає inert — недоступною ні для
  // фокуса, ні для скрінрідерів. inert (на відміну від aria-hidden) сам
  // знімає елементи з accessibility-дерева й фокус-порядку, без ризику
  // "заблокованого" стану, коли прихований елемент усе ще утримує фокус —
  // саме на це попереджала консоль. Модалка рендериться через портал у
  // document.body (нижче), тому вона — справжній сиблінг <header>/<main>/
  // <footer>, і її легко виключити з переліку "решти сторінки" за ref.
  useEffect(() => {
    if (!open) return

    const overlay = overlayRef.current
    const siblings = Array.from(document.body.children).filter((el) => el !== overlay)

    siblings.forEach((el) => el.setAttribute('inert', ''))

    return () => {
      siblings.forEach((el) => el.removeAttribute('inert'))
    }
  }, [open])

  // ESC-закриття та базовий focus trap — активні лише поки модалка відкрита.
  useEffect(() => {
    if (!open) return

    closeBtnRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return

        const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!mounted) return null

  const phone = data?.phones?.[0]

  return createPortal(
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${open ? styles.active : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={locale === 'uk' ? 'Закрити' : 'Close'}
        >
          &times;
        </button>

        <h3 id={titleId} className={styles.title}>
          {locale === 'uk' ? "Зв'яжіться з нами" : 'Get in touch'}
        </h3>

        <div className={styles.options}>
          {data?.telegramUrl && (
            <a href={data.telegramUrl} target="_blank" rel="noopener noreferrer" className={styles.option}>
              <Send className={styles.optionIcon} aria-hidden="true" />
              <span className={styles.optionLabel}>Telegram</span>
            </a>
          )}

          {data?.whatsappUrl && (
            <a href={data.whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.option}>
              <MessageCircle className={styles.optionIcon} aria-hidden="true" />
              <span className={styles.optionLabel}>WhatsApp</span>
            </a>
          )}

          {phone && (
            <a href={`tel:${phone.value}`} className={styles.option}>
              <Phone className={styles.optionIcon} aria-hidden="true" />
              <span className={styles.optionText}>
                <span className={styles.optionLabel}>{locale === 'uk' ? 'Подзвонити' : 'Call us'}</span>
                <span className={styles.optionSublabel}>{phone.label}</span>
              </span>
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
