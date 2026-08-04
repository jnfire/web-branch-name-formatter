import { createI18n } from 'vue-i18n'
import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import de from './de.json'
import it from './it.json'
import pt from './pt.json'

type MessageSchema = typeof en

const supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt'] as const
type SupportedLocale = (typeof supportedLocales)[number]

const browserLocale = navigator.language.split('-')[0] as SupportedLocale
const initialLocale = supportedLocales.includes(browserLocale) ? browserLocale : 'en'

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

export default i18n
