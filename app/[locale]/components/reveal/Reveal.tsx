'use client' // Обов'язково для роботи з браузерними API, такими як IntersectionObserver

import { useEffect, useRef, useState } from 'react'

interface RevealProps {
  children: React.ReactNode;
  className?: string; // Дозволяє додавати додаткові класи
}

export default function Reveal({ children, className = '' }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Налаштовуємо спостерігач (поріг 0.12 означає, що анімація почнеться, коли блок з'явиться на 12%)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Вимикаємо після появи, щоб не блимало туди-сюди
        }
      },
      { threshold: 0.12 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'in' : ''} ${className}`}
    >
      {children}
    </div>
  )
}