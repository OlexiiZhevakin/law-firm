import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Екранування спецсимволів HTML перед вставкою користувацького вводу
// в html-тіло листа — без цього поле форми могло б зламати розмітку
// листа або вставити довільний HTML/посилання в лист, який відкриває команда.
function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: Request) {
  const { name, company, email, phone, message, consent, website } = await req.json();

  // Honeypot: приховане поле "website" — реальні користувачі його не бачать
  // і не заповнюють, боти зазвичай заповнюють усі поля форми. Якщо воно
  // непорожнє, тихо повертаємо "успіх", не відправляючи лист і не
  // підказуючи боту, що його виявили.
  if (typeof website === 'string' && website.trim() !== '') {
    return NextResponse.json({ success: true });
  }

  // Серверна валідація — клієнтський required/type="email" легко обійти
  // прямим запитом до /api/contact, тож обов'язкові поля й згода
  // перевіряються ще раз тут.
  const isValid =
    typeof name === 'string' && name.trim() !== '' &&
    typeof email === 'string' && EMAIL_RE.test(email) &&
    typeof phone === 'string' && phone.trim() !== '' &&
    consent === 'on';

  if (!isValid) {
    return NextResponse.json({ success: false, error: 'Invalid submission' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Сайт ${SITE_NAME}" <${process.env.SMTP_USER}>`,
      to: CONTACT_EMAIL, // Листи будуть падати на корпоративну пошту
      replyTo: email, // Дозволить відповідати клієнту напряму
      subject: `Нова заявка на консультацію від: ${escapeHtml(name)}`,
      html: `
        <h3>Нова заявка з сайту</h3>
        <p><b>Ім'я:</b> ${escapeHtml(name)}</p>
        <p><b>Компанія:</b> ${escapeHtml(company)}</p>
        <p><b>Email:</b> ${escapeHtml(email)}</p>
        <p><b>Телефон:</b> ${escapeHtml(phone)}</p>
        <p><b>Повідомлення:</b> ${escapeHtml(message)}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Помилка відправки Nodemailer:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
