
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