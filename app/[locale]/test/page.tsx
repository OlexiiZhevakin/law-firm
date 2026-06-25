

// import { getStrapiData } from "../lib/strapi";





// export default async function Page() {
//   const strapiData = await getStrapiData("/api/home-page");

//   const { title, description } = strapiData.data;

//   return (
//     <section>
//       <h1>{title}</h1>
//       <p>{description}</p>
//     </section>
//   );
// }


// pages/[locale]/index.tsx

// app/[locale]/test/page.tsx


import { getStrapiData } from "../lib/strapi";

interface HomePageData {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

interface StrapiResponse<T> {
  data: T | null;
  meta: object;
}

export default async function Test({ params }: { params: Promise<{ locale: string }> }) {
  // ✅ розпаковуємо params як Promise
  const { locale } = await params;

  // ✅ правильний запит до Single Type з локалізацією
  const strapiData: StrapiResponse<HomePageData> | null = await getStrapiData(
    `/api/home-page?locale=${locale}`
  );

  if (!strapiData || !strapiData.data) {
    return <p>Контент для цієї мови ще не опублікований</p>;
  }

  const { title, description } = strapiData.data;

  return (
    <section>
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  );
}






