import { NextRequest, NextResponse } from 'next/server';
import { fetchStrapiBySlug, fetchServicePageSlugInLocale } from '@/lib/api';

// Використовується виключно LangSwitch.tsx (клієнтський компонент) на
// сторінках /services/[slug] — Header/LangSwitch рендеряться в
// app/[locale]/layout.tsx, сиблінгом до самої сторінки (не батько/дитина),
// тож пряме прокидання пропсів із серверного компонента сторінки
// неможливе. Це маленький внутрішній проксі до Strapi: приймає поточний
// slug/локаль і бажану локаль, повертає slug ТОГО САМОГО documentId у
// цільовій локалі (або null, якщо такої локалізації не існує — напр.
// crypto-сторінка існує лише в en).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const fromLocale = searchParams.get('fromLocale');
  const toLocale = searchParams.get('toLocale');

  if (!slug || !fromLocale || !toLocale) {
    return NextResponse.json({ slug: null }, { status: 400 });
  }

  const page = await fetchStrapiBySlug('service-pages', slug, {
    locale: fromLocale,
    'fields[0]': 'slug',
  });

  if (!page?.documentId) {
    return NextResponse.json({ slug: null });
  }

  const alternateSlug = await fetchServicePageSlugInLocale(page.documentId, toLocale);
  return NextResponse.json({ slug: alternateSlug });
}
