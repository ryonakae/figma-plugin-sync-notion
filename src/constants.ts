import type { Options } from '@/types/common'

export const SETTINGS_KEY = 'sync-notion'

export const DEFAULT_WIDTH = 400

export const DEFAULT_OPTIONS: Options = {
  selectedTab: 'Fetch',
  proxyUrl: '',
  integrationToken: '',
  databaseId: '',
  keyPropertyName: '',
  valuePropertyName: '',
  withHighlight: false,
  usingCache: false,
  fetching: false,
}
