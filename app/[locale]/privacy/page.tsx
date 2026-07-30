import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { generatePageMetadata } from '@/lib/metadata';
import { buildWebPageJsonLd } from '@/lib/jsonld';
import { BASE_URL } from '@/lib/constants';
import type { Locale } from '@/lib/routes';
import JsonLd from '../components/seo/JsonLd';

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

// Українська версія: реальний, юридично узгоджений текст від юриста компанії
// (content/legal/privacy-policy-uk.md). Структура/нумерація розділів навмисно
// НЕ збігається з англійською версією — цей документ написаний під Закон
// України "Про захист персональних даних" № 2297-VI, а не під GDPR, тому
// логіка розділів інша (рішення підтверджене власником компанії).
function PrivacyPolicyUk() {
  return (
    <main className="container" style={{ padding: '120px 15px 80px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>

      <h1 style={{ fontSize: '36px', marginBottom: '32px', fontWeight: '600' }}>Політика конфіденційності</h1>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>1. Загальні положення</h2>
      <p style={{ marginBottom: '16px' }}>
        Ця Політика конфіденційності (<strong>«Політика»</strong>) визначає порядок обробки персональних даних на сайті <strong>harlib.com.ua</strong> (<strong>«Сайт»</strong>) та у зв&apos;язку зі зверненнями, які надходять до нас через Сайт або електронну пошту.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Під персональними даними ми розуміємо відомості, за якими вас можна ідентифікувати — безпосередньо або в поєднанні з іншою інформацією, що є в нашому розпорядженні.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Політика поширюється на два випадки: коли ви переглядаєте Сайт і коли ви звертаєтесь до нас із запитом на юридичну допомогу. Обробка даних у межах уже укладеного договору додатково регулюється умовами такого договору; за розбіжностей пріоритет мають умови договору.
      </p>
      <p style={{ marginBottom: '40px' }}>
        Сайт містить посилання на зовнішні ресурси — реєстри, джерела законодавства, професійні платформи. Ми не контролюємо обробку даних на цих ресурсах і рекомендуємо ознайомитися з їхніми власними правилами до того, як залишати там будь-яку інформацію.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>2. Хто відповідає за обробку</h2>
      <p style={{ marginBottom: '16px' }}>
        Володільцем персональних даних у розумінні Закону України «Про захист персональних даних» № 2297-VI (<strong>«Закон»</strong>) є:
      </p>
      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 8px' }}>
          <strong>Фізична особа — підприємець Матосян Гарик Лернікович</strong>, який здійснює діяльність під комерційним позначенням <strong>HARLIB</strong>
        </p>
        <p style={{ margin: '0 0 8px' }}>
          Запис в Єдиному державному реєстрі юридичних осіб, фізичних осіб — підприємців та громадських формувань від 1 грудня 2023 року, № 2010350000000461691
        </p>
        <p style={{ margin: '0 0 8px' }}>
          Адреса для листування: GNRTR Coworking, вул. Михайла Грушевського, 3, м. Київ, 01001, Україна
        </p>
        <p style={{ margin: 0 }}>
          Електронна пошта: <strong>matosian@harlib.com.ua</strong>
        </p>
      </div>
      <p style={{ marginBottom: '40px' }}>
        Ми самостійно визначаємо мету та способи обробки і несемо відповідальність за дотримання Закону. Окремої відповідальної особи не призначено — усі звернення опрацьовуються за наведеною вище адресою.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>3. Коли ми отримуємо ваші дані</h2>
      <p style={{ marginBottom: '16px' }}>
        <strong>Перегляд Сайту.</strong> Частина даних надходить автоматично — через файли cookie та подібні технології. Це знеособлена статистика: тип пристрою і браузера, мова інтерфейсу, джерело переходу, переглянуті сторінки, тривалість візиту. Аналітичні технології вмикаються лише після вашої згоди.
      </p>
      <p style={{ marginBottom: '16px' }}>
        <strong>Звернення до нас.</strong> Дані надаєте ви самі — заповнюючи форму на Сайті або пишучи на нашу електронну пошту. Обов&apos;язковими є лише ім&apos;я та адреса для відповіді; решту ви повідомляєте на власний розсуд.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Ми не збираємо цілеспрямовано дані про стан здоров&apos;я, переконання, членство в об&apos;єднаннях та інші відомості про особисте життя. Просимо не надсилати їх через форму на Сайті.
      </p>
      <p style={{ marginBottom: '40px' }}>
        Якщо у зверненні ви повідомляєте дані інших осіб — керівників, працівників, контрагентів, — ви підтверджуєте, що маєте право їх передати та що ці особи поінформовані про обробку.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>4. Обсяг, мета та підстави обробки</h2>

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>4.1. Забезпечення роботи Сайту</h3>
      <p style={{ marginBottom: '8px' }}><strong>Дані:</strong> технічні відомості про пристрій і сесію; збережений вибір щодо файлів cookie.</p>
      <p style={{ marginBottom: '8px' }}><strong>Мета:</strong> підтримання працездатності Сайту, захист від зловживань та автоматизованих атак, усунення технічних збоїв, збереження обраної мови інтерфейсу.</p>
      <p style={{ marginBottom: '24px' }}><strong>Підстава:</strong> необхідність виконання нашого зобов&apos;язання надати вам доступ до Сайту та захист законних інтересів у його безперебійній і безпечній роботі.</p>

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>4.2. Аналітика відвідувань</h3>
      <p style={{ marginBottom: '8px' }}><strong>Дані:</strong> знеособлені технічні відомості про перегляди сторінок.</p>
      <p style={{ marginBottom: '8px' }}><strong>Мета:</strong> розуміння того, які матеріали становлять інтерес, і вдосконалення структури та змісту Сайту.</p>
      <p style={{ marginBottom: '24px' }}><strong>Підстава:</strong> ваша згода, надана через панель налаштувань файлів cookie. Згоду можна відкликати в будь-який момент.</p>

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>4.3. Опрацювання звернення</h3>
      <p style={{ marginBottom: '8px' }}><strong>Дані:</strong> ім&apos;я; електронна пошта; номер телефону; посада та компанія, якщо ви їх зазначили; зміст запиту та надіслані матеріали.</p>
      <p style={{ marginBottom: '8px' }}><strong>Мета:</strong> відповідь на запит, попереднє з&apos;ясування суті питання, узгодження формату та умов подальшої співпраці.</p>
      <p style={{ marginBottom: '24px' }}><strong>Підстава:</strong> ваше звернення як дія, спрямована на укладення договору, а також наш законний інтерес у веденні ділової комунікації.</p>

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>4.4. Перевірка перед прийняттям справи</h3>
      <p style={{ marginBottom: '8px' }}><strong>Дані:</strong> ім&apos;я; відомості про компанію, її структуру власності та керівництво — в обсязі, який вимагає конкретне питання.</p>
      <p style={{ marginBottom: '8px' }}><strong>Мета:</strong> перевірка відсутності конфлікту інтересів та ідентифікація клієнта до початку роботи.</p>
      <p style={{ marginBottom: '24px' }}><strong>Підстава:</strong> виконання вимог законодавства та професійних стандартів, а також наш законний інтерес у дотриманні цих стандартів.</p>

      <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>4.5. Ведення практики</h3>
      <p style={{ marginBottom: '8px' }}><strong>Дані:</strong> відомості, необхідні для оформлення договору, рахунків та первинних документів.</p>
      <p style={{ marginBottom: '8px' }}><strong>Мета:</strong> виконання договору, бухгалтерський і податковий облік, зберігання документів, захист прав у разі спору.</p>
      <p style={{ marginBottom: '24px' }}><strong>Підстава:</strong> виконання договору та обов&apos;язків, покладених на нас законодавством.</p>

      <p style={{ marginBottom: '16px' }}>
        Використання даних з метою, не зазначеною в цьому розділі, можливе лише якщо нова мета сумісна з первинною або якщо ми отримали від вас окрему згоду. У випадках, прямо передбачених законодавством, обробка може здійснюватися без згоди.
      </p>
      <p style={{ marginBottom: '40px' }}>
        <strong>Звернення до нас не створює відносин «клієнт — юридичний радник».</strong> До підтвердження нами відсутності конфлікту інтересів та узгодження умов співпраці просимо не надсилати відомостей, розкриття яких може вам зашкодити.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>5. Розкриття даних третім особам</h2>
      <p style={{ marginBottom: '16px' }}>
        Ми не продаємо персональні дані і не передаємо їх для чужих маркетингових цілей. Доступ можливий лише в обсязі, необхідному для цілей розділу 4, і лише:
      </p>
      <ul style={{ margin: '0 0 16px 20px', padding: 0 }}>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>постачальникам технічної інфраструктури — хостингу Сайту, системи керування контентом, електронної пошти, сервісу веб-аналітики;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>залученим спеціалістам — бухгалтеру, іншим радникам, перекладачам, коли цього вимагає ваше питання;</li>
        <li style={{ listStyle: 'disc' }}>судам, правоохоронним та іншим державним органам — на підставі рішення чи законної вимоги, обов&apos;язкової для виконання.</li>
      </ul>
      <p style={{ marginBottom: '40px' }}>
        Постачальники, які обробляють дані за нашим дорученням, діють виключно в межах наших вказівок, не мають права використовувати дані у власних цілях і зобов&apos;язані забезпечити їх конфіденційність та захист.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>6. Передача даних за межі України</h2>
      <p style={{ marginBottom: '16px' }}>
        Окремі постачальники технічної інфраструктури розташовані за межами України або обробляють дані на серверах в інших державах. Такі передачі здійснюються з дотриманням статті 29 Закону — за наявності належного рівня захисту в державі отримувача або на інших підставах, передбачених цією статтею, зокрема за вашою згодою чи для виконання договору.
      </p>
      <p style={{ marginBottom: '40px' }}>
        На запит ми повідомимо, який постачальник і в якій державі обробляє ваші дані.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>7. Строки зберігання</h2>
      <p style={{ marginBottom: '16px' }}>
        Дані зберігаються стільки, скільки необхідно для мети, з якою їх було зібрано, після чого знищуються або знеособлюються.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Визначаючи строк, ми враховуємо обсяг і характер даних, ризик шкоди у разі несанкціонованого доступу, можливість досягти мети іншим способом та вимоги законодавства щодо обов&apos;язкового зберігання документів.
      </p>
      <p style={{ marginBottom: '40px' }}>
        Окремі документи можуть зберігатися довше — коли це потрібно для виконання податкових обов&apos;язків, підтвердження виконаної роботи або захисту прав у спорі.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>8. Заходи безпеки</h2>
      <p style={{ marginBottom: '16px' }}>
        Ми застосовуємо технічні та організаційні заходи, співмірні з характером даних, зокрема:
      </p>
      <ul style={{ margin: '0 0 16px 20px', padding: 0 }}>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>шифроване з&apos;єднання із Сайтом та шифрування сховищ, у яких зберігаються робочі документи;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>багатофакторну автентифікацію для доступу до пошти, хостингу та системи керування контентом;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>ведення переліку осіб, які мають доступ до даних, із визначенням рівня такого доступу;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>письмові зобов&apos;язання про нерозголошення від кожної залученої особи;</li>
        <li style={{ listStyle: 'disc' }}>регулярне резервне копіювання та оновлення програмного забезпечення.</li>
      </ul>
      <p style={{ marginBottom: '40px' }}>
        Незалежно від цих заходів, відомості, отримані від клієнтів, охороняються як конфіденційна інформація та професійна таємниця. Цей обов&apos;язок діє і після завершення співпраці.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>9. Права суб&apos;єкта персональних даних</h2>
      <p style={{ marginBottom: '16px' }}>
        Стаття 8 Закону надає вам право:
      </p>
      <ul style={{ margin: '0 0 16px 20px', padding: 0 }}>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>знати про джерела збирання, місцезнаходження своїх персональних даних, мету їх обробки, а також відомості про володільця, розпорядника та осіб, які здійснюють обробку;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>отримувати інформацію про умови надання доступу до персональних даних третім особам та відомості про таких осіб;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>на доступ до своїх персональних даних;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>заперечувати проти обробки;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>вимагати зміни або знищення даних, якщо вони обробляються незаконно або є недостовірними;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>на захист даних від незаконної обробки, втрати, знищення чи пошкодження;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>вносити застереження щодо обмеження обробки;</li>
        <li style={{ listStyle: 'disc', marginBottom: '8px' }}>відкликати згоду на обробку;</li>
        <li style={{ listStyle: 'disc' }}>на захист від автоматизованого рішення, яке має для вас юридичні наслідки.</li>
      </ul>
      <p style={{ marginBottom: '16px' }}>
        Для реалізації будь-якого з цих прав напишіть на <strong>matosian@harlib.com.ua</strong>. Ми відповімо у строк, встановлений Законом. Перед наданням даних ми можемо попросити підтвердити особу — це необхідно, щоб не розкрити відомості сторонній людині.
      </p>
      <p style={{ marginBottom: '16px' }}>
        Ви також маєте право звернутися зі скаргою до Уповноваженого Верховної Ради України з прав людини. Будемо вдячні за можливість спершу розглянути ваше звернення самостійно.
      </p>
      <p style={{ marginBottom: '40px' }}>
        Відкликання згоди не робить незаконною обробку, здійснену до моменту відкликання. Після відкликання ми можемо продовжити обробку в обсязі, необхідному для виконання наших обов&apos;язків за законодавством або для захисту прав у спорі.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>10. Файли cookie</h2>
      <p style={{ marginBottom: '40px' }}>
        Перелік технологій, які використовуються на Сайті, їх призначення та строки дії наведені в окремому документі — <Link href="/uk/cookies-policy" style={{ textDecoration: 'underline' }}>Налаштування cookies</Link>. Там же можна змінити свій вибір.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>11. Зміни</h2>
      <p style={{ marginBottom: '40px' }}>
        Ми можемо оновлювати цю Політику — зокрема у разі змін у законодавстві або появи нових функцій на Сайті. Чинна редакція завжди доступна на цій сторінці.
      </p>

      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>12. Зворотний зв&apos;язок</h2>
      <p>
        Питання щодо цієї Політики надсилайте на <strong>matosian@harlib.com.ua</strong> або поштою: GNRTR Coworking, вул. Михайла Грушевського, 3, м. Київ, 01001, Україна.
      </p>

    </main>
  );
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'en' ? 'en' : 'uk';

  const webPageJsonLd = buildWebPageJsonLd({
    name: currentLocale === 'uk' ? 'Політика приватності' : 'Privacy Policy',
    description:
      currentLocale === 'uk'
        ? 'Як HARLIB збирає, використовує та захищає персональні дані, надані через harlib.com.ua.'
        : 'How HARLIB collects, uses and protects personal data submitted through harlib.com.ua.',
    url: `${BASE_URL}/${currentLocale}/privacy`,
  });
  const nonce = (await headers()).get('x-nonce') || undefined;

  return (
    <>
      <JsonLd data={webPageJsonLd} nonce={nonce} />
      {currentLocale === 'uk' ? <PrivacyPolicyUk /> : <PrivacyPolicyEn />}
    </>
  );
}
