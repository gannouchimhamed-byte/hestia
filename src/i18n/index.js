import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './en.json'
import fr from './fr.json'
import ar from './ar.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'ar'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    initImmediate: false,
    react: { useSuspense: false },
  })

// Apply RTL + font when language changes
function applyLangToDOM(lang) {
  const html = document.documentElement
  html.setAttribute('lang', lang)
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  // Cairo for Arabic, Inter for EN/FR
  if (lang === 'ar') {
    html.style.fontFamily = "'Cairo', 'Inter', sans-serif"
  } else {
    html.style.fontFamily = "'Inter', sans-serif"
  }
}

i18n.on('languageChanged', applyLangToDOM)
applyLangToDOM(i18n.language)

export default i18n
