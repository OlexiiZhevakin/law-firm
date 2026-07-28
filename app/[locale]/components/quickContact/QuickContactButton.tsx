"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import ContactModal, { type ContactModalData } from "../contactModal/ContactModal";
import { COOKIE_BANNER_VISIBILITY_EVENT } from "../cookies/CookieBanner";
import styles from "./QuickContactButton.module.scss";

interface QuickContactButtonProps {
  locale: "uk" | "en";
  data: ContactModalData | null;
}

const BUBBLE_DISMISSED_KEY = "harlib_quick_contact_bubble_dismissed";
const BUBBLE_SHOW_DELAY_MS = 15000;
const BUBBLE_AUTO_HIDE_MS = 8000;

export default function QuickContactButton({ locale, data }: QuickContactButtonProps) {
  // Той самий mount-gate трюк, що в CookieBanner.tsx/ContactModal.tsx — уникає
  // flash/mismatch при гідратації.
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);

  const dismissBubble = () => {
    setBubbleVisible(false);
    localStorage.setItem(BUBBLE_DISMISSED_KEY, "1");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Бульбашка з'являється один раз за сесію (поки не очищено localStorage) —
  // якщо користувач уже закривав її раніше, більше не показуємо при переходах
  // між сторінками. Поки CookieBanner ще активний (consent "pending" або
  // повторно відкритий через "Налаштування cookies"), відлік не йде взагалі —
  // ефект просто виходить без запуску таймера, і React прибере попередній
  // таймер при наступному ре-запуску цього ефекту (див. dependency нижче).
  // Це не "пауза" з точним відновленням, а рестарт 15с після закриття банера —
  // саме так, щоб дві спливаючі підказки ніколи не показувались одночасно.
  useEffect(() => {
    if (cookieBannerVisible) return;
    if (localStorage.getItem(BUBBLE_DISMISSED_KEY)) return;

    const showTimer = setTimeout(() => setBubbleVisible(true), BUBBLE_SHOW_DELAY_MS);
    return () => clearTimeout(showTimer);
  }, [cookieBannerVisible]);

  // Якщо банер знову з'явився (напр. користувач відкрив "Налаштування cookies"
  // уже після появи бульбашки) — ховаємо бульбашку без позначення "закрито" в
  // localStorage, щоб вона могла коректно з'явитися ще раз після закриття банера.
  useEffect(() => {
    if (cookieBannerVisible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBubbleVisible(false);
    }
  }, [cookieBannerVisible]);

  // Автоматичне зникнення через кілька секунд після появи.
  useEffect(() => {
    if (!bubbleVisible) return;

    const hideTimer = setTimeout(dismissBubble, BUBBLE_AUTO_HIDE_MS);
    return () => clearTimeout(hideTimer);
  }, [bubbleVisible]);

  // Кнопка ховається, поки видимий CookieBanner — обидва fixed знизу екрана
  // й не повинні перекриватись.
  useEffect(() => {
    const handleVisibility = (e: Event) => {
      const { visible } = (e as CustomEvent<{ visible: boolean }>).detail;
      setCookieBannerVisible(visible);
    };

    window.addEventListener(COOKIE_BANNER_VISIBILITY_EVENT, handleVisibility);
    return () => window.removeEventListener(COOKIE_BANNER_VISIBILITY_EVENT, handleVisibility);
  }, []);

  if (!mounted || cookieBannerVisible) {
    return null;
  }

  return (
    <>
      <div className={styles.wrapper}>
        {bubbleVisible && (
          <div className={styles.bubble} role="status">
            <button
              type="button"
              className={styles.bubbleClose}
              onClick={dismissBubble}
              aria-label={locale === "uk" ? "Закрити" : "Close"}
            >
              &times;
            </button>
            <p>{locale === "uk" ? "Маєте питання? Напишіть нам" : "Have a question? Message us"}</p>
          </div>
        )}

        <button
          type="button"
          className={styles.fab}
          onClick={() => {
            setModalOpen(true);
            dismissBubble();
          }}
          aria-label={locale === "uk" ? "Швидкий зв'язок" : "Quick contact"}
        >
          <MessageCircle size={26} strokeWidth={2} />
        </button>
      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} locale={locale} data={data} />
    </>
  );
}
