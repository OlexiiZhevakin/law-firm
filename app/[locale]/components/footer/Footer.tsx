
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
          {/* Ліва колонка — контакти */}
          <div className={styles.contacts}>
            <h3 className={styles.contactsTitle}>Адреса</h3>
            <p>GNTR Coworking<br />вул. М. Грушевського, 3<br />01001, Київ, Україна</p>

            <h3 className={styles.contactsTitle}>Телефони</h3>
            <p>+38 (095) 177-04-04<br />+38 (066) 752-82-87</p>

            <h3 className={styles.contactsTitle}>Email</h3>
            <p>info@harlib.com.ua</p>

            <h3 className={styles.contactsTitle}>Години</h3>
            <p>Пн–Пт<br />9:00–19:00</p>
          </div>

          {/* Права колонка — форма */}
          <form className={styles.form}>
            <h3 className={styles.formTitle}>Замовити консультацію</h3>
            <p className={styles.formSubtitle}>Відповідь протягом 1 робочого дня</p>

            <label>
              Ім’я
              <input type="text" name="name" required autoComplete="name" />
            </label>

            <label>
              Email
              <input type="email" name="email" required autoComplete="email" />
            </label>

            <label>
              Телефон
              <input
                type="tel"
                name="phone"
                pattern="[0-9]*"
                inputMode="numeric"
                autoComplete="tel"
                required
              />
            </label>


            <button type="submit" className={styles.submitBtn}>
              Надіслати запит →
            </button>

            <p className={styles.privacyNote}>
              Ваші дані захищені. Ми не передаємо інформацію третім особам та використовуємо їх лише для відповіді.
            </p>
          </form>
        </div>
      </div>
    </footer>

  )
}

export default Footer