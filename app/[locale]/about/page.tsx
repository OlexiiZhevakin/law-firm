import type { Metadata } from 'next';
import { fetchStrapi, fetchContactData } from '@/lib/api';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/lib/routes';
import Reveal from '../components/reveal/Reveal';
import Title from '../components/title/Title';
import Block, { type BlockSectionData } from '../home/section/block/Block';
import Partner, { type PartnerSectionData } from '../home/section/partner/Partner';
import Contacts from '../home/section/contacts/Contacts';
import styles from './page.module.scss';

interface AboutPageData {
  heroTitle?: string;
  heroSubtitle?: string;
  storyTitle?: string;
  storyBody?: string;
}

interface HomeSectionsForAbout {
  blockSection?: BlockSectionData;
  partnerSection?: PartnerSectionData;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale: (locale as Locale) || 'uk',
    path: '/about',
    title: {
      uk: 'Про HARLIB — юридичний бутік фінансового сектору',
      en: 'About HARLIB — Financial Sector Law Boutique',
    },
    description: {
      uk: 'HARLIB — команда з досвідом роботи в регуляторах фінансового сектору. Дізнайтеся більше про принципи роботи та команду юридичного бутика.',
      en: 'HARLIB is a team with hands-on experience inside financial-sector regulators. Learn more about our principles and the people behind the firm.',
    },
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || 'uk';

  const [aboutPageData, homeSections, contactData] = await Promise.all([
    fetchStrapi('about-page', { locale: currentLocale }) as Promise<AboutPageData | null>,
    fetchStrapi('home-page', {
      locale: currentLocale,
      'populate[blockSection][populate]': '*',
      'populate[partnerSection][populate]': '*',
    }) as Promise<HomeSectionsForAbout | null>,
    fetchContactData(currentLocale),
  ]);

  return (
    <>
      <main className="container">
        {aboutPageData?.heroTitle && (
          <section className={styles.hero}>
            <Title title="h1">{aboutPageData.heroTitle}</Title>
            {aboutPageData.heroSubtitle && (
              <p className={styles.heroSubtitle}>{aboutPageData.heroSubtitle}</p>
            )}
          </section>
        )}

        {aboutPageData?.storyTitle && aboutPageData?.storyBody && (
          <Reveal>
            <section className={styles.story}>
              <h2 className={styles.storyTitle}>{aboutPageData.storyTitle}</h2>
              <div className={styles.storyBody}>
                {aboutPageData.storyBody.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </main>

      {homeSections?.blockSection && (
        <Reveal>
          <Block locale={currentLocale} data={homeSections.blockSection} />
        </Reveal>
      )}

      {homeSections?.partnerSection && (
        <Reveal>
          <Partner data={homeSections.partnerSection} />
        </Reveal>
      )}

      {contactData && <Contacts locale={currentLocale} data={contactData} />}
    </>
  );
}
