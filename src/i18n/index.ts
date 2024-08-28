import type { InitOptions } from 'i18next'

import enJson from '@/i18n/locales/en.json'
import jaJson from '@/i18n/locales/ja.json'

export const defaultNS = 'translation'

export const resources = {
  en: {
    [defaultNS]: enJson,
  },
  ja: {
    [defaultNS]: jaJson,
  },
} as const

export const initOptions: InitOptions = {
  debug: true,
  lng: 'en',
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
}
