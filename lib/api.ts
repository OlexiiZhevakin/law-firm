// Отримуємо базовий URL нашого Strapi (локально або на сервері)
export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1331';
}

// Універсальна функція для всіх GET-запитів до Strapi
export async function fetchStrapi(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  try {
    // Перетворюємо об'єкт параметрів (наприклад, { locale: 'uk', populate: '*' }) у строку запиту
    const queryString = new URLSearchParams(
      Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = String(value);
        }
        return acc;
      }, {})
    ).toString();

    const requestUrl = `${getStrapiURL()}/api/${endpoint}${queryString ? `?${queryString}` : ''}`;

    // Робимо запит (з ревалідацією раз на 60 секунд для швидкодії)
    const response = await fetch(requestUrl, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      // Статус/URL — дешево (без читання body) і саме цього бракувало, коли
      // діагностували "Failed to fetch data from about-page" (виявився 400
      // ValidationError через відсутнє на сервері поле, а не rate-limit/timeout,
      // як спершу здавалось) — без status тут довелось би гадати наосліп.
      throw new Error(`Failed to fetch data from ${endpoint}: ${response.status} ${response.statusText} (${requestUrl})`);
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

// fetchStrapi вже підтримує довільні query-параметри (напр. filters[slug][$eq]=...),
// але для collection-type endpoint'ів Strapi завжди повертає масив, навіть якщо
// фільтр звужує вибірку до одного запису. Ця обгортка розпаковує перший елемент,
// щоб сторінки типу app/[locale]/services/[slug] отримували один об'єкт або null.
export async function fetchStrapiBySlug(endpoint: string, slug: string, params: Record<string, string> = {}) {
  const entries = await fetchStrapi(endpoint, {
    ...params,
    'filters[slug][$eq]': slug,
  });

  return Array.isArray(entries) ? entries[0] ?? null : entries;
}

export interface ServicePageSummary {
  slug: string;
  h1: string;
  metaDescription?: string;
}

// Спільний запит списку всіх опублікованих service-page для конкретної локалі —
// використовується і на app/[locale]/services (лістинг), і потенційно будь-де,
// де знадобиться той самий перелік, щоб не дублювати fetchStrapi-виклик.
export async function fetchServicePages(locale: string): Promise<ServicePageSummary[]> {
  const pages = await fetchStrapi('service-pages', {
    locale,
    'fields[0]': 'slug',
    'fields[1]': 'h1',
    'fields[2]': 'metaDescription',
    'pagination[pageSize]': '100',
  });

  return Array.isArray(pages) ? pages : [];
}

// "contact" — окремий Strapi single-type (той самий підхід, що вже є для header/footer):
// дані контактного блоку/форми не прив'язані до home-page, тому їх можна незалежно
// зафетчити з будь-якої сторінки (головна, service-page) без дублювання populate-запиту.
export async function fetchContactData(locale: string) {
  return fetchStrapi('contact', { locale, populate: '*' });
}
