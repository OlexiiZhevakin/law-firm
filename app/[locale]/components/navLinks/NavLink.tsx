'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

interface NavLinkProps {
  targetId: string
  className: string
  activeClass: string
  children: ReactNode
}

export default function NavLink({ targetId, className, activeClass, children }: NavLinkProps) {
  const params = useParams()
  const pathname = usePathname()
  const locale = params?.locale || 'uk'

  // Якщо targetId зі Strapi починається з "/" (напр. "/services") — це посилання
  // на окремий маршрут, а не якір на поточній сторінці. Переходимо звичайним
  // Next.js Link без preventDefault/scrollIntoView.
  if (targetId?.startsWith('/')) {
    const rawHref = `/${locale}${targetId}`
    // "/" (Головна) дає /uk/ з кінцевим слешем — а pathname завжди без нього.
    const href = rawHref.length > 1 && rawHref.endsWith('/') ? rawHref.slice(0, -1) : rawHref
    // Корінь локалі ("Головна", targetId="/") — виняток: активний ТІЛЬКИ на
    // точному співпадінні. pathname.startsWith(`${href}/`) для href="/uk" —
    // це буквально "/uk/" — збігається з АБСОЛЮТНО будь-якою сторінкою сайту
    // (/uk/about, /uk/services/... — усі вони "під коренем"), тож без цього
    // винятку "Головна" підсвічувалась одночасно з кожним іншим активним
    // пунктом. Для решти пунктів підсвітка на підсторінках лишається (напр.
    // targetId="/services" лишається активним і на /services/licensing).
    const isRootHref = href === `/${locale}`
    const isActive = isRootHref
      ? pathname === href
      : pathname === href || pathname?.startsWith(`${href}/`)

    return (
      <Link
        href={href}
        className={isActive ? `${className} ${activeClass}` : className}
        prefetch={false}
      >
        {children}
      </Link>
    )
  }

  // 👇 ЗАХИСТ: Відрізаємо решітку, якщо вона випадково прийшла зі Strapi
  const cleanTargetId = targetId?.replace('#', '') || ''

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Шукаємо елемент по чистому ID (наприклад, "about", а не "#about")
    const element = document.getElementById(cleanTargetId)
    if (element) {
      // Елемент є на поточній сторінці (напр. #contacts на головній чи на
      // /services/[slug]) — гасимо звичайну навігацію і просто скролимо.
      e.preventDefault()
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      // Додаємо лише одну решітку в URL
      window.history.pushState(null, '', `#${cleanTargetId}`)
      return
    }
    // Елемента немає на поточній сторінці (напр. на /services, /privacy,
    // /cookies-policy — там немає власного блоку #contacts). Раніше
    // preventDefault() викликався безумовно, тож клік був повністю "мертвим":
    // ані скролу, ані переходу. Тепер НЕ гасимо клік — Link веде за href
    // (`/${locale}#${cleanTargetId}`), тобто реально переходить на головну,
    // де сторінка сама доскролить до блоку (див. Contacts.tsx: useEffect
    // за window.location.hash при монтуванні).
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
