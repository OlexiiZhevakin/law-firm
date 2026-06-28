import About from "./section/about/About"
import Block from "./section/block/Block"
import Contacts from "./section/contacts/Contacts"
import Head from "./section/head/Head"
import Partner from "./section/partner/Partner"
import Services from "./section/services/Services"

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      {/* Обов'язково передаємо поточну мову в кожен компонент! */}
      <Head locale={locale as 'uk' | 'en'} />
      <About locale={locale as 'uk' | 'en'} />
      <Block locale={locale as 'uk' | 'en'} />
      <Partner locale={locale as 'uk' | 'en'} />
      <Services locale={locale as 'uk' | 'en'} />
      <Contacts locale={locale as 'uk' | 'en'} />
    </>
  );
}
