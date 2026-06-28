import Link from "next/link"
import styles from './Footer.module.scss'
import Logo from "../logo/Logo"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.wrapper}>
          {/* Лого + опис */}
          
          <div className={styles.column}>
            <div className={styles.logo}>
              <Link href="/">
                <svg
                  viewBox="0 0 100 100"
                  width={60}
                  height={60}
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
            <p className={styles.desc}>
              Юридичний бутик для фінансового сектору. <br />
              Регуляторна навігація в Україні, ЄС та Великобританії.
            </p>
          </div>

          {/* Навігація */}
          <div className={styles.column}>
            <h3 className={styles.title}>Сайт</h3>
            <ul className={styles.list}>
              <li><Link href="/">Головна</Link></li>
              <li><Link href="/about">Про нас</Link></li>
              <li><Link href="/services">Послуги</Link></li>
              <li><Link href="/contacts">Контакти</Link></li>
            </ul>
          </div>

          {/* Юрисдикції */}
          <div className={styles.column}>
            <h3 className={styles.title}>Юрисдикції</h3>
            <ul className={styles.list}>
              <li>Україна (НБУ)</li>
              <li>Європейський Союз</li>
              <li>Великобританія (FCA)</li>
            </ul>
          </div>

          {/* Юридична інформація */}
          <div className={styles.column}>
            <h3 className={styles.title}>Юридична інформація</h3>
            <ul className={styles.list}>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
              <li><Link href="/terms">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        {/* Нижня частина */}
        <div className={styles.bottom}>
          <p>© 2026 HARLIB. HARLIB надає юридичні консультації відповідно до законодавства України. Інформація на цьому сайті носить загальний інформаційний характер і не є юридичною порадою стосовно конкретної ситуації.</p>
          <p>[ЄДРПОУ — ЗАМІНИТИ]</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
