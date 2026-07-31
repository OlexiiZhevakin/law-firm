

import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scrollToTop/ScrollToTop";
import CookieBanner from "./components/cookies/CookieBanner";
import QuickContactButton from "./components/quickContact/QuickContactButton";
import JsonLd from "./components/seo/JsonLd";
import { fetchContactData, getStrapiURL } from "@/lib/api";
import { buildOrganizationJsonLd, buildSiteNavigationJsonLd } from "@/lib/jsonld";
import { BASE_URL, GOOGLE_SITE_VERIFICATION } from "@/lib/constants";
import type { Locale } from "@/lib/routes";

const locales = ["uk", "en"];

// 300 прибрано: реально використовувався лише в порожньому стані /services
// ("сторінок ще немає"), який зараз майже ніколи не рендериться (10 реальних
// service-page записів) — не вартий окремого файлу шрифту.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// 700 прибрано: жодного реального використання в коді не знайдено (перевірено
// по всіх .scss з font-family: 'Playfair Display').
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
});

// next/font має вбудований автоматичний preload (документована поведінка —
// "якщо шрифт викликаний у root layout, він преloadиться на всіх маршрутах"),
// але емпірично (перевірено по реальному HTML і dev, і production білду)
// жодного <link rel="preload" as="font"> для Inter/Playfair не з'являлося —
// PageSpeed бачив лише HTML → CSS-чанк (@font-face) → woff2, класичний
// критичний ланцюжок на ~922мс. Схоже, автопреload next/font не спрацьовує
// надійно для повністю динамічних (ƒ) маршрутів — а тут усі сторінки саме
// такі через headers()-виклик під nonce-based CSP (див. нижче й
// "Config/security" у CLAUDE.md), не щось, що можна прибрати заради цього.
//
// Замість здогадок/хардкоду хешованих імен файлів (next/font перегенеровує
// їх на кожен білд — хардкод зламався б на першому ж редеплої) читаємо той
// самий next-font-manifest.json, який Next.js сам генерує під час білду й
// сам використовує для цієї ж функції — тобто завжди актуальний, синхронний
// з поточним білдом список. Це внутрішній build-артефакт (не публічне API),
// тож обгорнуто в try/catch із порожнім фолбеком: якщо шлях/формат колись
// зміниться в новій версії Next.js, сторінка просто не отримає ці preload-
// підказки, а не впаде.
function getFontPreloadHrefs(): string[] {
  const candidatePaths = [
    // turbopackIgnore: без цієї підказки Turbopack бачить path.join(process.cwd(), ...)
    // як потенційно динамічний require і трасує (NFT) увесь проєкт "про всяк
    // випадок" — попереджає про це прямим текстом при білді. Шлях і так лише
    // для читання відомого build-артефакту нижче, нічого справді динамічного.
    //
    // Production-білд (next build && next start) — те, що реально аудіює
    // Lighthouse/PSI.
    path.join(/*turbopackIgnore: true*/ process.cwd(), ".next", "server", "next-font-manifest.json"),
    // npm run dev (Turbopack dev-сервер пише манифест в інше місце) —
    // потрібно лише для локальної перевірки, продуктивність дев-режиму
    // нерелевантна для самого аудиту.
    path.join(/*turbopackIgnore: true*/ process.cwd(), ".next", "dev", "server", "next-font-manifest.json"),
  ];

  for (const manifestPath of candidatePaths) {
    try {
      const manifest = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ manifestPath, "utf-8")) as {
        app?: Record<string, string[]>;
      };
      const files = new Set<string>();
      for (const list of Object.values(manifest.app ?? {})) {
        for (const file of list) files.add(file);
      }
      if (files.size > 0) {
        return [...files].map((file) => `/_next/${file}`);
      }
    } catch {
      // Пробуємо наступний шлях (dev/prod манифести лежать по-різному).
    }
  }

  return [];
}

const fontPreloadHrefs = getFontPreloadHrefs();


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

  // x-nonce проставляється в proxy.ts на кожен запит (nonce-based CSP замість
  // script-src 'unsafe-inline') — виклик headers() тут заразом форсує
  // динамічний рендер усього дерева під цим layout, що й потрібно для nonce.
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang={locale}>
      <head>
        {/* Явний preload для woff2-файлів Inter/Playfair (див. коментар біля
            getFontPreloadHrefs вище) — без нього браузер дізнається про ці
            файли лише розпарсивши CSS-чанк, що й давало критичний ланцюжок
            HTML → CSS → шрифт (~922мс за Lighthouse). Ставимо це першим у
            <head>, перед іншими підказками — це найкритичніший ресурс для
            First Contentful Paint без "невидимого" тексту. */}
        {fontPreloadHrefs.map((href) => (
          <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="anonymous" />
        ))}
        {/* Прискорює з'єднання до Strapi (uploads-зображення: фото Гаріка,
            лого) — той самий origin, що вже в images.remotePatterns/CSP. */}
        <link rel="preconnect" href={getStrapiURL()} />
        {/* Мінімальна Organization — стосується всього сайту. Детальний
            LegalService/Person живе на /about, найрелевантнішій сторінці.
            SiteNavigationElement поруч — підказка Google для sitelinks,
            теж спільна для всього сайту, не по-сторінкова. Без @id-посилань
            між цими двома вузлами, тож плоский масив, без buildJsonLdGraph. */}
        <JsonLd
          data={[
            buildOrganizationJsonLd(locale as Locale),
            buildSiteNavigationJsonLd(locale as Locale),
          ]}
          nonce={nonce}
        />
      </head>
      <body className={`${inter.className} ${playfair.className}`}>
        <Header params={{ locale: locale as "uk" | "en" }} />
        <main>{children}</main>
        <Footer params={{ locale: locale as "uk" | "en" }} />
        <ScrollToTop />
        <QuickContactButton locale={locale as "uk" | "en"} data={contactData} />
        {/* Єдине місце, звідки вантажиться GA — лише після consent === "granted" всередині CookieBanner */}
        <CookieBanner locale={locale} nonce={nonce} />
      </body>
    </html>
  );
}