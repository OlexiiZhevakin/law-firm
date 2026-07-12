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

export default function NavLink({ targetId, className, children }: NavLinkProps) {
  const params = useParams()
  const locale = params?.locale || 'uk'

  // 👇 ЗАХИСТ: Відрізаємо решітку, якщо вона випадково прийшла зі Strapi
  const cleanTargetId = targetId?.replace('#', '') || ''

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // Шукаємо елемент по чистому ID (наприклад, "about", а не "#about")
    const element = document.getElementById(cleanTargetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      // Додаємо лише одну решітку в URL
      window.history.pushState(null, '', `#${cleanTargetId}`)
    }
  }

  return (
    <Link
      href={`/${locale}#${cleanTargetId}`} // Тепер тут завжди буде лише одна #
      onClick={handleScroll}
      className={className}
      prefetch={false}
    >
      {children}
    </Link>
  )
}