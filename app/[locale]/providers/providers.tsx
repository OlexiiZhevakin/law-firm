"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"   // або "system"
      enableSystem={false}  // якщо не хочеш брати системну тему
    >
      {children}
    </ThemeProvider>
  );
}
