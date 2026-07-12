// Отримуємо базовий URL нашого Strapi (локально або на сервері)
export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1331';
}

// Універсальна функція для всіх GET-запитів до Strapi
export async function fetchStrapi(endpoint: string, params: Record<string, string> = {}) {
  try {
    // Перетворюємо об'єкт параметрів (наприклад, { locale: 'uk', populate: '*' }) у строку запиту
    const queryString = new URLSearchParams(params).toString();
    const requestUrl = `${getStrapiURL()}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;

    // Робимо запит (з ревалідацією раз на 60 секунд для швидкодії)
    const response = await fetch(requestUrl, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }

    const json = await response.json();

    // Strapi v5 завжди загортає відповідь в об'єкт data, 
    // тому ми одразу повертаємо json.data, щоб не писати це в компонентах
    return json.data;

  } catch (error) {
    console.error("Strapi fetch error:", error);
    return null; // Повертаємо null у разі помилки, щоб сайт не "падав"
  }
}