import type { JsonLdObject } from '@/lib/jsonld';

interface JsonLdProps {
  /** Один об'єкт або масив — кожна сторінка передає власний набір,
   * побудований через helper-функції з lib/jsonld.ts. */
  data: JsonLdObject | JsonLdObject[];
  /** x-nonce поточного запиту (з headers(), проставлений у proxy.ts) —
   * потрібен для nonce-based CSP замість script-src 'unsafe-inline'. */
  nonce?: string;
}

export default function JsonLd({ data, nonce }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      // Браузери навмисно ховають реальне значення атрибута nonce одразу
      // після вставки елемента в DOM (CSP security-фіча — запобігає читанню
      // nonce через JS, напр. зловмисним скриптом). Тому після гідратації
      // `element.nonce`/getAttribute('nonce') завжди повертає '', що не
      // збігається із серверним значенням — React логує це як hydration
      // mismatch, хоча реальний CSP-заголовок і сам nonce вже відпрацювали
      // коректно ще на етапі парсингу HTML, до гідратації. Підтверджено
      // офіційно: facebook/react#26028 (сам React поки не придушує це
      // попередження на своєму боці). suppressHydrationWarning тут — не
      // загальне вимкнення, а точкове визнання цього конкретного,
      // нешкідливого false positive саме для nonce.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
