'use client'

import { useState } from 'react'
import ContactModal, { type ContactModalData } from '../../components/contactModal/ContactModal'
import styles from './page.module.scss'

interface ServiceCtaButtonProps {
  locale: 'uk' | 'en'
  data: ContactModalData | null
}

// Той самий патерн, що ContactButton.tsx (Header) і AboutCtaButton.tsx
// (/about) — власний open-state і власний екземпляр ContactModal. Текст —
// UI chrome, не редакційний контент зі Strapi (той самий "locale === 'uk'
// ? ... : ..." мікро-рядок патерн, що вже є для інших службових написів),
// тож ця кнопка з'являється однаково на КОЖНІй сторінці послуги, не лише
// на licensing — джерельний PDF для licensing посилався на неіснуючий
// маршрут (/uk/kontakty), тож замість нового маршруту весь service-page
// шаблон отримав цю кнопку, яка відкриває вже наявну модалку.
export default function ServiceCtaButton({ locale, data }: ServiceCtaButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={styles.ctaBtn} onClick={() => setOpen(true)}>
        {locale === 'uk' ? 'Обговорити проєкт' : 'Discuss your matter'}
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} locale={locale} data={data} />
    </>
  )
}
