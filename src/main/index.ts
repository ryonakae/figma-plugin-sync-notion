import {
  emit,
  loadSettingsAsync,
  on,
  saveSettingsAsync,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_OPTIONS, SETTINGS_KEY } from '@/constants'

import type { NotionKeyValue, Options } from '@/types/common'
import type {
  LoadCacheFromMainHandler,
  LoadCacheFromUIHandler,
  LoadOptionsHandler,
  NotifyHandler,
  ResizeWindowHandler,
  SaveCacheHandler,
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

  // clientStorageから設定をロードしてUIに送る
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

  on<LoadCacheFromUIHandler>('LOAD_CACHE_FROM_UI', async () => {
    let cache: NotionKeyValue[]

    // キャッシュのデータをDodumentから取得
    const data = figma.root.getPluginData('cache')

    // データがあったらパース、無かったら空配列を返す
    if (data) {
      cache = JSON.parse(data)
    } else {
      cache = []
    }

    console.log('cache', cache)

    // UIに送る
    emit<LoadCacheFromMainHandler>('LOAD_CACHE_FROM_MAIN', cache)
  })

  on<SaveCacheHandler>('SAVE_CACHE', keyValues => {
    // キャッシュをDocumentに保存
    figma.root.setPluginData('cache', JSON.stringify(keyValues))
    console.log('save cache success', keyValues)
  })
}
