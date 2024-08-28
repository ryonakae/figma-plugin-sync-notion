import type { Options } from '@/types/common'

export const SETTINGS_KEY = 'sync-notion'
export const CACHE_KEY = 'sync-notion-cache'
export const GROUP_ID_KEY = 'sync-notion-group-id'

export const DEFAULT_WIDTH = 400

export const DEFAULT_OPTIONS: Options = {
  // fetch
  selectedTabKey: 'fetch',
  proxyUrl: '',
  integrationToken: '',
  databaseId: '',
  keyPropertyName: '',
  valuePropertyName: '',
  // list
  filterString: '',
  sortValue: 'created_time',
  sortOrder: 'descending',
  selectedRowId: null,
  scrollPosition: 0,
  // utilities
  targetTextRange: 'selection',
  includeComponents: true,
  includeInstances: false,
  // settings
  pluginLanguage: 'en',
}
