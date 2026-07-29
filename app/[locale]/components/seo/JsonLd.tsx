import type { JsonLdObject } from '@/lib/jsonld';

interface JsonLdProps {
  /** Один об'єкт або масив — кожна сторінка передає власний набір,
   * побудований через helper-функції з lib/jsonld.ts. */
  data: JsonLdObject | JsonLdObject[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
