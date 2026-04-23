export type Locale = 'uk' | 'en';

export const messages: Record<Locale, {
  header: {
    home: string;
    about: string;
    services: string;
    contacts: string;
    form: string;
  };
  footer: {
    rights: string;
    privacy: string;
    terms: string;
  };
  // можна додавати нові блоки тут
  sidebar: {
    login: string;
    register: string;
  };
}> = {
  uk: {
    header: {
      home: "Головна",
      about: "Про компанію",
      services: "Послуги",
      contacts: "Контакти",
      form: "Запис на консультацію",
    },
    footer: {
      rights: "Всі права захищені",
      privacy: "Політика конфіденційності",
      terms: "Умови використання",
    },
    sidebar: {
      login: "Увійти",
      register: "Реєстрація",
    }
  },
  en: {
    header: {
      home: "Home",
      about: "About",
      services: "Services",
      contacts: "Contacts",
      form: "Consultation",
    },
    footer: {
      rights: "All rights reserved",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
    },
    sidebar: {
      login: "Login",
      register: "Register",
    }
  }
};
