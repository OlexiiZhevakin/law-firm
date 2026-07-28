"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./CookieBanner.module.scss";
import { GA_MEASUREMENT_ID } from "@/lib/constants";

interface CookieBannerProps {
  locale: string;
}

type Choice = "granted" | "denied";
type ConsentState = "pending" | Choice;

interface StoredConsent {
  choice: Choice;
  timestamp: number;
  policyVersion: string;
}

const STORAGE_KEY = "harlib_cookie_consent";
// Стабільний per-browser ідентифікатор (НЕ прив'язаний до особи) — потрібен,
// щоб серверний consent-log можна було співставити з конкретним записом у
// localStorage цього браузера в разі спору/перевірки.
const CONSENT_ID_KEY = "harlib_consent_id";
// Бампати при суттєвій зміні того, які cookie/скрипти ставляться на сайті.
const POLICY_VERSION = "1.0";

// CookieSettingsLink (Footer) диспатчить цю подію, щоб знову показати банер
// незалежно від того, що вже збережено в localStorage.
export const COOKIE_SETTINGS_EVENT = "harlib:open-cookie-settings";

function getOrCreateConsentId(): string {
  const existing = localStorage.getItem(CONSENT_ID_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(CONSENT_ID_KEY, id);
  return id;
}

function readStoredConsent(): StoredConsent | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.choice === "granted" || parsed.choice === "denied") {
      return {
        choice: parsed.choice,
        timestamp: typeof parsed.timestamp === "number" ? parsed.timestamp : Date.now(),
        policyVersion: parsed.policyVersion || POLICY_VERSION,
      };
    }
  } catch {
    // Старий формат (голий рядок "granted"/"denied") або пошкоджені дані — вважаємо, що згоди ще не було
  }

  return null;
}

export default function CookieBanner({ locale }: CookieBannerProps) {
  const [mounted, setMounted] = useState(false);
  const [consent, setConsent] = useState<ConsentState>("pending");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored?.choice ?? "pending");
    setShowBanner(!stored);
    setMounted(true);
  }, []);

  // Дає змогу передумати пізніше: CookieSettingsLink у Footer відкриває банер
  // повторно, навіть якщо вибір уже збережено в localStorage.
  useEffect(() => {
    const openSettings = () => setShowBanner(true);
    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const handleChoice = (choice: Choice) => {
    const timestamp = Date.now();
    const record: StoredConsent = { choice, timestamp, policyVersion: POLICY_VERSION };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    setConsent(choice);
    setShowBanner(false);

    // Серверний доказ факту й часу згоди — best-effort: якщо запис не вдався
    // (мережа, Strapi недоступний), вибір користувача вище вже застосовано
    // і не відкочується.
    const consentId = getOrCreateConsentId();
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ consentId, choice, timestamp, policyVersion: POLICY_VERSION, locale }),
    }).catch((error) => {
      console.error("Не вдалося записати consent-log:", error);
    });
  };

  const text =
    locale === "uk"
      ? {
        title: "Ми поважаємо вашу приватність",
        desc: "Цей сайт використовує необхідні файли cookie для належної роботи, а також аналітичні файли cookie (Google Analytics 4), щоб покращити ваш досвід. Аналітичні файли збирають агреговані дані без ідентифікації користувачів і будуть активовані лише за вашої згоди.",
        learnMore: "Детальніше — у нашій",
        accept: "Прийняти всі",
        reject: "Відхилити аналітику",
        policy: "Політиці приватності",
      }
      : {
        title: "We value your privacy",
        desc: "This website uses essential cookies for proper functionality and analytics cookies (Google Analytics 4) to improve your experience. Analytics cookies collect aggregated data without identifying users and will only be activated with your explicit consent.",
        learnMore: "Learn more in our",
        accept: "Accept All",
        reject: "Reject Non-Essential",
        policy: "Privacy Policy",
      };

  // Поки не змонтувались — взагалі нічого не рендеримо.
  // Це усуває блимання банера при оновленні сторінки.
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Єдине місце в застосунку, звідки вантажиться GA — лише після granted */}
      {consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}

      {showBanner && (
        <div className={styles.overlay} role="dialog" aria-live="polite" aria-labelledby="cookie-banner-title">
          <div className={styles.banner}>
            <div className={styles.content}>
              <h3 id="cookie-banner-title" className={styles.title}>{text.title}</h3>
              <p className={styles.description}>
                {text.desc}{" "}
                {text.learnMore}{" "}
                <Link href={`/${locale}/privacy`} className={styles.link}>
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
      )}
    </>
  );
}
