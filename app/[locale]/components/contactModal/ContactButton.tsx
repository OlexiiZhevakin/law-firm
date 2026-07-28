'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import ContactModal, { type ContactModalData } from './ContactModal'
import styles from './ContactButton.module.scss'

interface ContactButtonProps {
  locale: 'uk' | 'en'
  btnText: string
  headerBtnClassName: string
  data: ContactModalData | null
}

export default function ContactButton({ locale, btnText, headerBtnClassName, data }: ContactButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={headerBtnClassName} onClick={() => setOpen(true)}>
        {btnText}
      </button>

      <button
        type="button"
        className={styles.mobileCallBtn}
        onClick={() => setOpen(true)}
        aria-label={locale === 'uk' ? "Зв'язатися з нами" : 'Contact us'}
      >
        <Phone size={20} strokeWidth={2} />
      </button>

      <ContactModal open={open} onClose={() => setOpen(false)} locale={locale} data={data} />
    </>
  )
}
