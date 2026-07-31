import Link from 'next/link';
import styles from './Breadcrumbs.module.scss';

export interface BreadcrumbLink {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  /** Останній елемент — поточна сторінка, рендериться без посилання. */
  items: BreadcrumbLink[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={item.href} className={styles.item}>
            {isLast ? (
              <span className={styles.current} aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className={styles.link}>
                {item.name}
              </Link>
            )}
            {!isLast && (
              <span className={styles.separator} aria-hidden="true">
                /
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
