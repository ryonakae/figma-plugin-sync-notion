import type { Options } from '@/types/common'

export const SETTINGS_KEY = 'sync-message-studio'

export const DEFAULT_OPTIONS: Options = {
  selectedTab: '設定',
  apiUrl: '',
  integrationToken: '',
  databaseId: '',
  keyPropertyName: '',
  valuePropertyName: '',
  withHighlight: false,
  usingCache: false,
}
