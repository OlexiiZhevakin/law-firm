

// import type { Metadata } from "next";
// import { Inter, Playfair_Display } from "next/font/google";
// import "./globals.css";
// import { notFound } from "next/navigation";
// import Header from "./components/header/Header";
// import Footer from "./components/footer/Footer";
// import ScrollToTop from "./components/scrollToTop/ScrollToTop";
// import CookieBanner from "./components/cookies/CookieBanner";

// const locales = ["uk", "en"];

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600"],
// });

// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
// });

// export const metadata: Metadata = {
//   title: "HARLIB | Financial Law Boutique",
//   description: "Юридичний бутик для фінансового сектору.",
// };

// export default async function RootLayout({
//   children,
//   params,
// }: {
//   children: React.ReactNode;
//   params: Promise<{ locale: string }>;
// }) {
//   // 1. Чекаємо на розпаковку params
//   const { locale } = await params;

//   // 2. Валідуємо мову
//   if (!locales.includes(locale)) {
//     notFound();
//   }

//   return (
//     <html lang={locale}>
//       <body className={`${inter.className} ${playfair.className}`}>
//         {/* 👇 ТУТ ВИПРАВЛЕНО: передаємо реальну локаль, яку отримав Layout! */}
//         <Header params={{ locale: locale as 'uk' | 'en' }} />

//         <main>{children}</main>

//         {/* 👇 Сюди теж передаємо, щоб футер знав, яку мову рендерити */}
//         <Footer params={{ locale: locale as 'uk' | 'en' }} />
        
//         <ScrollToTop/>
//         <CookieBanner locale={locale} />
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

const locales = ["uk", "en"];

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// ПРОФЕСІЙНА ГЕНЕРАЦІЯ МЕТАТЕГІВ ДЛЯ HARLIB
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isUk = locale === "uk";

  // Ваш офіційний домен
  const baseUrl = "https://harlib.com.ua";

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: isUk ? "HARLIB | Юридичний бутик фінансового права" : "HARLIB | Financial Law Boutique",
      template: "%s | HARLIB",
    },

    description: isUk
      ? "HARLIB — професійний юридичний бутик, що спеціалізується на фінансовому секторі, корпоративному праві та супроводі інвестицій."
      : "HARLIB is a professional law boutique specializing in the financial sector, corporate law, and investment support.",

    keywords: isUk
      ? ["юридичний бутик", "фінансове право", "юристи для бізнесу", "корпоративне право", "HARLIB", "адвокати", "юридичні послуги Україна"]
      : ["law boutique", "financial law", "business lawyers", "corporate law", "HARLIB", "attorneys", "legal services Ukraine"],

    authors: [{ name: "HARLIB Law Boutique", url: baseUrl }],
    creator: "HARLIB",

    alternates: {
      canonical: `/${locale}`,
      languages: {
        uk: "/uk",
        en: "/en",
        "x-default": "/uk",
      },
    },

    openGraph: {
      type: "website",
      locale: isUk ? "uk_UA" : "en_US",
      url: `/${locale}`,
      siteName: "HARLIB",
      title: isUk ? "HARLIB | Фінансовий юридичний бутик" : "HARLIB | Financial Law Boutique",
      description: isUk
        ? "Експертна юридична підтримка для вашого бізнесу у фінансовому секторі."
        : "Expert legal support for your business in the financial sector.",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "HARLIB Logo",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: isUk ? "HARLIB | Юридичний бутик" : "HARLIB | Law Boutique",
      description: isUk
        ? "Професійний супровід фінансового сектору."
        : "Professional support for the financial sector.",
      images: ["/og-image.jpg"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
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

  return (
    <html lang={locale}>
      <body className={`${inter.className} ${playfair.className}`}>
        <Header params={{ locale: locale as "uk" | "en" }} />
        <main>{children}</main>
        <Footer params={{ locale: locale as "uk" | "en" }} />
        <ScrollToTop />
        <CookieBanner locale={locale} />

        {/* КОД PLERDY (пряма вставка для проходження перевірки) */}
        <script
          type="text/javascript"
          defer
          data-plerdy_code="1"
          dangerouslySetInnerHTML={{
            __html: `
              var _protocol="https:"==document.location.protocol?"https://":"http://";
              _site_hash_code = "736019acc6769eaefdd2fde1da546f57",_suid=78560, plerdyScript=document.createElement("script");
              plerdyScript.setAttribute("defer",""),plerdyScript.dataset.plerdymainscript="plerdymainscript",
              plerdyScript.src="https://a.plerdy.com/public/js/click/main.js?v="+Math.random();
              var plerdymainscript=document.querySelector("[data-plerdymainscript='plerdymainscript']");
              plerdymainscript&&plerdymainscript.parentNode.removeChild(plerdymainscript);
              try{document.head.appendChild(plerdyScript)}catch(t){console.log(t,"unable add script tag")}
            `,
          }}
        />
      </body>
    </html>
  );
}