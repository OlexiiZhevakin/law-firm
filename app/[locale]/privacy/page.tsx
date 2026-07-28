import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';
import type { Locale } from '@/lib/routes';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  return generatePageMetadata({
    locale: (locale as Locale) || 'uk',
    path: '/privacy',
    title: {
      uk: 'Політика приватності',
      en: 'Privacy Policy',
    },
    description: {
      uk: 'Як HARLIB збирає, використовує та захищає персональні дані, надані через harlib.com.ua.',
      en: 'How HARLIB collects, uses and protects personal data submitted through harlib.com.ua.',
    },
  });
}

// Візуально відмінний плейсхолдер — щоб було очевидно з першого погляду,
// що це НЕ фінальний юридичний текст, якщо сторінку випадково задеплоять
// до того, як юрист компанії надасть переклад.
function TranslationPlaceholder() {
  return (
    <p style={{ marginBottom: '40px', fontStyle: 'italic', opacity: 0.55 }}>
      [Текст цього розділу очікує перекладу від юриста компанії — НЕ заповнювати автоперекладом]
    </p>
  );
}

// Оригінальна (затверджена) англомовна версія — контент не змінювався.
function PrivacyPolicyEn() {
  return (
    <main className="container" style={{ padding: '120px 15px 80px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>

      <h1 style={{ fontSize: '36px', marginBottom: '32px', fontWeight: '600' }}>Privacy Policy</h1>

      <p style={{ marginBottom: '16px' }}>
        <strong>HARLIB</strong> (&quot;<strong>we</strong>&quot;, &quot;<strong>us</strong>&quot;, &quot;<strong>our</strong>&quot;) respects your privacy and is committed to processing your personal data lawfully, transparently and responsibly. This Privacy Policy (the &quot;<strong>Policy</strong>&quot;) explains what personal data we collect through our website <strong>harlib.com.ua</strong> (the &quot;<strong>Website</strong>&quot;), how and why we process it, and the rights available to you.
      </p>
      <p style={{ marginBottom: '40px' }}>
        This Policy does not apply to information provided to us in the course of a client engagement, which is protected by professional secrecy, legal privilege and confidentiality obligations under the relevant engagement terms and applicable law.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>1. What personal data we collect</h2>
      <p style={{ marginBottom: '12px' }}>
        <strong>1.1. Consultation and contact form.</strong> When you complete the form on the Website, you may provide your name, email address, telephone number (if you choose to), the organisation you represent (if provided) and a brief description of your enquiry, which you enter voluntarily. Please share only high-level information at this stage and do not submit confidential or privileged details through the form.
      </p>
      <p style={{ marginBottom: '12px' }}>
        <strong>1.2. Direct contact.</strong> If you contact us by email, telephone or messenger using the details on the Website, we process your contact data and the content of your message in order to respond.
      </p>
      <p style={{ marginBottom: '12px' }}>
        <strong>1.3. Cookies.</strong> The Website uses cookies — small text files stored on your device by your browser. This section serves as our cookie notice; we do not maintain a separate cookie policy. We use two categories:
      </p>
      <div style={{ paddingLeft: '20px', marginBottom: '40px' }}>
        <p style={{ marginBottom: '12px' }}>
          <strong>1.3.1. Functional cookies.</strong> These are necessary for the Website to work and to remember your language and consent preferences. When you visit the Website, our server also logs technical data such as your IP address, access date and time, pages viewed, browser type and language, and operating system. Functional cookies do not require your consent; you may block them in your browser, but parts of the Website may then not work properly.
        </p>
        <p>
          <strong>1.3.2. Optional (analytics) cookies.</strong> We use these only after you give consent through the cookie banner shown on your first visit. The Website uses <strong>Google Analytics 4</strong>, a service of Google Ireland Limited and Google LLC (&quot;Google&quot;), to produce aggregated statistics about how the Website is used so that we can improve it. Google acts as our processor; the resulting reports do not identify individual visitors, and Google Analytics 4 does not store IP addresses. You may withdraw your consent at any time through the cookie settings on the Website or by installing Google&apos;s Analytics Opt-out Browser Add-on. Further information is available in Google&apos;s own privacy documentation.
        </p>
      </div>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>2. How we obtain your personal data</h2>
      <p style={{ marginBottom: '40px' }}>
        You are not required to provide any personal data. Where we hold data about you, we have obtained it because you provided it — by completing the contact form, contacting us directly, or consenting to optional cookies — or generated it automatically as limited technical data when you browse the Website.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>3. How we use your personal data</h2>
      <p style={{ marginBottom: '40px' }}>
        We use your personal data to receive and respond to your enquiries; to communicate with you and, where relevant, prepare for a possible engagement; to operate, secure and improve the Website; to comply with our legal, regulatory and professional obligations; and to establish, exercise or defend legal claims. We do not sell your personal data and do not use it for automated decision-making that produces legal effects on you.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>4. Legal basis for processing</h2>
      <p style={{ marginBottom: '40px' }}>
        Where the GDPR applies, we rely on your consent (for enquiries and optional cookies), on steps taken at your request before a possible engagement, on our legitimate interests (operating and securing the Website and protecting our rights), and on compliance with our legal obligations. Where Ukrainian law applies, we process data on the grounds permitted by the Law of Ukraine &quot;On Personal Data Protection&quot;, including your consent and our legitimate interests.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>5. Who we share your personal data with</h2>
      <p style={{ marginBottom: '40px' }}>
        We treat your personal data as confidential and disclose it only where necessary: to trusted service providers acting on our behalf under appropriate safeguards (website hosting, IT and email providers, and Google for analytics); to public authorities, courts or regulators where required by law or a lawful request; to a successor in connection with a reorganisation or merger, subject to appropriate protections; and to other recipients with your consent. Processors are bound by contract to process data only on our instructions and to apply appropriate security measures.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>6. International transfers</h2>
      <p style={{ marginBottom: '40px' }}>
        To operate the Website and respond to enquiries, your data may be processed in or transferred to countries outside your own jurisdiction, including through service providers located abroad. Where transfers involve data protected under the GDPR, we ensure an appropriate transfer mechanism is in place. In particular, where you consent to analytics cookies, data collected through Google Analytics may be transferred to Google servers, including in the United States, supported by safeguards such as the EU–U.S. Data Privacy Framework and standard contractual clauses.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>7. How long we keep your personal data</h2>
      <p style={{ marginBottom: '40px' }}>
        We retain personal data only for as long as necessary for the purposes for which it was collected, or as required to meet our legal, regulatory and professional obligations. Enquiry data is kept for the period needed to handle your request and assess a possible engagement, after which it is deleted or anonymised, unless a longer period is justified — for example, to comply with statutory requirements or to defend legal claims.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>8. How we protect your personal data</h2>
      <p style={{ marginBottom: '40px' }}>
        We apply technical and organisational measures appropriate to the data to protect it against unauthorised access, loss, misuse or disclosure, and anyone processing data on our behalf is bound by confidentiality obligations. No transmission over the internet is completely secure, so please avoid sending confidential information through the Website form.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>9. Your rights</h2>
      <p style={{ marginBottom: '40px' }}>
        Subject to applicable law, you have the right to access your personal data; to have it corrected or deleted; to restrict or object to certain processing; to data portability; to withdraw your consent at any time without affecting processing carried out beforehand; and to lodge a complaint with a supervisory authority. In Ukraine, this is the Ukrainian Parliament Commissioner for Human Rights; if you are in the EEA or the UK, you may also contact your local data-protection authority. To exercise your rights, contact us using the details below; we may need to verify your identity first.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>10. Changes to this Policy</h2>
      <p style={{ marginBottom: '40px' }}>
        We may update this Policy from time to time to reflect changes in our practices or applicable law. The current version is always available on the Website. We encourage you to review it periodically.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>11. Data Controller</h2>
      <p style={{ marginBottom: '16px' }}>
        The controller responsible for personal data processed through the Website is:
      </p>
      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <p style={{ margin: 0 }}>
          <strong>Individual Entrepreneur Haryk Matosian</strong> (Фізична особа-підприємець Матосян Гарик Лернікович), operating under the HARLIB brand, registered in the Unified State Register of Legal Entities, Individual Entrepreneurs and Public Formations of Ukraine on 1 December 2023, record No. 2010350000000461691.
        </p>
      </div>
      <p style={{ marginBottom: '40px' }}>
        Correspondence address: GNRTR Coworking, 3 Mykhaila Hrushevskoho St., Kyiv, 01001, Ukraine<br />
        Email: <strong>matosian@harlib.com.ua</strong>
      </p>

      <p style={{ fontSize: '14px', opacity: 0.7, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '20px' }}>
        The Website and this Policy are governed by the laws of Ukraine, without prejudice to any mandatory rights you may have under the data-protection law of your country of residence.
      </p>

    </main>
  );
}

// Українська версія: лише структура/заголовки перекладені. Текст розділів —
// плейсхолдери до того, як юрист компанії надасть офіційний переклад.
// НЕ заповнювати автоперекладом.
function PrivacyPolicyUk() {
  return (
    <main className="container" style={{ padding: '120px 15px 80px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>

      <h1 style={{ fontSize: '36px', marginBottom: '32px', fontWeight: '600' }}>Політика приватності</h1>

      <TranslationPlaceholder />
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>1. Які персональні дані ми збираємо</h2>
      <TranslationPlaceholder />

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>1.1. Форма зв&apos;язку та консультації</h3>
      <TranslationPlaceholder />

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>1.2. Пряме звернення</h3>
      <TranslationPlaceholder />

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>1.3. Файли cookie</h3>
      <TranslationPlaceholder />

      <div style={{ paddingLeft: '20px', marginBottom: '40px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>1.3.1. Функціональні файли cookie</h4>
        <TranslationPlaceholder />

        <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>1.3.2. Необов&apos;язкові (аналітичні) файли cookie</h4>
        <TranslationPlaceholder />
      </div>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>2. Як ми отримуємо ваші персональні дані</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>3. Як ми використовуємо ваші персональні дані</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>4. Правові підстави обробки</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>5. Кому ми розкриваємо ваші персональні дані</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>6. Міжнародні передачі даних</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>7. Як довго ми зберігаємо ваші персональні дані</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>8. Як ми захищаємо ваші персональні дані</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>9. Ваші права</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>10. Зміни до цієї Політики</h2>
      <TranslationPlaceholder />

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>11. Контролер персональних даних</h2>
      <TranslationPlaceholder />

      <p style={{ fontSize: '14px', opacity: 0.7, borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '20px' }}>
        [Прикінцевий абзац про застосовне право — очікує перекладу від юриста компанії]
      </p>

    </main>
  );
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (locale === 'uk') {
    return <PrivacyPolicyUk />;
  }

  return <PrivacyPolicyEn />;
}
