"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import Title from '@/app/[locale]/components/title/Title'
import Toast from '@/app/[locale]/components/toast/Toast'
import styles from './Contacts.module.scss'

// Той самий формат телефону, що й на сервері (app/api/contact/route.ts) —
// приймає +380/міжнародні номери з пробілами/дужками/дефісами, без
// зайвої строгості, щоб не відхиляти валідні номери.
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/

interface ContactsProps {
  locale?: 'uk' | 'en'
  data: {
    title: string
    address: string
    addressLink: string
    phones: Array<{ label: string; value: string }>
    email: string
    hours: string
    formTitle: string
    formSubtitle: string
    formDisclaimer: string
  }
}

export default function Contacts({ locale = 'uk', data }: ContactsProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Якщо на цю сторінку перейшли з хешем #contacts (наприклад, з NavLink.tsx
  // після кліку "Контакти" на /services чи /privacy, де власного блоку
  // контактів немає) — доскролюємо до цього блоку самі. Next.js App Router
  // не гарантує авто-скрол до якоря після клієнтського переходу між
  // маршрутами так само надійно, як звичайне повне завантаження сторінки.
  useEffect(() => {
    if (window.location.hash === '#contacts') {
      const frame = requestAnimationFrame(() => {
        document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formDataObj = Object.fromEntries(formData.entries())

    // Клієнтська перевірка формату телефону — не покладаємось лише на
    // maxLength/required, і не використовуємо нативний pattern (його
    // спливне повідомлення не локалізується під мову сторінки, лише
    // під мову браузера — див. QA-аудит). Той самий regex продубльовано
    // на сервері (route.ts), бо це легко обійти прямим запитом до API.
    const phone = String(formDataObj.phone ?? '').trim()
    if (!PHONE_RE.test(phone)) {
      setErrorMessage(
        locale === 'uk'
          ? 'Перевірте формат номера телефону.'
          : 'Please check the phone number format.'
      )
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObj),
      })
      if (!res.ok) throw new Error('Failed to send')
      // Форма лишається на екрані (не замінюється success-блоком) — тому
      // очищуємо поля вручну й одразу повертаємось у 'idle', готові до
      // нового заповнення. Підтвердження показує Toast, не сама форма.
      setStatus('idle')
      formRef.current?.reset()
      setToastMessage(
        locale === 'uk' ? 'Дякуємо! Ваше повідомлення надіслано' : 'Thank you! Your message has been sent'
      )
    } catch {
      setErrorMessage(
        locale === 'uk' ? 'Помилка відправки. Спробуйте ще раз.' : 'Submission error. Please try again.'
      )
      setStatus('error')
    }
  }

  return (
    <section id="contacts" className={styles.section}>
      <div className="container">
        <Title title={'h2'} className={styles.title}>{data.title}</Title>

        <div className={styles.wrapper}>
          <div className={styles.contacts}>
            {/* Адреса */}
            <h3 className={styles.contactsTitle}>{locale === 'uk' ? 'Адреса' : 'Address'}</h3>
            <a href={data.addressLink} target="_blank" rel="noopener noreferrer" className={styles.addressLink}>
              {data.address?.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </a>

            {/* Телефони */}
            <h3 className={styles.contactsTitle}>{locale === 'uk' ? 'Телефони' : 'Phones'}</h3>
            <p>
              {data.phones?.map((phone, i) => (
                <span key={i}>
                  <a href={`tel:${phone.value}`} className={styles.link}>{phone.label}</a>
                  <br />
                </span>
              ))}
            </p>

            {/* Email */}
            <h3 className={styles.contactsTitle}>Email</h3>
            <p><a href={`mailto:${data.email}`} className={styles.link}>{data.email}</a></p>

          </div>

          {/* Форма завжди лишається на екрані — успіх підтверджується Toast'ом
              (нижче), а не заміною полів на окремий стан. Помилка й далі
              показується банером тут же, без змін. */}
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>{data.formTitle}</h3>
            <p className={styles.formSubtitle}>{data.formSubtitle}</p>

            <div className={styles.field}>
              <input type="text" id="contact-name" name="name" required autoComplete="name" placeholder=" " maxLength={100} className={styles.input} />
              <label htmlFor="contact-name" className={styles.fieldLabel}>{locale === 'uk' ? 'Ім’я' : 'Name'}</label>
            </div>
            <div className={styles.field}>
              <input type="text" id="contact-company" name="company" autoComplete="organization" placeholder=" " maxLength={150} className={styles.input} />
              <label htmlFor="contact-company" className={styles.fieldLabel}>{locale === 'uk' ? 'Назва компанії' : 'Company Name'}</label>
            </div>
            <div className={styles.field}>
              <input type="email" id="contact-email" name="email" required autoComplete="email" placeholder=" " maxLength={254} className={styles.input} />
              <label htmlFor="contact-email" className={styles.fieldLabel}>Email</label>
            </div>
            <div className={styles.field}>
              <input type="tel" id="contact-phone" name="phone" required autoComplete="tel" placeholder=" " maxLength={20} className={styles.input} />
              <label htmlFor="contact-phone" className={styles.fieldLabel}>{locale === 'uk' ? 'Телефон' : 'Phone'}</label>
            </div>
            <div className={styles.field}>
              <textarea id="contact-message" name="message" rows={3} placeholder=" " maxLength={2000} className={styles.textarea} />
              <label htmlFor="contact-message" className={styles.fieldLabel}>{locale === 'uk' ? 'Короткий опис питання' : 'Short description'}</label>
            </div>

            {/* Honeypot: приховане від людей поле-приманка для ботів, див. app/api/contact/route.ts */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <label className={styles.consentLabel}>
              <input type="checkbox" name="consent" required className={styles.consentInput} />
              <span>
                {locale === 'uk'
                  ? 'Я даю згоду на обробку персональних даних відповідно до '
                  : 'I agree to the processing of my personal data in accordance with the '}
                <Link href={`/${locale}/privacy`} className={styles.consentLink}>
                  {locale === 'uk' ? 'Політики конфіденційності' : 'Privacy Policy'}
                </Link>
              </span>
            </label>

            {/* Помітний банер помилки — раніше це був лише малопомітний рядок
                тексту під кнопкою, який легко пропустити. aria-live той самий
                (полите), просто тепер візуально виділений іконкою/кольором/рамкою. */}
            {status === 'error' && (
              <div className={styles.errorBanner} aria-live="polite">
                <AlertCircle className={styles.errorIcon} aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
              {status === 'sending'
                ? (locale === 'uk' ? 'Надсилаємо…' : 'Sending…')
                : (locale === 'uk' ? 'НАДІСЛАТИ ЗАПИТ →' : 'SEND REQUEST →')}
            </button>

            {/* Текст під кнопкою */}
            <p className={styles.formDisclaimer}>{data.formDisclaimer}</p>
          </form>
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          closeLabel={locale === 'uk' ? 'Закрити' : 'Close'}
          onClose={() => setToastMessage(null)}
        />
      )}
    </section>
  )
}
