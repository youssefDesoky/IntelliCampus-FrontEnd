import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enAdminAside from '../locales/en/admin/aside.json';
import arAdminAside from '../locales/ar/admin/aside.json';

import enStudentAside from '../locales/en/student/aside.json';
import arStudentAside from '../locales/ar/student/aside.json';

import enInstructorAside from '../locales/en/instractor/aside.json';
import arInstructorAside from '../locales/ar/instractor/aside.json';

import enCommonAside from '../locales/en/common/aside.json';
import arCommonAside from '../locales/ar/common/aside.json';

import enInstructorAside from '../locales/en/instructor/aside.json';
import arInstructorAside from '../locales/ar/instructor/aside.json';

// Initialize i18n
i18n.use(initReactI18next).init({
  resources: {
    en: {
      'admin/aside': enAdminAside,
      'common/aside': enCommonAside,
      'student/aside': enStudentAside,
      'instructor/aside': enInstructorAside,
    },
    ar: {
      'admin/aside': arAdminAside,
      'common/aside': arCommonAside,
      'student/aside': arStudentAside,
      'instructor/aside': arInstructorAside,
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