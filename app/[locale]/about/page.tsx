import Link from 'next/link';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { fetchStrapi, fetchContactData } from '@/lib/api';
import { generatePageMetadata } from '@/lib/metadata';
import { buildAboutPageJsonLd, buildJsonLdGraph, buildLegalServiceJsonLd, buildPersonJsonLd } from '@/lib/jsonld';
import type { Locale } from '@/lib/routes';
import Reveal from '../components/reveal/Reveal';
import Title from '../components/title/Title';
import Block, { type BlockSectionData } from '../home/section/block/Block';
import Partner from '../home/section/partner/Partner';
import Contacts from '../home/section/contacts/Contacts';
import JsonLd from '../components/seo/JsonLd';
import AboutCtaButton from './AboutCtaButton';
import type { ServicesSectionData } from '../home/section/services/Services';
import styles from './page.module.scss';

interface KeyContactData {
  eyebrow?: string;
  name: string;
  photo?: { url: string; alternativeText?: string };
  altText?: string;
  bio?: string;
  email?: string;
  phone?: string;
}

interface AboutPageData {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  storyTitle?: string;
  storyBody?: string;
  clientsTitle?: string;
  clientsItems?: string;
  clientsInvestorsTitle?: string;
  clientsInvestorsText?: string;
  clientsCaption?: string;
  keyContact?: KeyContactData;
  ctaTitle?: string;
  ctaText?: string;
  ctaButtonText?: string;
}

