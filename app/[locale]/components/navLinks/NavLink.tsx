
'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface NavLinkProps {
  targetId: string
  className: string
  activeClass: string
  children: ReactNode
}

export default function NavLink({ targetId, className, activeClass, children }: NavLinkProps) {
  const params = useParams()
  const locale = params?.locale || 'uk'

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault() // Скасовуємо різкий стрибок браузера

    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      // Оновлюємо хеш в адресному рядку для краси
      window.history.pushState(null, '', `#${targetId}`)
    }
  }

  return (
    <Link
      href={`/${locale}#${targetId}`}
      onClick={handleScroll}
      className={className}
    >
      {children}
    </Link>
  )
}