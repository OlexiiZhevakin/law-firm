import styles from './Block.module.scss'

export const Block = () => {
  return (
    <section className={styles.blockSection}>
      <div className="container">
        <div className={styles.wrapper}>
          <h2 className={styles.title}>Наші принципи</h2>

          <div className={styles.grid}>
            <article className={styles.item}>
              <span className={styles.number}>01</span>
              <h3 className={styles.subtitle}>Експертиза</h3>
              <p className={styles.text}>
                Глибокі знання у вузькій сфері. Не приймаємо роботу, в якій не впевнені на 100%.
              </p>
            </article>

            <article className={styles.item}>
              <span className={styles.number}>02</span>
              <h3 className={styles.subtitle}>Конфіденційність</h3>
              <p className={styles.text}>
                Адвокатська таємниця, захищені сховища, шифровані канали листування на запит.
              </p>
            </article>

            <article className={styles.item}>
              <span className={styles.number}>03</span>
              <h3 className={styles.subtitle}>Конкретика</h3>
              <p className={styles.text}>
                Не пишемо &quot;50 сторінок про все&quot;. Чіткий висновок: так / ні / можна за умов.
              </p>
            </article>

            <article className={styles.item}>
              <span className={styles.number}>04</span>
              <h3 className={styles.subtitle}>Партнерство</h3>
              <p className={styles.text}>
                Більшість проектів — повторні звернення або рекомендації існуючих клієнтів.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Block
