import {
  emit,
  loadSettingsAsync,
  on,
  saveSettingsAsync,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_OPTIONS, DEFAULT_WIDTH, SETTINGS_KEY } from '@/constants'
import applyKeyValue from '@/main/applyKeyValue'
import applyValue from '@/main/applyValue'
import highlightText from '@/main/highlightText'
import renameLayer from '@/main/renameLayer'

import type { NotionKeyValue, Options } from '@/types/common'
import type {
  ApplyKeyValueHandler,
  ApplyValueHandler,
  HighlightTextHandler,
  LoadCacheFromMainHandler,
  LoadCacheFromUIHandler,
  LoadOptionsFromMainHandler,
  LoadOptionsFromUIHandler,
  NotifyHandler,
  RenameLayerHandler,
  ResizeWindowHandler,
  SaveCacheHandler,
  SaveOptionsHandler,
} from '@/types/eventHandler'

export default async function () {
  // set relaunch button
  setRelaunchButton(figma.root, 'open')

  // show ui
  showUI({
    width: DEFAULT_WIDTH,
    height: 0,
  })

  // register event handlers
  on<LoadOptionsFromUIHandler>('LOAD_OPTIONS_FROM_UI', async () => {
    const options = await loadSettingsAsync<Options>(
      DEFAULT_OPTIONS,
      SETTINGS_KEY,
    )
    emit<LoadOptionsFromMainHandler>('LOAD_OPTIONS_FROM_MAIN', options)
  })

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

    // UIに送る
    emit<LoadCacheFromMainHandler>('LOAD_CACHE_FROM_MAIN', cache)
  })

  on<SaveCacheHandler>('SAVE_CACHE', keyValues => {
    // まずすでにあるキャッシュを削除
    figma.root.setPluginData('cache', '')

    // キャッシュをDocumentに保存
    figma.root.setPluginData('cache', JSON.stringify(keyValues))

    console.log('save cache success', keyValues)
  })

  on<ApplyKeyValueHandler>('APPLY_KEY_VALUE', keyValue => {
    applyKeyValue(keyValue)
  })

  on<ApplyValueHandler>('APPLY_VALUE', (keyValues, options) => {
    applyValue(keyValues, options)
  })

  on<RenameLayerHandler>('RENAME_LAYER', (keyValues, options) => {
    renameLayer(keyValues, options)
  })

  on<HighlightTextHandler>('HIGHLIGHT_TEXT', (keyValues, options) => {
    highlightText(keyValues, options)
  })
}
