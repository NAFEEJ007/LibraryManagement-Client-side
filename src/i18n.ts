import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import bnTranslation from './locales/bn.json';

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
  bn: { translation: bnTranslation }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values safely
    }
  });

export default i18n;
