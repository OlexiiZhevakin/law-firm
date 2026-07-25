// app/components/JsonLd.tsx
export default function JsonLd({ locale }: { locale: string }) {
  const isUk = locale === 'uk';
  const baseUrl = 'https://harlib.com.ua';

  const jsonLd = [
    {
      // 1. СУТНІСТЬ САЙТУ
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": isUk ? "HARLIB Юридичний Бутик" : "HARLIB Law Boutique",
      "url": baseUrl,
    },
    {
      // 2. СУТНІСТЬ КОМПАНІЇ
      "@context": "https://schema.org",
      "@type": "LegalService",
      "name": isUk ? "HARLIB Юридичний Бутик" : "HARLIB Law Boutique",
      "url": `${baseUrl}/${locale}`,
      "logo": `${baseUrl}/icon.png`,
      "image": `${baseUrl}/og-image.jpg`,
      "description": isUk
        ? "HARLIB — юридичний бутік для банків, страхових і небанківських фінансових установ, фінтех-компаній і крипто-сервісів — в Україні, ЄС, Великобританії та Азії."
        : "HARLIB is a legal boutique for banks, insurance and non-bank financial institutions, fintech companies and crypto-services — in Ukraine, the EU, the UK, and Asia.",

      "telephone": "+380933490202",
      "email": "info@harlib.com.ua",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": isUk ? "вулиця Михайла Грушевського, 3" : "3 Mykhaila Hrushevskoho St",
        "addressLocality": isUk ? "Київ" : "Kyiv",
        "addressRegion": isUk ? "Київська область" : "Kyiv region",
        "postalCode": "01001",
        "addressCountry": "UA"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "20:00"
      }
    },
    {
      // 3. СУТНІСТЬ КЛЮЧОВОЇ ОСОБИ (Засновник / Керівник)
      "@context": "https://schema.org",
      "@type": "Person",
      // 👇 Замініть на повне ПІБ Гаріка (або іншого керівника) 👇
      "name": isUk ? "Гарик Матосян" : "Haryk Matosian",
      "jobTitle": isUk ? "Керуючий партнер" : "Managing Partner",
      "url": `${baseUrl}/${locale}`,
      // 👇 Вставте правильне посилання на фотографію 👇
      "image": `${baseUrl}/фото-керівника.jpg`,
      "worksFor": {
        "@type": "LegalService",
        "name": "HARLIB"
      },
      "sameAs": [
        // 👇 Додайте реальне посилання на LinkedIn 👇
        "https://www.linkedin.com/in/ваше-посилання"
      ]
    }
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}