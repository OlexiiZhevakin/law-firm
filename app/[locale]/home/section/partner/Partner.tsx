// import Image from 'next/image'
// import styles from './Partner.module.scss'
// import Title from '@/app/[locale]/components/title/Title'

// const Partner = () => {
//   return (
//     <section className={styles.partnerSection}>
//       <div className="container">
//         <div className={styles.wrapper}>
//           <div className={styles.photo}>
//             <Image
//               src="/image/partner.jpg" // файл у public/partner.jpg
//               alt="Керуючий партнер Гарік Матосян"
//               fill
//               className={styles.img}
//               priority
//             />
//           </div>
//           <div className={styles.info}>
//             <h3 className={styles.role}>Керуючий партнер</h3>
//             <Title title="h2" className={styles.title}>Гарік Матосян</Title>

//             <p className={styles.bio}>
//               Юрист з досвідом роботи в регуляторному та антимонопольному праві.
//               У 2020–2023 роках обіймав посаду менеджера в Національному банку України,
//               де відповідав за ліцензування страхових компаній. До переходу в НБУ працював
//               у юридичних фірмах Arzinger та &quot;Ілляшев та Партнери&quot;.
//             </p>
//             <ul className={styles.list}>
//               <li className={styles.item}>Ліцензування</li>
//               <li className={styles.item}>Корпоративне управління</li>
//               <li className={styles.item}>Регуляторне право UA · EU · UK</li>
//               <li className={styles.item}>Антимонопольне право</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Partner


import Image from 'next/image'
import styles from './Partner.module.scss'
import Title from '@/app/[locale]/components/title/Title'

const specializations = [
  { id: 1, uk: "Ліцензування", en: "Licensing" },
  { id: 2, uk: "Корпоративне управління", en: "Corporate Governance" },
  { id: 3, uk: "Регуляторне право UA · EU · UK", en: "Regulatory Law UA · EU · UK" },
  { id: 4, uk: "Антимонопольне право", en: "Antitrust Law" },
]

interface PartnerProps {
  locale?: 'uk' | 'en'
}

export default function Partner({ locale = 'uk' }: PartnerProps) {
  return (
    <section className={styles.partnerSection}>
      <div className="container">
        <div className={styles.wrapper}>

          <div className={styles.photo}>
            <Image
              src="/image/partner.jpg"
              alt={locale === 'uk' ? "Керуючий партнер Гарік Матосян" : "Managing partner Garik Matosyan"}
              fill
              className={styles.img}
              priority
              // Говоримо браузеру реальні максимальні розміри картинки на різних брейкпоінтах
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 240px, 320px"
            />
          </div>

          <div className={styles.info}>
            <h3 className={styles.role}>
              {locale === 'uk' ? "Керуючий партнер" : "Managing partner"}
            </h3>

            <Title title="h2" className={styles.title}>
              {locale === 'uk' ? "Гарік Матосян" : "Garik Matosyan"}
            </Title>

            <p className={styles.bio}>
              {locale === 'uk' ? (
                `Юрист з досвідом роботи в регуляторному та антимонопольному праві.
                У 2020–2023 роках обіймав посаду менеджера в Національному банку України,
                де відповідав за ліцензування страхових компаній. До переходу в НБУ працював
                у юридичних фірмах Arzinger та "Ілляшев та Партнери".`
              ) : (
                `Lawyer with experience in regulatory and antitrust law.
                In 2020–2023, he held the position of manager at the National Bank of Ukraine,
                where he was responsible for licensing insurance companies. Before joining the NBU, he worked
                at Arzinger and "Ilyashev & Partners" law firms.`
              )}
            </p>

            <ul className={styles.list}>
              {specializations.map(item => (
                <li key={item.id} className={styles.item}>
                  {locale === 'uk' ? item.uk : item.en}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}