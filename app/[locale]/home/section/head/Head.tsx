
// import Button from '@/app/[locale]/components/button/Button'
// import styles from './Head.module.scss'



// const Head = () => {
//   return (
//     <section className={styles.section}>
//       <div className="container">
//         <div className={styles.wrapper}>
//           <h1 className={styles.title}>Регуляторна
//             навігація
//             для фінансового сектору</h1>
//           <p className={styles.description}>
//             Юридичний бутік для банків, страхових і небанківських фінансових установ, фінтех-компаній і крипто-сервісів — в Україні, ЄС та Великобританії. Команда та засновники фірми мають значний досвід роботи у Регуляторах фінансового сектору.
//           </p>
//           <div className={styles.btns}>
//             <Button href='#' className={styles.btnDark}>Замовити консультацію</Button>
//             <Button href='#' className={styles.btnLight}>Наші послуги</Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }

// export default Head

import Button from '@/app/[locale]/components/button/Button'
import styles from './Head.module.scss'

interface HeadProps {
  locale?: 'uk' | 'en'
}

export default function Head({ locale = 'uk' }: HeadProps) {
  return (
    <section id="head" className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>

          <h1 className={styles.title}>
            {locale === 'uk'
              ? "Регуляторна навігація для фінансового сектору"
              : "Regulatory Navigation for the Financial Sector"
            }
          </h1>

          <p className={styles.description}>
            {locale === 'uk' ? (
              `Юридичний бутік для банків, страхових і небанківських фінансових установ, 
              фінтех-компаній і крипто-сервісів — в Україні, ЄС та Великобританії. 
              Команда та засновники фірми мають значний досвід роботи у Регуляторах фінансового сектору.`
            ) : (
              `A boutique law firm for banks, insurance, non-banking financial institutions, 
              fintech companies, and crypto services across Ukraine, the EU, and the UK. 
              Our team and founders possess extensive experience within financial sector Regulators.`
            )}
          </p>

          <div className={styles.btns}>
            <Button href={`/${locale}/contacts`} className={styles.btnDark}>
              {locale === 'uk' ? 'Замовити консультацію' : 'Book a Consultation'}
            </Button>
            <Button href={`/${locale}/services`} className={styles.btnLight}>
              {locale === 'uk' ? 'Наші послуги' : 'Our Services'}
            </Button>
          </div>

        </div>
      </div>
    </section>
  )
}