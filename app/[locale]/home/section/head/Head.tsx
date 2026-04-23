
import Button from '@/app/[locale]/components/button/Button'
import styles from './Head.module.scss'



const Head = () => {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Structuring the Future of Finance.</h1>
          <p className={styles.description}>
            Exclusive legal counsel for financial institutions, private equity, and emerging digital asset markets. We build the frameworks of tomorrow.
          </p>
          <div className={styles.btns}>
            <Button href='#' className={styles.btnLight}>Explore expertise</Button>
            <Button href='#' className={styles.btnDark}>Meet the partners</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Head