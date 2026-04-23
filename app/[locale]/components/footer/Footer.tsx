
import Link from 'next/link'
import Title from '../title/Title'
import styles from './Footer.module.scss'
import Logo from '../logo/Logo'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <Title title={'h2'} className={styles.title}>Контакти</Title>
        <div className={styles.wrapper}>

          
        <Logo/>


          {/* Контактна інформація */}
          <address className={styles.contacts}>
            <p>м. Київ, вул. Хрещатик, 10</p>
            <p>
              Телефон: <Link href="tel:+380441234567">+38 (044) 123-45-67</Link>
            </p>
            <p>
              Email: <Link href="mailto:info@harlib.com">info@harlib.com</Link>
            </p>
          </address>

          {/* Соцмережі */}
          <nav className={styles.socials} aria-label="Соціальні мережі">
            <ul className={styles.menu}>
              <li><Link href="https://facebook.com/harlib" target="_blank" rel="noopener noreferrer">Facebook</Link></li>
              <li><Link href="https://instagram.com/harlib" target="_blank" rel="noopener noreferrer">Instagram</Link></li>
              <li><Link href="https://linkedin.com/company/harlib" target="_blank" rel="noopener noreferrer">LinkedIn</Link></li>
            </ul>
          </nav>

        </div>
      </div>
    </footer>

  )
}

export default Footer