
import Button from '@/app/[locale]/components/button/Button'
import styles from './Head.module.scss'



const Head = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Регуляторна
            навігація
            для фінансового сектору</h1>
          <p className={styles.description}>
            Юридичний бутік для банків, страхових і небанківських фінансових установ, фінтех-компаній і крипто-сервісів — в Україні, ЄС та Великобританії. Команда та засновники фірми мають значний досвід роботи у Регуляторах фінансового сектору.
          </p>
          <div className={styles.btns}>
            <Button href='#' className={styles.btnDark}>Замовити консультацію</Button>
            <Button href='#' className={styles.btnLight}>Наші послуги</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Head