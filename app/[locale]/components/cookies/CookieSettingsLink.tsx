"use client";

import styles from "./CookieSettingsLink.module.scss";
import { COOKIE_SETTINGS_EVENT } from "./CookieBanner";

interface CookieSettingsLinkProps {
  locale: "uk" | "en";
}

// Дозволяє передумати щодо cookies пізніше: рендериться у Footer для обох
// локалей і знову показує CookieBanner, незалежно від того, що вже збережено
// в localStorage (сам вибір там не чіпає, лише відкриває банер повторно).
export default function CookieSettingsLink({ locale }: CookieSettingsLinkProps) {
  return (
    <button
      type="button"
      className={styles.link}
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
    >
      {locale === "uk" ? "Налаштування cookies" : "Cookie Settings"}
    </button>
  );
}
