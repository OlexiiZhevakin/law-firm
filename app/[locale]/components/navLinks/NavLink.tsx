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

  // Якщо targetId зі Strapi починається з "/" (напр. "/services") — це посилання
  // на окремий маршрут, а не якір на поточній сторінці. Переходимо звичайним
  // Next.js Link без preventDefault/scrollIntoView.
  if (targetId?.startsWith('/')) {
    return (
      <Link href={`/${locale}${targetId}`} className={className} prefetch={false}>
        {children}
      </Link>
    )
  }

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
