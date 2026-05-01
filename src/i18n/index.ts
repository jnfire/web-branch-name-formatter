import { createI18n } from 'vue-i18n'
import en from './en.json'
import es from './es.json'

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.split('-')[0] || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
})

export default i18n
