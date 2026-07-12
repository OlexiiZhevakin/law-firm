import styles from './Block.module.scss'

// Описуємо структуру одного елемента списку
export interface PrincipleItemData {
  id: number; // Strapi автоматично додає id кожному елементу масиву
  number: string;
  title: string;
  text: string;
}

// Описуємо структуру всієї секції
export interface BlockSectionData {
  title: string;
  items: PrincipleItemData[];
}

interface BlockProps {
  locale?: 'uk' | 'en';
  data?: BlockSectionData;
}

export default function Block({ locale = 'uk', data }: BlockProps) {
  if (!data) return null;

  return (
    <section className={styles.blockSection}>
      <div className="container">
        <div className={styles.wrapper}>

          <h2 className={styles.title}>{data.title}</h2>

          {/* Семантично правильний список: ul > li */}
          <ul className={styles.grid}>
            {data.items.map((item) => (
              <li key={item.id} className={styles.item}>
                <article>
                  <span className={styles.number}>{item.number}</span>
                  <h3 className={styles.subtitle}>{item.title}</h3>
                  <p className={styles.text}>{item.text}</p>
                </article>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  )
}