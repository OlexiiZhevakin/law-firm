

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

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600"],
});

function getFontPreloadHrefs(): string[] {
  const candidatePaths = [

    path.join(/*turbopackIgnore: true*/ process.cwd(), ".next", "server", "next-font-manifest.json"),

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


  const contactData = await fetchContactData(locale);

  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html lang={locale}>
      <head>
        {fontPreloadHrefs.map((href) => (
          <link key={href} rel="preload" as="font" type="font/woff2" href={href} crossOrigin="anonymous" />
        ))}

        <link rel="preconnect" href={getStrapiURL()} />

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

        <CookieBanner locale={locale} nonce={nonce} />
      </body>
    </html>
  );
}