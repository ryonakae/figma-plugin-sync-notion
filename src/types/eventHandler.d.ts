import type { Options } from '@/types/common'
import type { EventHandler } from '@create-figma-plugin/utilities'

interface LoadOptionsHandler extends EventHandler {
  name: 'LOAD_OPTIONS'
  handler: (options: Options) => void
}

interface SaveOptionsHandler extends EventHandler {
  name: 'SAVE_OPTIONS'
  handler: (options: Options) => void
}

interface NotifyHandler extends EventHandler {
  name: 'NOTIFY'
  handler: (options: { message: string; options?: NotificationOptions }) => void
}

interface ResizeWindowHandler extends EventHandler {
  name: 'RESIZE_WINDOW'
  handler: (windowSize: { width: number; height: number }) => void
}
