import { createI18n } from 'vue-i18n'
import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import de from './de.json'
import it from './it.json'
import pt from './pt.json'

type MessageSchema = typeof en

export const supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

const STORAGE_KEY_UI_LANG = 'app-ui-language'

const getStoredLocale = (): SupportedLocale | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_UI_LANG)
    if (saved && supportedLocales.includes(saved as SupportedLocale)) {
      return saved as SupportedLocale
    }
  } catch {
    // fallback if localStorage is not accessible
  }
  return null
}

const browserLocale = (typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en') as SupportedLocale
const initialLocale = getStoredLocale() || (supportedLocales.includes(browserLocale) ? browserLocale : 'en')

const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    fr,
    de,
    it,
    pt
  }
})

export const getUiLanguage = (): SupportedLocale => {
  const globalI18n = i18n.global as any
  const loc = globalI18n.locale.value ?? globalI18n.locale
  return (loc as SupportedLocale) || initialLocale
}

export const setUiLanguage = (locale: SupportedLocale): void => {
  if (supportedLocales.includes(locale)) {
    const globalI18n = i18n.global as any
    if (typeof globalI18n.locale.value !== 'undefined') {
      globalI18n.locale.value = locale
    } else {
      globalI18n.locale = locale
    }
    try {
      localStorage.setItem(STORAGE_KEY_UI_LANG, locale)
    } catch {
      // ignore
    }
  }
}

export default i18n
