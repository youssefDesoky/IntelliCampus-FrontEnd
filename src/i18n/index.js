import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enStudentAside from '../locales/en/student/aside.json';
import arStudentAside from '../locales/ar/student/aside.json';
import enCommonAside from '../locales/en/common/aside.json';
import arCommonAside from '../locales/ar/common/aside.json';

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      'student/aside': enStudentAside,
      'common/aside': enCommonAside,
    },
    ar: {
      'student/aside': arStudentAside,
      'common/aside': arCommonAside
    },
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: 'en',
  debug: true,
  defaultNS: 'student/aside',
  interpolation: {
    escapeValue: false,
  }
});

i18n.on("languageChanged", (lng) => {
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr"
})

export default i18n;