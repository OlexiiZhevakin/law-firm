import styles from './Services.module.scss'
import Title from "@/app/[locale]/components/title/Title"


const Services = () => {
  return (
    <section className={styles.servicesSection}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.description}>
            <p className={styles.meta}> — послуги</p>
            <div className={styles.info}>
              <Title title="h2" className={styles.title}>Від отримання ліцензії до повного комплаєнсу</Title>
              <p className={styles.text}>
                10 послуг у трьох кластерах. Більшість доступна одночасно у трьох юрисдикціях:
                Україна (НБУ, НКЦПФР), країни ЄС (PSD2, EMD2, MiCA) і Великобританія (FCA, PRA).
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </section>

  )
}

export default Services