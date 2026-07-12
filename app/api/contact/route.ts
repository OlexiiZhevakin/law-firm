import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const { name, company, email, phone, message } = await req.json();

  // Налаштування пошти (використовуй .env змінні!)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // наприклад, smtp.gmail.com
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Сайт" <${process.env.SMTP_USER}>`,
      to: "olexiy.zhevakin@gmail.com",
      subject: "Нова заявка на консультацію",
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
    return NextResponse.json({ success: false }, { status: 500 });
  }
}