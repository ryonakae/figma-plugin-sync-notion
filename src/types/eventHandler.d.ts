import type {
  NotionKeyValue,
  Options,
  PluginLanguage,
  TargetTextRange,
} from '@/types/common'
import type { EventHandler } from '@create-figma-plugin/utilities'

interface LoadOptionsFromUIHandler extends EventHandler {
  name: 'LOAD_OPTIONS_FROM_UI'
  handler: () => void
}

interface LoadOptionsFromMainHandler extends EventHandler {
  name: 'LOAD_OPTIONS_FROM_MAIN'
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

interface LoadCacheFromUIHandler extends EventHandler {
  name: 'LOAD_CACHE_FROM_UI'
  handler: () => void
}

interface LoadCacheFromMainHandler extends EventHandler {
  name: 'LOAD_CACHE_FROM_MAIN'
  handler: (keyValues: NotionKeyValue[]) => void
}

interface SaveCacheHandler extends EventHandler {
  name: 'SAVE_CACHE'
  handler: (keyValues: NotionKeyValue[]) => void
}

interface ApplyKeyValueHandler extends EventHandler {
  name: 'APPLY_KEY_VALUE'
  handler: (keyValue: NotionKeyValue) => void
}

interface ApplyValueHandler extends EventHandler {
  name: 'APPLY_VALUE'
  handler: (
    keyValues: NotionKeyValue[],
    options: {
      targetTextRange: TargetTextRange
      includeComponents: boolean
      includeInstances: boolean
    },
  ) => void
}

interface RenameLayerHandler extends EventHandler {
  name: 'RENAME_LAYER'
  handler: (
    keyValues: NotionKeyValue[],
    options: {
      targetTextRange: TargetTextRange
      includeComponents: boolean
      includeInstances: boolean
    },
  ) => void
}

interface HighlightTextHandler extends EventHandler {
  name: 'HIGHLIGHT_TEXT'
  handler: (
    keyValues: NotionKeyValue[],
    options: {
      targetTextRange: TargetTextRange
      includeComponents: boolean
      includeInstances: boolean
    },
  ) => void
}

interface ChangeLanguageHandler extends EventHandler {
  name: 'CHANGE_LANGUAGE'
  handler: (language: PluginLanguage, options?: { notify?: boolean }) => void
}
