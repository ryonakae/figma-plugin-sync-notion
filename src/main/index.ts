import {
  emit,
  loadSettingsAsync,
  on,
  saveSettingsAsync,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_OPTIONS, SETTINGS_KEY } from '@/constants'

import type { Options } from '@/types/common'
import type {
  LoadOptionsHandler,
  NotifyHandler,
  ResizeWindowHandler,
  SaveOptionsHandler,
} from '@/types/eventHandler'

export default async function () {
  // set relaunch button
  setRelaunchButton(figma.root, 'open')

  // show ui
  showUI({
    width: 300,
    height: 0,
  })

  // load options from clientStorage
  const options = await loadSettingsAsync<Options>(
    DEFAULT_OPTIONS,
    SETTINGS_KEY,
  )
  emit<LoadOptionsHandler>('LOAD_OPTIONS', options)

  // register event handlers
  on<SaveOptionsHandler>('SAVE_OPTIONS', async options => {
    await saveSettingsAsync<Options>(options, SETTINGS_KEY)
  })

  on<NotifyHandler>('NOTIFY', options => {
    figma.notify(options.message, options.options)
  })

  on<ResizeWindowHandler>('RESIZE_WINDOW', windowSize => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })
}
