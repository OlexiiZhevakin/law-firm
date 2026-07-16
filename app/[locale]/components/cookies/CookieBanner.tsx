"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./CookieBanner.module.scss";

interface CookieBannerProps {
  locale: string;
}

type ConsentState = "pending" | "granted" | "denied";

const STORAGE_KEY = "harlib_cookie_consent";

export default function CookieBanner({ locale }: CookieBannerProps) {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<ConsentState>("pending");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored === "granted" || stored === "denied" ? stored : "pending");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleChoice = (choice: "granted" | "denied") => {
    localStorage.setItem(STORAGE_KEY, choice);
    setConsent(choice);
  };

  const text =
    locale === "uk"
      ? {
        title: "Ми поважаємо вашу приватність",
        // Для української версії крапка стоїть одразу в кінці речення, бо посилання немає
        desc: "Цей сайт використовує необхідні файли cookie для належної роботи, а також аналітичні файли cookie (Google Analytics 4), щоб покращити ваш досвід. Аналітичні файли збирають агреговані дані без ідентифікації користувачів і будуть активовані лише за вашої згоди.",
        accept: "Прийняти всі",
        reject: "Відхилити аналітику",
        policy: "",
      }
      : {
        title: "We value your privacy",
        // Для англійської версії крапки в кінці немає, бо далі буде пробіл і посилання
        desc: "This website uses essential cookies for proper functionality and analytics cookies (Google Analytics 4) to improve your experience. Analytics cookies collect aggregated data without identifying users and will only be activated with your explicit consent",
        accept: "Accept All",
        reject: "Reject Non-Essential",
        policy: "Privacy Policy",
      };

  // Поки не змонтувались — взагалі нічого не рендеримо.
  // Це усуває блимання банера при оновленні сторінки.
  if (!mounted) {
    return null;
  }

  // Якщо користувач погодився, додаємо скрипти Google Analytics
  if (consent === "granted") {
    return (
      <>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PLXGLCQLSF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PLXGLCQLSF', { page_path: window.location.pathname });
          `}
        </Script>
      </>
    );
  }

  // Якщо відмовився, нічого не рендеримо (аналітика не запускається)
  if (consent === "denied") {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-live="polite" aria-labelledby="cookie-banner-title">
      <div className={styles.banner}>
        <div className={styles.content}>
          <h3 id="cookie-banner-title" className={styles.title}>{text.title}</h3>
          <p className={styles.description}>
            {text.desc}

            {/* Рендеримо посилання ТІЛЬКИ на англійській версії сайту */}
            {locale === "en" && (
              <>
                {" "}
                <Link href={`/${locale}/privacy-policy`} className={styles.link}>
                  {text.policy}
                </Link>
                .
              </>
            )}
          </p>
        </div>
        <div className={styles.buttons}>
          <button type="button" onClick={() => handleChoice("denied")} className={styles.rejectBtn}>
            {text.reject}
          </button>
          <button type="button" onClick={() => handleChoice("granted")} className={styles.acceptBtn}>
            {text.accept}
          </button>
        </div>
      </div>
    </div>
  );
}