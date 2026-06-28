

// import Title from '@/app/[locale]/components/title/Title'
// import styles from './Contacts.module.scss'


// const Contacts = () => {
//   return (
//     <section className={styles.section}>
//       <div className="container">
//         <Title title={'h2'} className={styles.title}>Контакти</Title>
//         <div className={styles.wrapper}>
//           {/* Ліва колонка — контакти */}
//           <div className={styles.contacts}>
//             <h3 className={styles.contactsTitle}>Адреса</h3>
//             <p>GNTR Coworking<br />вул. М. Грушевського, 3<br />01001, Київ, Україна</p>

//             <h3 className={styles.contactsTitle}>Телефони</h3>
//             <p>+38 (095) 177-04-04<br />+38 (066) 752-82-87</p>

//             <h3 className={styles.contactsTitle}>Email</h3>
//             <p>info@harlib.com.ua</p>

//             <h3 className={styles.contactsTitle}>Години</h3>
//             <p>Пн–Пт<br />9:00–19:00</p>
//           </div>

//           {/* Права колонка — форма */}
//           <form className={styles.form}>
//             <h3 className={styles.formTitle}>Замовити консультацію</h3>
//             <p className={styles.formSubtitle}>Відповідь протягом 1 робочого дня</p>

//             <label>
//               Ім’я
//               <input type="text" name="name" required autoComplete="name" />
//             </label>

//             <label>
//               Email
//               <input type="email" name="email" required autoComplete="email" />
//             </label>

//             <label>
//               Телефон
//               <input
//                 type="tel"
//                 name="phone"
//                 pattern="[0-9]*"
//                 inputMode="numeric"
//                 autoComplete="tel"
//                 required
//               />
//             </label>


//             <button type="submit" className={styles.submitBtn}>
//               Надіслати запит →
//             </button>

//             <p className={styles.privacyNote}>
//               Ваші дані захищені. Ми не передаємо інформацію третім особам та використовуємо їх лише для відповіді.
//             </p>
//           </form>
//         </div>
//       </div>
//     </section>

//   )
// }

// export default Contacts


"use client" // Обов'язково для роботи інтерактиву та обробки форм

import Title from '@/app/[locale]/components/title/Title'
import styles from './Contacts.module.scss'

interface ContactsProps {
  locale?: 'uk' | 'en'
}

export default function Contacts({ locale = 'uk' }: ContactsProps) {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Тут буде логіка відправки на Strapi або API Route (наприклад, через fetch/axios)
    console.log("Форма відправлена")
  }

  return (
    <section id="contacts" className={styles.section}>
      <div className="container">
        <Title title={'h2'} className={styles.title}>
          {locale === 'uk' ? 'Контакти' : 'Contacts'}
        </Title>

        <div className={styles.wrapper}>
          {/* Ліва колонка — контакти */}
          <div className={styles.contacts}>
            <h3 className={styles.contactsTitle}>
              {locale === 'uk' ? 'Адреса' : 'Address'}
            </h3>
            <p>GNTR Coworking<br />вул. М. Грушевського, 3<br />01001, Київ, Україна</p>

            <h3 className={styles.contactsTitle}>
              {locale === 'uk' ? 'Телефони' : 'Phones'}
            </h3>
            <p>
              <a href="tel:+380951770404" className={styles.link}>+38 (095) 177-04-04</a><br />
              <a href="tel:+380667528287" className={styles.link}>+38 (066) 752-82-87</a>
            </p>

            <h3 className={styles.contactsTitle}>Email</h3>
            <p>
              <a href="mailto:info@harlib.com.ua" className={styles.link}>info@harlib.com.ua</a>
            </p>

            <h3 className={styles.contactsTitle}>
              {locale === 'uk' ? 'Години' : 'Hours'}
            </h3>
            <p>{locale === 'uk' ? 'Пн–Пт' : 'Mon–Fri'}<br />9:00–19:00</p>
          </div>

          {/* Права колонка — форма */}
          <form className={styles.form} onSubmit={handleSubmit}>
            <h3 className={styles.formTitle}>
              {locale === 'uk' ? 'Замовити консультацію' : 'Book a Consultation'}
            </h3>
            <p className={styles.formSubtitle}>
              {locale === 'uk' ? 'Відповідь протягом 1 робочого дня' : 'Response within 1 business day'}
            </p>

            <label className={styles.label}>
              {locale === 'uk' ? 'Ім’я' : 'Name'}
              <input type="text" name="name" required autoComplete="name" className={styles.input} />
            </label>

            <label className={styles.label}>
              Email
              <input type="email" name="email" required autoComplete="email" className={styles.input} />
            </label>

            <label className={styles.label}>
              {locale === 'uk' ? 'Телефон' : 'Phone'}
              <input
                type="tel"
                name="phone"
                pattern="[0-9]*"
                inputMode="numeric"
                autoComplete="tel"
                required
                className={styles.input}
              />
            </label>

            <button type="submit" className={styles.submitBtn}>
              {locale === 'uk' ? 'Надіслати запит →' : 'Send Request →'}
            </button>

            <p className={styles.privacyNote}>
              {locale === 'uk'
                ? 'Ваші дані захищені. Ми не передаємо інформацію третім особам та використовуємо їх лише для відповіді.'
                : 'Your data is protected. We do not share information with third parties and use it only to respond.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}