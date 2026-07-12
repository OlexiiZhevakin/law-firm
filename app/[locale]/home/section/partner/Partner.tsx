import Image from 'next/image'
import styles from './Partner.module.scss'

export interface PartnerSectionData {
  role: string;
  name: string;
  bio: string;
  photo: { url: string; alternativeText?: string };
}

interface PartnerProps {
  data?: PartnerSectionData;
}

export default function Partner({ data }: PartnerProps) {
  if (!data) return null;

  // Формуємо повний URL картинки (Strapi віддає лише шлях)
  const imageUrl = data.photo.url.startsWith('http')
    ? data.photo.url
    : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1331'}${data.photo.url}`;

  return (
    <section className={styles.partnerSection}>
      <div className="container">
        <div className={styles.wrapper}>

          <div className={styles.photo}>
            <Image
              src={imageUrl}
              alt={data.photo.alternativeText || data.name}
              fill
              className={styles.img}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 240px, 320px"
              unoptimized
              priority
            />
          </div>

          <div className={styles.info}>
            <p className={styles.role}>{data.role}</p>

            <h2 className={styles.title}>{data.name}</h2>

            <article className={styles.bio}>
              {data.bio.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          </div>

        </div>
      </div>
    </section>
  )
}