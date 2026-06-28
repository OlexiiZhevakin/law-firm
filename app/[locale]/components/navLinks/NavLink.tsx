'use client'

import { ReactNode } from 'react'
import Link from 'next/link' // Повертаємо Next.js Link
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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      window.history.pushState(null, '', `#${targetId}`)
    }
  }

  return (
    <Link
      href={`/${locale}#${targetId}`}
      onClick={handleScroll}
      className={className}
      prefetch={false} // 👇 ОСЬ ЦЕЙ ПАРАМЕТР ВИМИКАЄ ФОНОВІ 404 ПОМИЛКИ!
    >
      {children}
    </Link>
  )
}