import Reveal from "../components/reveal/Reveal"
import About from "./section/about/About"
import Block from "./section/block/Block"
import Contacts from "./section/contacts/Contacts"
import Head from "./section/head/Head"
import Partner from "./section/partner/Partner"
import Services from "./section/services/Services"
import { fetchStrapi } from '@/lib/api'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = locale as 'uk' | 'en';

  // Отримуємо дані для сторінки, вказуючи всі секції, які нам потрібні
  const homeData = await fetchStrapi('home-page', {
    locale: currentLocale,
    'populate[headSection][populate]': '*',
    'populate[aboutSection][populate]': '*',
    'populate[blockSection][populate]': '*',
    'populate[partnerSection][populate]': '*',
    'populate[servicesSection][populate][clusters][populate][items]': '*',
    'populate[contactsSection][populate][phones]': '*',
  });

  return (
    <>
      <Head
        locale={currentLocale}
        data={homeData?.headSection}
      />
      <Reveal>
        <About
          locale={currentLocale}
          data={homeData?.aboutSection}
        />
      </Reveal>

      <Reveal>
        <Block
          locale={currentLocale}
          data={homeData?.blockSection}
        />
      </Reveal>
      <Reveal>
        <Partner
          // locale={currentLocale}
          data={homeData?.partnerSection}
        />
      </Reveal>
      <Reveal>
        <Services
          locale={currentLocale}
          data={homeData?.servicesSection}
        />
      </Reveal>

      <Reveal>
        <Contacts
          locale={currentLocale}
          data={homeData?.contactsSection} />
      </Reveal>

    </>
  );
}