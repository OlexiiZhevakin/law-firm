

// import type { Metadata } from "next";
// import { Inter, Playfair_Display } from "next/font/google";
// import "./globals.css";
// import { notFound } from "next/navigation";
// import Header from "./components/header/Header";
// import Footer from "./components/footer/Footer";
// import ScrollToTop from "./components/scrollToTop/ScrollToTop";
// import CookieBanner from "./components/cookies/CookieBanner";
// import { GoogleAnalytics } from "@next/third-parties/google";

// const locales = ["uk", "en"];

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
// });

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
// });


// // ПРОФЕСІЙНА ГЕНЕРАЦІЯ МЕТАТЕГІВ ДЛЯ HARLIB
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ locale: string }>;
// }): Promise<Metadata> {
//   const { locale } = await params;
//   const isUk = locale === "uk";

//   // Ваш офіційний домен
//   const baseUrl = "https://harlib.com.ua";

//   return {
//     metadataBase: new URL(baseUrl),

//     // 👇 ДОДАЙ ЦЕЙ БЛОК ДЛЯ GOOGLE SEARCH CONSOLE 👇
//     verification: {
//       google: "ajEeltqhnCaDdkrysooitKpCvmRwhLTtdBcWm9icdyA", // Встав сюди код від Google
//     },
//     // 👆 -------------------------------------- 👆

//     title: {
//       default: isUk ? "HARLIB | Юридичний бутик фінансового права" : "HARLIB | Financial Law Boutique",
//       template: "%s | HARLIB",
//     },

//     description: isUk
//       ? "HARLIB — професійний юридичний бутик, що спеціалізується на фінансовому секторі, корпоративному праві та супроводі інвестицій."
//       : "HARLIB is a professional law boutique specializing in the financial sector, corporate law, and investment support.",

//     keywords: isUk
//       ? ["юридичний бутик", "фінансове право", "юристи для бізнесу", "корпоративне право", "HARLIB", "адвокати", "юридичні послуги Україна"]
//       : ["law boutique", "financial law", "business lawyers", "corporate law", "HARLIB", "attorneys", "legal services Ukraine"],

//     authors: [{ name: "HARLIB Law Boutique", url: baseUrl }],
//     creator: "HARLIB",

//     alternates: {
//       canonical: `/${locale}`,
//       languages: {
//         uk: "/uk",
//         en: "/en",
//         "x-default": "/uk",
//       },
//     },

//     openGraph: {
//       type: "website",
//       locale: isUk ? "uk_UA" : "en_US",
//       url: `/${locale}`,
//       siteName: "HARLIB",
//       title: isUk ? "HARLIB | Фінансовий юридичний бутик" : "HARLIB | Financial Law Boutique",
//       description: isUk
//         ? "Експертна юридична підтримка для вашого бізнесу у фінансовому секторі."
//         : "Expert legal support for your business in the financial sector.",
//       images: [
//         {
//           url: "/og-image.jpg",
//           width: 1200,
//           height: 630,
//           alt: "HARLIB Logo",
//         },
//       ],
//     },

//     twitter: {
//       card: "summary_large_image",
//       title: isUk ? "HARLIB | Юридичний бутик" : "HARLIB | Law Boutique",
//       description: isUk
//         ? "Професійний супровід фінансового сектору."
//         : "Professional support for the financial sector.",
//       images: ["/og-image.jpg"],
//     },

//     robots: {
//       index: true,
//       follow: true,
//       googleBot: {
//         index: true,
//         follow: true,
//         "max-video-preview": -1,
//         "max-image-preview": "large",
//         "max-snippet": -1,
//       },
//     },
//   };
// }

// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   const { locale } = await params;

//   if (!locales.includes(locale)) {
//     notFound();
//   }

//   return (
//     <html lang={locale}>
//       <body className={`${inter.className} ${playfair.className}`}>
//         <Header params={{ locale: locale as "uk" | "en" }} />
//         <main>{children}</main>
//         <Footer params={{ locale: locale as "uk" | "en" }} />
//         <ScrollToTop />
//         <CookieBanner locale={locale} />
//         <GoogleAnalytics gaId="G-PLXGLCQLSF" />
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { notFound } from "next/navigation";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import CookieBanner from "./components/cookies/CookieBanner";
import QuickContactButton from "./components/quickContact/QuickContactButton";
import JsonLd from "./components/seo/JsonLd";
import { fetchContactData } from "@/lib/api";
import { buildOrganizationJsonLd } from "@/lib/jsonld";
import { BASE_URL, GOOGLE_SITE_VERIFICATION } from "@/lib/constants";
import type { Locale } from "@/lib/routes";

const locales = ["uk", "en"];

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});


// Тільки те, що справді спільне для КОЖНОЇ сторінки сайту — title/description/OG/
// keywords/robots тепер живуть у generateMetadata() кожної окремої сторінки
// (через generatePageMetadata()), інакше вони не будуть по-сторінковими.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isUk = locale === "uk";

  return {
    metadataBase: new URL(BASE_URL),

    verification: {
      google: GOOGLE_SITE_VERIFICATION,
    },

    title: {
      default: isUk
        ? "HARLIB | Юридичний бутик фінансового та корпоративного права"
        : "HARLIB | Financial & Corporate Law Boutique",
      template: "%s | HARLIB",
    },

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon.png", type: "image/png", sizes: "192x192" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // Той самий contact single-type, що й Header/ContactButton — Next.js дедуплікує
  // однакові fetch-виклики в межах одного рендеру, тож зайвого запиту до Strapi нема.
  const contactData = await fetchContactData(locale);

  return (
    <html lang={locale}>
      <head>
        {/* Мінімальна Organization — стосується всього сайту. Детальний
            LegalService/Person живе на /about, найрелевантнішій сторінці. */}
        <JsonLd data={buildOrganizationJsonLd(locale as Locale)} />
      </head>
      <body className={`${inter.className} ${playfair.className}`}>
        <Header params={{ locale: locale as "uk" | "en" }} />
        <main>{children}</main>
        <Footer params={{ locale: locale as "uk" | "en" }} />
        <ScrollToTop />
        <QuickContactButton locale={locale as "uk" | "en"} data={contactData} />
        {/* Єдине місце, звідки вантажиться GA — лише після consent === "granted" всередині CookieBanner */}
        <CookieBanner locale={locale} />
      </body>
    </html>
  );
}