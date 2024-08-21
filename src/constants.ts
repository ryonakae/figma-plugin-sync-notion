import type { Options } from '@/types/common'

export const SETTINGS_KEY = 'sync-notion'

export const DEFAULT_WIDTH = 400

export const DEFAULT_OPTIONS: Options = {
  // fetch
  selectedTab: 'Fetch',
  proxyUrl: '',
  integrationToken: '',
  databaseId: '',
  keyPropertyName: '',
  valuePropertyName: '',
  // list
  filterString: '',
  selectedRowId: null,
  // utilities
  targetTextRange: 'selection',
  includeComponents: true,
  includeInstances: false,
}
