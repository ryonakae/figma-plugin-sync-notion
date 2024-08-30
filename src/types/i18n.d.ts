import type { defaultNS, resources } from '@/ui/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false
    resources: (typeof resources)['en']
  }
}
