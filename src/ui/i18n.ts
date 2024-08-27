import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enJson from '@/locales/en.json'
import jaJson from '@/locales/ja.json'

export const defaultNS = 'ns'
export const resources = {
  en: enJson,
  ja: jaJson,
} as const

console.log('resources', resources)

i18n.use(initReactI18next).init({
  debug: true,
  lng: 'en',
  ns: [defaultNS],
  defaultNS,
  resources,
  // returnEmptyString: false,
  // interpolation: {
  //   escapeValue: false,
  // },
})

export default i18n
