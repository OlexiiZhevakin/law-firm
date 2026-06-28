// import styles from './Block.module.scss'

// export const Block = () => {
//   return (
//     <section className={styles.blockSection}>
//       <div className="container">
//         <div className={styles.wrapper}>
//           <h2 className={styles.title}>Наші принципи</h2>

//           <div className={styles.grid}>
//             <article className={styles.item}>
//               <span className={styles.number}>01</span>
//               <h3 className={styles.subtitle}>Експертиза</h3>
//               <p className={styles.text}>
//                 Глибокі знання у вузькій сфері. Не приймаємо роботу, в якій не впевнені на 100%.
//               </p>
//             </article>

//             <article className={styles.item}>
//               <span className={styles.number}>02</span>
//               <h3 className={styles.subtitle}>Конфіденційність</h3>
//               <p className={styles.text}>
//                 Адвокатська таємниця, захищені сховища, шифровані канали листування на запит.
//               </p>
//             </article>

//             <article className={styles.item}>
//               <span className={styles.number}>03</span>
//               <h3 className={styles.subtitle}>Конкретика</h3>
//               <p className={styles.text}>
//                 Не пишемо &quot;50 сторінок про все&quot;. Чіткий висновок: так / ні / можна за умов.
//               </p>
//             </article>

//             <article className={styles.item}>
//               <span className={styles.number}>04</span>
//               <h3 className={styles.subtitle}>Партнерство</h3>
//               <p className={styles.text}>
//                 Більшість проектів — повторні звернення або рекомендації існуючих клієнтів.
//               </p>
//             </article>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Block

import styles from './Block.module.scss'

const principles = [
  {
    id: "01",
    titleUk: "Експертиза",
    titleEn: "Expertise",
    textUk: "Глибокі знання у вузькій сфері. Не приймаємо роботу, в якій не впевнені на 100%.",
    textEn: "Deep knowledge in a narrow field. We do not accept work we are not 100% confident in.",
  },
  {
    id: "02",
    titleUk: "Конфіденційність",
    titleEn: "Confidentiality",
    textUk: "Адвокатська таємниця, захищені сховища, шифровані канали листування на запит.",
    textEn: "Attorney-client privilege, secure storage, encrypted communication channels upon request.",
  },
  {
    id: "03",
    titleUk: "Конкретика",
    titleEn: "Specificity",
    textUk: "Не пишемо &quot;50 сторінок про все&quot;. Чіткий висновок: так / ні / можна за умов.",
    textEn: "We don't write '50 pages about everything'. Clear conclusion: yes / no / conditional.",
  },
  {
    id: "04",
    titleUk: "Партнерство",
    titleEn: "Partnership",
    textUk: "Більшість проектів — повторні звернення або рекомендації існуючих клієнтів.",
    textEn: "Most projects are repeat business or recommendations from existing clients.",
  },
]

// Оскільки це Server Component, у майбутньому передамо сюди { params } зі сторінки для локалі
interface BlockProps {
  locale?: 'uk' | 'en'
}

export default function Block({ locale = 'uk' }: BlockProps) {
  return (
    <section className={styles.blockSection}>
      <div className="container">
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Наші принципи</h2>

          <div className={styles.grid}>
            {principles.map((item) => (
              <article key={item.id} className={styles.item}>
                <span className={styles.number}>{item.id}</span>
                <h3 className={styles.subtitle}>
                  {locale === 'uk' ? item.titleUk : item.titleEn}
                </h3>
                <p className={styles.text}>
                  {locale === 'uk' ? item.textUk : item.textEn}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
