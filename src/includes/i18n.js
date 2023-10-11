import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import am from '../locales/am.json'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    am
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    am: {
      currency: {
        style: 'currency',
        currency: 'ETB'
      }
    }
  }
})
