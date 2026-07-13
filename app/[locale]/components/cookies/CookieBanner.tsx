"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./CookieBanner.module.scss";

interface CookieBannerProps {
  locale: string;
}

type ConsentState = "pending" | "granted" | "denied";

const STORAGE_KEY = "harlib_cookie_consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage-consent-change", callback);
  return () => window.removeEventListener("storage-consent-change", callback);
}

function getSnapshot(): ConsentState {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "granted" || stored === "denied" ? stored : "pending";
}

function getServerSnapshot(): ConsentState {
  return "pending";
}

export default function CookieBanner({ locale }: CookieBannerProps) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleChoice = (choice: "granted" | "denied") => {
    localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new Event("storage-consent-change"));
  };

  const text =
    locale === "uk"
      ? {
        title: "Ми поважаємо вашу приватність",
        desc: "Цей сайт використовує необхідні файли cookie для належної роботи, а також аналітичні файли cookie (Google Analytics 4), щоб покращити ваш досвід. Аналітичні файли збирають агреговані дані без ідентифікації користувачів і будуть активовані лише за вашої згоди.",
        accept: "Прийняти всі",
        reject: "Відхилити аналітику",
        policy: "Політика конфіденційності",
      }
      : {
        title: "We value your privacy",
        desc: "This website uses essential cookies for proper functionality and analytics cookies (Google Analytics 4) to improve your experience. Analytics cookies collect aggregated data without identifying users and will only be activated with your explicit consent.",
        accept: "Accept All",
        reject: "Reject Non-Essential",
        policy: "Privacy Policy",
      };

  if (consent === "granted") {
    return (
      <>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', { page_path: window.location.pathname });
          `}
        </Script>
      </>
    );
  }

  if (consent === "denied") {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-live="polite">
      <div className={styles.banner}>
        <div className={styles.content}>
          <h3 className={styles.title}>{text.title}</h3>
          <p className={styles.description}>
            {text.desc}{" "}
            <Link href={`/${locale}/privacy-policy`} className={styles.link}>
              {text.policy}
            </Link>
            .
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