import Link from 'next/link'
import styles from './Logo.module.scss'

const Logo = ({ width = 60, height = 60 }: { width?: number; height?: number }) => {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <svg
          viewBox="0 0 100 100"
          width={width}
          height={height}
          fill="none"
          stroke="currentColor"   // ← тут
          strokeWidth="8"
          strokeLinecap="square"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ліва колонка */}
          <line x1="25" y1="35" x2="25" y2="80" />
          {/* Центральна колонка */}
          <line x1="50" y1="20" x2="50" y2="80" />
          {/* Права колонка */}
          <line x1="75" y1="20" x2="75" y2="65" />
          {/* Ліва перекладина */}
          <line x1="25" y1="57.5" x2="50" y2="57.5" />
          {/* Права перекладина */}
          <line x1="50" y1="42.5" x2="75" y2="42.5" />
          {/* Вузли перетину */}
          <rect x="44" y="51.5" width="12" height="12" fill="currentColor" stroke="none" />
          <rect x="44" y="36.5" width="12" height="12" fill="currentColor" stroke="none" />
          <rect x="19" y="51.5" width="12" height="12" fill="currentColor" stroke="none" />
          <rect x="69" y="36.5" width="12" height="12" fill="currentColor" stroke="none" />
        </svg>
      </Link>
      <div className={styles.logoInfo}>
        <h3 className={styles.subtitle}>HARLIB</h3>
        <p className={styles.description}>Financial Law Boutique</p>
      </div>
    </div>
  )
}

export default Logo
