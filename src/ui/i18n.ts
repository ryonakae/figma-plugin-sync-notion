import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enJson from '@/locales/en.json'
import jaJson from '@/locales/ja.json'

export const defaultNS = 'translation'
export const resources = {
  en: {
    [defaultNS]: enJson,
  },
  ja: {
    [defaultNS]: jaJson,
  },
} as const

i18n.use(initReactI18next).init(
  {
    debug: true,
    lng: 'en',
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
  },
  error => {
    if (error) {
      console.error('error on i18n.init', error)
    }
  },
)

export default i18n
