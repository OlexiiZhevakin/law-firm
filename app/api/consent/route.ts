import { NextResponse } from 'next/server';
import { getStrapiURL } from '@/lib/api';

interface ConsentPayload {
  consentId: string;
  choice: 'granted' | 'denied';
  timestamp: number;
  policyVersion: string;
  locale: string;
}

function isValidPayload(body: unknown): body is ConsentPayload {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;

  return (
    typeof b.consentId === 'string' && b.consentId.length > 0 &&
    (b.choice === 'granted' || b.choice === 'denied') &&
    typeof b.timestamp === 'number' && Number.isFinite(b.timestamp) &&
    typeof b.policyVersion === 'string' && b.policyVersion.length > 0 &&
    typeof b.locale === 'string' && b.locale.length > 0
  );
}

// Серверний доказ факту й часу cookie-згоди (для GDPR/ePrivacy аудиту) —
// пише в Strapi collection type `consent-log` через API-токен зі скоупом
// лише на create. Викликається fire-and-forget з CookieBanner.tsx: якщо
// цей запис не вдався, вибір користувача в localStorage все одно застосовується.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!isValidPayload(body)) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const token = process.env.STRAPI_CONSENT_API_TOKEN;
  if (!token) {
    console.error('STRAPI_CONSENT_API_TOKEN не задано — запис consent-log пропущено');
    return NextResponse.json({ success: false }, { status: 500 });
  }

  try {
    const response = await fetch(`${getStrapiURL()}/api/consent-logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          consentId: body.consentId,
          choice: body.choice,
          consentTimestamp: new Date(body.timestamp).toISOString(),
          policyVersion: body.policyVersion,
          locale: body.locale,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Strapi consent-log відповів ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Не вдалося записати consent-log у Strapi:', error);
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
