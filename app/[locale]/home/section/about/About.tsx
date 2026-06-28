import styles from './About.module.scss'
import Title from "@/app/[locale]/components/title/Title"

interface AboutProps {
  locale?: 'uk' | 'en'
}

export default function About({ locale = 'uk' }: AboutProps) {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        <div className={styles.wrapper}>
          <Title title="h2">
            {locale === 'uk' ? 'Про нас' : 'About Us'}
          </Title>

          <h3 className={styles.description}>
            {locale === 'uk'
              ? 'Юридичний бутік, побудований на регуляторному досвіді'
              : 'A law boutique built on regulatory expertise'
            }
          </h3>

          <article className={styles.content}>
            {locale === 'uk' ? (
              <>
                <p>
                  Керуючий партнер фірми має досвід роботи в Національному банку України. Ми супроводжуємо фінансові установи в найскладніших процедурах: ліцензуванні, зміні структури власності, корпоративному управлінні, виході на ринки ЄС і Великобританії.
                </p>
                <p>
                  Більшість юридичних фірм дивляться на регулятора з боку клієнта — і складають документи, орієнтуючись на букву закону. Ми додаємо ще один шар: розуміння того, як працює сам регулятор. Які запитання поставлять інспектори, на які формулювання звернуть увагу, де знаходяться &quot;червоні лінії&quot; і де є простір для діалогу.
                </p>
                <p>
                  Цей погляд зсередини скорочує час на узгодження документів і робить процес ліцензування передбачуваним — особливо в індустрії, де закон оновлюється кілька разів на рік.
                </p>
              </>
            ) : (
              <>
                <p>
                  The firm’s managing partner brings extensive experience from the National Bank of Ukraine. We guide financial institutions through the most complex procedures: licensing, ownership restructuring, corporate governance, and expanding into EU and UK markets.
                </p>
                <p>
                  Most law firms look at regulators from the client’s perspective, drafting documents strictly based on the letter of the law. We add another layer: an understanding of how the regulator operates from within. We know the questions inspectors will ask, the exact wording they scrutinize, where the red lines lie, and where there is room for dialogue.
                </p>
                <p>
                  This insider perspective minimizes document review timelines and makes the licensing process predictable—especially in an industry where regulations update several times a year.
                </p>
              </>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}