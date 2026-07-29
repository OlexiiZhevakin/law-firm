"use client";

import styles from "./CookieSettingsLink.module.scss";
import CookieSettingsTrigger from "./CookieSettingsTrigger";

interface CookieSettingsLinkProps {
  locale: "uk" | "en";
}

// Дозволяє передумати щодо cookies пізніше: рендериться у Footer для обох
// локалей і знову показує CookieBanner, незалежно від того, що вже збережено
// в localStorage (сам вибір там не чіпає, лише відкриває банер повторно).
export default function CookieSettingsLink({ locale }: CookieSettingsLinkProps) {
  return (
    <CookieSettingsTrigger className={styles.link}>
      {locale === "uk" ? "Налаштування cookies" : "Cookie Settings"}
    </CookieSettingsTrigger>
  );
}
