import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { initOptions } from '@/i18n'

const i18nForUI = i18n.createInstance()
i18nForUI.use(initReactI18next).init(initOptions)

export default i18nForUI
