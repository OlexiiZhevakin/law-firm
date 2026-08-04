'use client'

import { useState } from 'react'
import ContactModal, { type ContactModalData } from '../components/contactModal/ContactModal'
import styles from './page.module.scss'

interface AboutCtaButtonProps {
  locale: 'uk' | 'en'
  buttonText: string
  data: ContactModalData | null
}

// Той самий патерн, що ContactButton.tsx (Header) і QuickContactButton.tsx —
// власний open-state і власний екземпляр ContactModal, а не спільний з ними
// стан. ContactModal підтримує кілька одночасних інстансів на сторінці
// (useId() для aria-labelledby, див. CLAUDE.md), тож це безпечно.
export default function AboutCtaButton({ locale, buttonText, data }: AboutCtaButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={styles.ctaBtn} onClick={() => setOpen(true)}>
        {buttonText}
      </button>
      <ContactModal open={open} onClose={() => setOpen(false)} locale={locale} data={data} />
    </>
  )
}
