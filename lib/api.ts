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

// "services-page" — окремий Strapi single-type (той самий "own single-type per
// shared UI piece" підхід, що header/footer/contact) — наразі тримає лише
// вступний абзац над карткою-лістингом на /services. На відміну від інших
// типів (service-page, about-page тощо), Public role тут НЕ має дозволу
// find (підтверджено: неавторизований GET -> 403) — лише сам API-токен
// має find на цей конкретний тип (підтверджено: GET з токеном -> 200), тож
// цей запит, на відміну від fetchStrapi/fetchServicePages, свідомо йде з
// Authorization-заголовком. Токен без префіксу NEXT_PUBLIC_ — лишається
// server-only, у клієнтський бандл не потрапляє. Guard на споживчому боці
// (порожній рядок -> null нижче) — сторінка мусить рендеритись нормально
// навіть без цього поля.
export async function fetchServicesPageData(locale: string): Promise<{ introText?: string } | null> {
  try {
    const token = process.env.STRAPI_SERVICE_PAGES_API_TOKEN;
    const res = await fetch(`${getStrapiURL()}/api/services-page?locale=${locale}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

// Повертає slug того самого документа (той самий Strapi documentId — service-page's
// slug більше НЕ спільний між uk/en, кожна локаль має власне значення) в ІНШІЙ
// локалі, або null, якщо такої локалізації не існує. Відсутність локалізації —
// ОЧІКУВАНИЙ стан для деяких сторінок (напр. crypto-сторінка існує лише в en,
// без uk-пари), а не помилка, тож свідомо НЕ йде через fetchStrapi (який пише
// console.error на кожен !ok — це заспамило б лог на кожному звичайному
// відвідуванні en/services/crypto).
export async function fetchServicePageSlugInLocale(
  documentId: string,
  locale: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${getStrapiURL()}/api/service-pages/${documentId}?locale=${locale}&fields[0]=slug`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.slug ?? null;
  } catch {
    return null;
  }
}
