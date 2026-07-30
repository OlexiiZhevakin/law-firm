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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
