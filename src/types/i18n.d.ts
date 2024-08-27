import 'react-i18next'

import type ns from '@/locales/en.json'
import type { defaultNS, resources } from '@/ui/i18n'

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: {
      ns: (typeof resources)['en']
    }
  }
}
