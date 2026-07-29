import { permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import HomePage from "./home/page";
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/lib/routes';

interface PageProps {
  // Залишаємо strict-тип Next.js, але обробляємо його безпечно
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params as Record<string, string | undefined>;
  const currentLocale = (resolvedParams?.locale as Locale) || 'uk';

  return generatePageMetadata({
    locale: currentLocale,
    path: '',
    title: {
      uk: 'HARLIB | Юридичний бутик фінансового та корпоративного права',
      en: 'HARLIB | Financial & Corporate Law Boutique',
    },
    description: {
      uk: 'HARLIB — юридичний бутік для банків, страхових і небанківських фінансових установ, фінтех-компаній і крипто-сервісів — в Україні, ЄС, Великобританії та Азії.',
      en: 'HARLIB is a legal boutique for banks, insurance and non-bank financial institutions, fintech companies and crypto-services — in Ukraine, the EU, the UK, and Asia.',
    },
    keywords: {
      uk: [
        'юридичний бутик', 'фінансове право', 'юридичні послуги для бізнесу',
        'корпоративне право', 'супровід інвестицій', 'структурування бізнесу',
        'податковий консалтинг', 'захист активів', 'злиття та поглинання M&A',
        'Due Diligence Україна', 'юрист для IT та Fintech', 'HARLIB',
        'адвокат для бізнесу', 'корпоративний договір',
      ],
      en: [
        'law boutique', 'financial law Ukraine', 'corporate law',
        'investment legal support', 'business structuring', 'tax consulting Ukraine',
        'asset protection', 'M&A Ukraine', 'Due Diligence', 'Fintech lawyer',
        'HARLIB', 'business attorney', 'legal services for business',
      ],
    },
  });
}

export default async function Home({ params }: PageProps) {
  // 1. Пробуємо розібрати параметри. На чистому "/" Next.js може кинути порожній об'єкт
  const resolvedParams = await params as Record<string, string | undefined>;

  // 2. Якщо мови немає в URL, миттєво робимо редирект і перериваємо виконання
  if (!resolvedParams || !resolvedParams.locale) {
    permanentRedirect('/uk');
  }

  // 3. Якщо ми дійшли сюди, значить locale точно є, і тип повністю сумісний із HomePage
  return (
    <HomePage params={params} />
  );
}