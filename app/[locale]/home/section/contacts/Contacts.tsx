"use client"

import { useRef, useState } from 'react'
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
    formDisclaimer: string // Додали нове поле
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
      if (res.ok) {
        setStatus('success')
        formRef.current?.reset()
        alert(locale === 'uk' ? 'Дякуємо! Ваша заявка отримана.' : 'Thank you! Your request has been received.')
      } else {
        throw new Error('Failed to send')
      }
    } catch (error) {
      setStatus('error')
      alert(locale === 'uk' ? 'Помилка відправки.' : 'Submission error.')
    } finally {
      setStatus('idle')
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

            {/* Години */}
            <h3 className={styles.contactsTitle}>{locale === 'uk' ? 'Години роботи' : 'Opening Hours'}</h3>
            <p>{data.hours}</p>
          </div>

          {/* Форма */}
          <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>{data.formTitle}</h3>
            <p className={styles.formSubtitle}>{data.formSubtitle}</p>

            <label className={styles.label}>{locale === 'uk' ? 'Ім’я' : 'Name'}
              <input type="text" name="name" required className={styles.input} />
            </label>
            <label className={styles.label}>{locale === 'uk' ? 'Назва компанії' : 'Company Name'}
              <input type="text" name="company" className={styles.input} />
            </label>
            <label className={styles.label}>Email
              <input type="email" name="email" required className={styles.input} />
            </label>
            <label className={styles.label}>{locale === 'uk' ? 'Телефон' : 'Phone'}
              <input type="tel" name="phone" required className={styles.input} />
            </label>
            <label className={styles.label}>{locale === 'uk' ? 'Короткий опис питання' : 'Short description'}
              <textarea name="message" rows={4} className={styles.textarea} />
            </label>

            <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
              {status === 'sending' ? '...' : (locale === 'uk' ? 'НАДІСЛАТИ ЗАПИТ →' : 'SEND REQUEST →')}
            </button>

            {/* Текст під кнопкою */}
            <p className={styles.formDisclaimer}>{data.formDisclaimer}</p>
          </form>
        </div>
      </div>
    </section>
  )
}