interface HomeSectionsForAbout {
  blockSection?: BlockSectionData;
  servicesSection?: ServicesSectionData;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

// UI chrome, не редакційний контент (structural rail-мітки блоків) — той
// самий "locale === 'uk' ? ... : ..." мікро-рядок патерн, що вже є для інших
// службових написів (labels "Адреса"/"Phones" тощо, див. CLAUDE.md).
const RAIL_LABELS = {
  uk: ['01 · Фірма', '02 · Експертиза', '03 · Клієнти'],
  en: ['01 · The firm', '02 · Expertise', '03 · Clients'],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale: (locale as Locale) || 'uk',
    path: '/about',
    title: {
      uk: 'Про HARLIB – регуляторний супровід фінансового сектору',
      en: 'About HARLIB – financial sector regulatory support',
    },
    description: {
      uk: 'HARLIB супроводжує банки, страхові, фінансові та платіжні установи, фінтех і інвесторів, які заходять у сектор. Ліцензування, капітал, управління, комплаєнс.',
      en: 'HARLIB advises banks, insurers, finance and payment institutions, fintech and investors entering the sector: licensing, capital, governance, compliance.',
    },
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || 'uk';
  const rail = RAIL_LABELS[currentLocale];

  const [aboutPageData, homeSections, contactData] = await Promise.all([
    fetchStrapi('about-page', {
      locale: currentLocale,
      'populate[keyContact][populate]': '*',
    }) as Promise<AboutPageData | null>,
    fetchStrapi('home-page', {
      locale: currentLocale,
      'populate[blockSection][populate]': '*',
      'populate[servicesSection][populate][clusters][populate][items]': '*',
    }) as Promise<HomeSectionsForAbout | null>,
    fetchContactData(currentLocale),
  ]);

  const keyContact = aboutPageData?.keyContact;
  const servicesSection = homeSections?.servicesSection;
  const clientsItems = aboutPageData?.clientsItems?.split('\n').filter(Boolean) ?? [];

  const jsonLdItems = [buildLegalServiceJsonLd(currentLocale), buildAboutPageJsonLd(currentLocale)];

  if (keyContact?.name && keyContact.photo) {
    const imageUrl = keyContact.photo.url.startsWith('http')
      ? keyContact.photo.url
      : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1331'}${keyContact.photo.url}`;

    jsonLdItems.push(
      buildPersonJsonLd({
        locale: currentLocale,
        name: keyContact.name,
        jobTitle: keyContact.eyebrow || '',
        imageUrl,
        // Реального посилання на LinkedIn немає в наявних даних — краще
        // відсутній sameAs, ніж фейкове значення в structured data.
      })
    );
  }

  const jsonLdGraph = buildJsonLdGraph(jsonLdItems);
  const nonce = (await headers()).get('x-nonce') || undefined;

  return (
    <>
      <JsonLd data={jsonLdGraph} nonce={nonce} />

      <main className="container">
        {/* 1 · HERO */}
        {aboutPageData?.heroTitle && (
          <section className={styles.hero}>
            {aboutPageData.heroEyebrow && <p className={styles.eyebrow}>{aboutPageData.heroEyebrow}</p>}
            <Title title="h1">{aboutPageData.heroTitle}</Title>
            {aboutPageData.heroSubtitle && (
              <p className={styles.heroSubtitle}>{aboutPageData.heroSubtitle}</p>
            )}
          </section>
        )}

        {/* 2 · ПРО ФІРМУ */}
        {aboutPageData?.storyTitle && aboutPageData?.storyBody && (
          <Reveal>
            <section className={styles.section}>
              <div className={styles.grid}>
                <div className={styles.marker}>{rail[0]}</div>
                <div>
                  <h2 className={styles.sectionTitle}>{aboutPageData.storyTitle}</h2>
                  <div className={styles.storyBody}>
                    {aboutPageData.storyBody.split('\n').map((paragraph, index) => (
                      paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* 3 · ЕКСПЕРТИЗА — дослівно ідентична home-page.servicesSection, тому
            не дублюється в about-page схемі, а перевикористовується той самий
            fetch, що вже живить головну сторінку. */}
        {servicesSection && servicesSection.clusters?.length > 0 && (
          <Reveal>
            <section className={styles.section}>
              <div className={styles.grid}>
                <div className={styles.marker}>{rail[1]}</div>
                <div>
                  <h2 className={styles.sectionTitle}>{servicesSection.mainTitle}</h2>
                  {servicesSection.mainSubtitle && (
                    <p className={styles.caption}>{servicesSection.mainSubtitle}</p>
                  )}

                  {servicesSection.clusters.map((cluster) => (
                    <div key={cluster.id} className={styles.clusterGroup}>
                      <p className={styles.clusterLabel}>{cluster.clusterTitle}</p>
                      <ul className={styles.expertiseList}>
                        {cluster.items.map((item) => (
                          <li key={item.id} className={styles.expertiseItem}>
                            <h3 className={styles.expertiseLabel}>{item.title}</h3>
                            <p className={styles.expertiseDescription}>{item.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  <Link href={`/${currentLocale}/services`} className={styles.afterLink}>
                    {currentLocale === 'uk' ? 'Детально про кожну послугу' : 'Full service descriptions'} →
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>
        )}

        {/* 4 · КЛІЄНТИ */}
        {aboutPageData?.clientsTitle && clientsItems.length > 0 && (
          <Reveal>
            <section className={styles.section}>
              <div className={styles.grid}>
                <div className={styles.marker}>{rail[2]}</div>
                <div>
                  <h2 className={styles.sectionTitle}>{aboutPageData.clientsTitle}</h2>
                  <ul className={styles.tagsList}>
                    {clientsItems.map((item, index) => (
                      <li key={index} className={styles.tagsItem}>{item}</li>
                    ))}
                  </ul>

                  {aboutPageData.clientsInvestorsTitle && aboutPageData.clientsInvestorsText && (
                    <div className={styles.callout}>
                      <h3 className={styles.calloutTitle}>{aboutPageData.clientsInvestorsTitle}</h3>
                      <p className={styles.calloutText}>{aboutPageData.clientsInvestorsText}</p>
                    </div>
                  )}

                  {aboutPageData.clientsCaption && (
                    <p className={styles.caption}>{aboutPageData.clientsCaption}</p>
                  )}
                </div>
              </div>
            </section>
          </Reveal>
        )}
      </main>

      {/* 5 · ПРИНЦИПИ — дослівно ідентичні home-page.blockSection ("Наші
          принципи"), той самий спільний компонент, що вже показує їх на
          головній — не дублюємо контент у about-page. */}
      {homeSections?.blockSection && (
        <Reveal>
          <Block locale={currentLocale} data={homeSections.blockSection} />
        </Reveal>
      )}

      {/* 6 · КЛЮЧОВИЙ КОНТАКТ — той самий Partner, що на головній сторінці,
          з доданими email/телефон під bio. */}
      {keyContact?.name && keyContact.photo && (
        <Reveal>
          <Partner
            data={{
              role: keyContact.eyebrow || '',
              name: keyContact.name,
              bio: keyContact.bio || '',
              photo: { url: keyContact.photo.url, alternativeText: keyContact.altText },
              email: keyContact.email,
              phone: keyContact.phone,
            }}
          />
        </Reveal>
      )}

      {/* 7 · CTA — кнопка відкриває ContactModal (телефон/Telegram/WhatsApp),
          а не веде на /uk#contacts. */}
      {aboutPageData?.ctaTitle && (
        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaWrapper}>
              <h2 className={styles.ctaTitle}>{aboutPageData.ctaTitle}</h2>
              {aboutPageData.ctaText && <p className={styles.ctaText}>{aboutPageData.ctaText}</p>}
              {aboutPageData.ctaButtonText && (
                <AboutCtaButton
                  locale={currentLocale}
                  buttonText={aboutPageData.ctaButtonText}
                  data={contactData}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {contactData && <Contacts locale={currentLocale} data={contactData} />}
    </>
  );
}
