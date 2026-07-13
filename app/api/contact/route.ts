import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, company, email, phone, message } = await req.json();

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
      from: `"Сайт HARLIB" <${process.env.SMTP_USER}>`,
      to: "info@harlib.com.ua", // Листи будуть падати на корпоративну пошту
      replyTo: email, // Дозволить відповідати клієнту напряму
      subject: `Нова заявка на консультацію від: ${name}`,
      html: `
        <h3>Нова заявка з сайту</h3>
        <p><b>Ім'я:</b> ${name}</p>
        <p><b>Компанія:</b> ${company}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Телефон:</b> ${phone}</p>
        <p><b>Повідомлення:</b> ${message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Помилка відправки Nodemailer:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}