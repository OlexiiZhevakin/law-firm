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
    // "| HARLIB" дописано явно в самому рядку, а НЕ залишено на layout.tsx's
    // title.template — за документацією Next.js (generate-metadata.md,
    // "Good to know"): "title.template defined in layout.js will not apply
    // to a title defined in a page.js of the SAME route segment". Ця
    // сторінка (app/[locale]/page.tsx) і layout.tsx лежать в ОДНОМУ сегменті
    // ([locale]), тому шаблон із layout сюди НЕ каскадується — на відміну
    // від about/services/etc, які є вкладеними сегментами. Раніше рядок
    // мав хибний префікс "HARLIB | " (без шаблону це давало лише один раз
    // бренд на початку, без дублювання — попередній аудит помилково
    // припустив, що шаблон завжди застосовується). Суфікс тут — це
    // єдиний спосіб отримати бренд у заголовку цієї конкретної сторінки.
    title: {
      uk: 'Юридичний бутик  для фінансових установ | HARLIB',
      en: 'Boutique law firm for financial institutions | HARLIB',
    },
    description: {
      // "(Харліб, Гарліб)" додано один раз тут — обидва варіанти українською
      // транслітерацією поруч із латинським HARLIB, щоб Google пов'язав усі
      // три написання з одним брендом. Єдине місце в тексті, де вони
      // вписані поруч (див. law-firm/CLAUDE.md "Brand name variants") —
      // навмисно без дублювання деінде, щоб не виглядало як keyword stuffing.
      uk: 'HARLIB — юридичний бутик для банків, страхових і небанківських фінансових установ, фінтех-компаній і крипто-сервісів — в Україні, ЄС, Великобританії та Азії.',
      // "the UK" -> "UK" (162 -> 158 символів) — єдина правка, значення й
      // ключові терміни не змінені, лише прибрано зайвий артикль.
      en: 'HARLIB is a legal boutique for banks, insurance and non-bank financial institutions, fintech companies and crypto-services — in Ukraine, the EU, UK, and Asia.',
    },
    keywords: {
      uk: [
        'юридичний бутик', 'фінансове право', 'юридичні послуги для бізнесу',
        'корпоративне право', 'супровід інвестицій', 'структурування бізнесу',
        'податковий консалтинг', 'захист активів', 'злиття та поглинання M&A',
        'Due Diligence Україна', 'юрист для IT та Fintech', 'HARLIB',
        'Харліб', 'Гарліб',
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