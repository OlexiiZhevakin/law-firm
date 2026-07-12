import Button from '@/app/[locale]/components/button/Button'
import styles from './Head.module.scss'

export interface ButtonData {
  title: string;
  targetId: string;
}

export interface HeadSectionData {
  title: string;
  description: string;
  primaryButton?: ButtonData;
  secondaryButton?: ButtonData;
}

interface HeadProps {
  locale?: 'uk' | 'en';
  data?: HeadSectionData;
}

export default function Head({ locale = 'uk', data }: HeadProps) {
  // Якщо даних зі Strapi немає, нічого не рендеримо
  if (!data) return null;

  return (
    <section id="head" className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>

          <h1 className={styles.title}>{data.title}</h1>

          <p className={styles.description}>{data.description}</p>

          <div className={styles.btns}>
            {data.primaryButton && (
              <Button href={`/${locale}#${data.primaryButton.targetId}`} className={styles.btnDark}>
                {data.primaryButton.title}
              </Button>
            )}

            {data.secondaryButton && (
              <Button href={`/${locale}#${data.secondaryButton.targetId}`} className={styles.btnLight}>
                {data.secondaryButton.title}
              </Button>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}