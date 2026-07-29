"use client"

import { useRef, useState } from 'react'
import Link from 'next/link'
import Title from '@/app/[locale]/components/title/Title'
import styles from './Contacts.module.scss'

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
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const formData = new FormData(e.currentTarget)
    const formDataObj = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObj),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('success')
      formRef.current?.reset()
    } catch {
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

          {/* Форма */}
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>{data.formTitle}</h3>
            <p className={styles.formSubtitle}>{data.formSubtitle}</p>

            <div className={styles.field}>
              <input type="text" id="contact-name" name="name" required autoComplete="name" placeholder=" " className={styles.input} />
              <label htmlFor="contact-name" className={styles.fieldLabel}>{locale === 'uk' ? 'Ім’я' : 'Name'}</label>
            </div>
            <div className={styles.field}>
              <input type="text" id="contact-company" name="company" autoComplete="organization" placeholder=" " className={styles.input} />
              <label htmlFor="contact-company" className={styles.fieldLabel}>{locale === 'uk' ? 'Назва компанії' : 'Company Name'}</label>
            </div>
            <div className={styles.field}>
              <input type="email" id="contact-email" name="email" required autoComplete="email" placeholder=" " className={styles.input} />
              <label htmlFor="contact-email" className={styles.fieldLabel}>Email</label>
            </div>
            <div className={styles.field}>
              <input type="tel" id="contact-phone" name="phone" required autoComplete="tel" placeholder=" " className={styles.input} />
              <label htmlFor="contact-phone" className={styles.fieldLabel}>{locale === 'uk' ? 'Телефон' : 'Phone'}</label>
            </div>
            <div className={styles.field}>
              <textarea id="contact-message" name="message" rows={3} placeholder=" " className={styles.textarea} />
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

            <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
              {status === 'sending' ? '...' : (locale === 'uk' ? 'НАДІСЛАТИ ЗАПИТ →' : 'SEND REQUEST →')}
            </button>

            <p className={styles.status} aria-live="polite">
              {status === 'success' && (
                locale === 'uk' ? 'Дякуємо! Ваша заявка отримана.' : 'Thank you! Your request has been received.'
              )}
              {status === 'error' && (
                locale === 'uk' ? 'Помилка відправки. Спробуйте ще раз.' : 'Submission error. Please try again.'
              )}
            </p>

            {/* Текст під кнопкою */}
            <p className={styles.formDisclaimer}>{data.formDisclaimer}</p>
          </form>
        </div>
      </div>
    </section>
  )
}
