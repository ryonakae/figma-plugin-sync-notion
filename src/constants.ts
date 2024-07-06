import type { ClientStorageOptions, DocumentOptions } from '@/types/common'

export const SETTINGS_KEY = 'sync-message-studio'

export const DEFAULT_DOCUMENT_OPTIONS: DocumentOptions = {
  apiUrl: '',
  integrationToken: '',
  databaseId: '',
  keyPropertyName: '',
}

export const DEFAULT_CLIENT_STORAGE_OPTIONS: ClientStorageOptions = {
  valuePropertyName: '',
  withHighlight: false,
  usingCache: false,
}
