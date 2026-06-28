import Image from 'next/image'
import styles from './Partner.module.scss'
import Title from '@/app/[locale]/components/title/Title'

const Partner = () => {
  return (
    <section className={styles.partnerSection}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.photo}>
            <Image
              src="/image/partner.jpg" // файл у public/partner.jpg
              alt="Керуючий партнер Гарік Матосян"
              width={320}
              height={700}
              // fill
              className={styles.img}
              priority
            />
          </div>
          <div className={styles.info}>
            <h3 className={styles.role}>Керуючий партнер</h3>
            <Title title="h2" className={styles.title}>Гарік Матосян</Title>

            <p className={styles.bio}>
              Юрист з досвідом роботи в регуляторному та антимонопольному праві.
              У 2020–2023 роках обіймав посаду менеджера в Національному банку України,
              де відповідав за ліцензування страхових компаній. До переходу в НБУ працював
              у юридичних фірмах Arzinger та &quot;Ілляшев та Партнери&quot;.
            </p>
            <ul className={styles.list}>
              <li className={styles.item}>Ліцензування</li>
              <li className={styles.item}>Корпоративне управління</li>
              <li className={styles.item}>Регуляторне право UA · EU · UK</li>
              <li className={styles.item}>Антимонопольне право</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Partner
