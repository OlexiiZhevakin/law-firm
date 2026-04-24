"use client";

import { createContext, useState, ReactNode } from "react";

type ThemeContextType = {
  mode: "light" | "dark";
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "dark";
    }
    return "dark";
  });

  const toggle = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next); // 👈 тут зберігаємо
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ toggle, mode }}>
      <div className={`theme ${mode} page-layout`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};