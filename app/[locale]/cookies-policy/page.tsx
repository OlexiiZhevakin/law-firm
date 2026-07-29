import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/lib/routes';
import CookieSettingsTrigger from '../components/cookies/CookieSettingsTrigger';
import styles from './CookiesPolicy.module.scss';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale: (locale as Locale) || 'uk',
    path: '/cookies-policy',
    title: {
      uk: 'Налаштування cookies',
      en: 'Cookie Settings',
    },
    description: {
      uk: 'Які файли cookie та локальні сховища використовує harlib.com.ua, навіщо вони потрібні і як керувати своїм вибором.',
      en: 'Which cookies and local storage harlib.com.ua uses, what they are for, and how to manage your choice.',
    },
  });
}

// Вихідний .md-текст містить внутрішні лінки на слаги, яких немає в цьому
// Next.js-застосунку (/polityka-konfidentsiynosti, /privacy-policy) — сам
// текст не редагую (не мій контент), лише мапую href на реальний існуючий
// роут /privacy при рендері. Якщо колись з'являться справжні сторінки за
// цими слагами — цю мапу треба буде прибрати.
const LEGACY_INTERNAL_LINK_MAP: Record<string, string> = {
  '/polityka-konfidentsiynosti': '/privacy',
  '/privacy-policy': '/privacy',
};

function resolveHref(href: string, locale: Locale): string {
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return href;
  }

  const mapped = LEGACY_INTERNAL_LINK_MAP[href] ?? href;
  return `/${locale}${mapped.startsWith('/') ? mapped : `/${mapped}`}`;
}

function createMarkdownComponents(locale: Locale): Components {
  return {
    h1: ({ children }) => <h1 className={styles.h1}>{children}</h1>,
    h2: ({ children }) => <h2 className={styles.h2}>{children}</h2>,
    p: ({ children }) => <p className={styles.p}>{children}</p>,
    strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
    em: ({ children }) => <em className={styles.em}>{children}</em>,
    code: ({ children }) => <code className={styles.code}>{children}</code>,
    ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
    li: ({ children }) => <li>{children}</li>,
    a: ({ href, children }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const isExternal = /^https?:\/\//.test(href ?? '');
      return (
        <Link
          href={href ? resolveHref(href, locale) : '#'}
          className={styles.link}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </Link>
      );
    },
    table: ({ children }) => (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>{children}</table>
      </div>
    ),
    th: ({ children }) => <th className={styles.th}>{children}</th>,
    td: ({ children }) => <td className={styles.td}>{children}</td>,
    // Єдиний "живий" елемент у документі: <button data-cookie-settings> у
    // вихідному .md відкриває той самий CookieBanner, що й посилання у
    // Footer — див. CookieSettingsTrigger.tsx.
    button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
      if ('data-cookie-settings' in props) {
        return <CookieSettingsTrigger className={styles.inlineTrigger}>{children}</CookieSettingsTrigger>;
      }
      return <button {...props}>{children}</button>;
    },
  };
}

function readLegalMarkdown(filename: string): string {
  return fs.readFileSync(path.join(process.cwd(), 'content', 'legal', filename), 'utf8');
}

export default async function CookiesPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'uk';
  const filename = currentLocale === 'uk' ? 'cookies-policy-uk.md' : 'cookies-policy-en.md';
  const content = readLegalMarkdown(filename);

  return (
    <main className="container">
      <div className={styles.main}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={createMarkdownComponents(currentLocale)}
        >
          {content}
        </ReactMarkdown>
      </div>
    </main>
  );
}
