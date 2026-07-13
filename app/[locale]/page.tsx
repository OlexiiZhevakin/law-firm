
import HomePage from "./home/page";

interface PageProps {
  params: Promise<{ locale: string }>
}

// 1. Приймаємо params від Next.js тут, у корінній сторінці
export default async function Home({ params }: PageProps) {
  return (
    // 2. 👇 Передаємо ці params всередину твого компонента HomePage
    <HomePage params={params} />
  );
}


// import { permanentRedirect } from 'next/navigation';
// import HomePage from "./home/page";

// interface PageProps {
//   // Залишаємо strict-тип Next.js, але обробляємо його безпечно
//   params: Promise<{ locale: string }>
// }

// export default async function Home({ params }: PageProps) {
//   // 1. Пробуємо розібрати параметри. На чистому "/" Next.js може кинути порожній об'єкт
//   const resolvedParams = await params as Record<string, string | undefined>;

//   // 2. Якщо мови немає в URL, миттєво робимо редирект і перериваємо виконання
//   if (!resolvedParams || !resolvedParams.locale) {
//     permanentRedirect('/uk');
//   }

//   // 3. Якщо ми дійшли сюди, значить locale точно є, і тип повністю сумісний із HomePage
//   return (
//     <HomePage params={params} />
//   );
// }