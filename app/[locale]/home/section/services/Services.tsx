import styles from './Services.module.scss'

// Визначаємо типи відповідно до структури Strapi
export interface ServiceItem {
  id: number;
  title: string;
  description: string;
}

export interface ServiceCluster {
  id: number;
  clusterTitle: string;
  items: ServiceItem[];
}

export interface ServicesSectionData {
  mainTitle: string;
  mainSubtitle: string;
  clusters: ServiceCluster[];
}

interface ServicesProps {
  data?: ServicesSectionData;
  locale?: 'uk' | 'en';
}

export default function Services({ data, locale = 'uk' }: ServicesProps) {
  // Перевірка на наявність даних
  if (!data?.clusters || data.clusters.length === 0) return null;

  return (
    <section id="services" className={styles.servicesSection}>
      <div className="container">
        <h2 className={styles.mainTitle}>{data.mainTitle}</h2>
        <p className={styles.mainSubtitle}>{data.mainSubtitle}</p>

        {data.clusters.map((cluster) => (
          <div key={cluster.id} className={styles.cluster}>
            <h3 className={styles.clusterTitle}>{cluster.clusterTitle}</h3>
            <ul className={styles.grid}>
              {cluster.items.map((item) => (
                <li key={item.id} className={styles.card}>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <p className={styles.cardDesc}>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}