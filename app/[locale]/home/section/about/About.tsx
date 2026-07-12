import styles from './About.module.scss'

export interface AboutSectionData {
  label: string;
  title: string;
  content: string;
}

interface AboutProps {
  locale?: 'uk' | 'en';
  data?: AboutSectionData;
}

export default function About({ locale = 'uk', data }: AboutProps) {
  if (!data) return null;

  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        {/* wrapper центрує весь контент секції */}
        <div className={styles.wrapper}>

          <p className={styles.label}>
            {data.label}
          </p>

          <h2 className={styles.description}>
            {data.title}
          </h2>

          <div className={styles.content}>
            {data.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim()) {
                return <p key={index}>{paragraph}</p>;
              }
              return null;
            })}
          </div>

        </div>
      </div>
    </section>
  )
}