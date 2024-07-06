import type { ClientStorageOptions, DocumentOptions } from '@/types/common'
import type { EventHandler } from '@create-figma-plugin/utilities'

interface LoadDocumentOptionsHandler extends EventHandler {
  name: 'LOAD_DOCUMENT_OPTIONS'
  handler: (options: DocumentOptions) => void
}

interface LoadClientStorageOptionsHandler extends EventHandler {
  name: 'LOAD_CLIENT_STORAGE_OPTIONS'
  handler: (options: ClientStorageOptions) => void
}

interface SaveDocumentOptionsHandler extends EventHandler {
  name: 'SAVE_DOCUMENT_OPTIONS'
  handler: (options: DocumentOptions) => void
}

interface SaveClientStorageOptionsHandler extends EventHandler {
  name: 'SAVE_CLIENT_STORAGE_OPTIONS'
  handler: (options: ClientStorageOptions) => void
}

interface NotifyHandler extends EventHandler {
  name: 'NOTIFY'
  handler: (options: { message: string; options?: NotificationOptions }) => void
}

interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW'
  handler: (windowSize: { width: number; height: number }) => void
}
