"use client";

import type { ReactNode } from "react";
import { COOKIE_SETTINGS_EVENT } from "./CookieBanner";

interface CookieSettingsTriggerProps {
  children: ReactNode;
  className?: string;
}

// Генеричний варіант того, що робить CookieSettingsLink — просто дозволяє
// довільний вміст кнопки замість жорстко заданого локалізованого тексту.
// Використовується і в Footer (через CookieSettingsLink), і в тексті
// cookies-policy сторінки (де сама фраза приходить із markdown-контенту).
export default function CookieSettingsTrigger({ children, className }: CookieSettingsTriggerProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}
    >
      {children}
    </button>
  );
}
