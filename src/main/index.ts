import {
  emit,
  loadSettingsAsync,
  on,
  saveSettingsAsync,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import {
  CACHE_KEY,
  DEFAULT_CLIENT_STORAGE_OPTIONS,
  DEFAULT_DOCUMENT_OPTIONS,
  DEFAULT_WIDTH,
  SETTINGS_KEY,
} from '@/constants'
import i18n from '@/i18n/main'
import applyKeyValue from '@/main/applyKeyValue'
import applyValue from '@/main/applyValue'
import highlightText from '@/main/highlightText'
import renameLayer from '@/main/renameLayer'

import type {
  ClientStorageOptions,
  DocumentOptions,
  NotionKeyValue,
  Options,
} from '@/types/common'
import type {
  ApplyKeyValueHandler,
  ApplyValueHandler,
  ChangeLanguageHandler,
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

  // setPluginDataで保存したキャッシュを削除（clientStorageに移行したため）
  figma.root.setPluginData(CACHE_KEY, '')

  // register event handlers
  on<LoadOptionsFromUIHandler>('LOAD_OPTIONS_FROM_UI', async () => {
    // documentOptionsを取得
    let documentOptions: DocumentOptions = DEFAULT_DOCUMENT_OPTIONS
    const pluginData = figma.root.getPluginData(SETTINGS_KEY)
    if (pluginData) {
      documentOptions = JSON.parse(pluginData)
    }
    console.log('documentOptions', documentOptions)

    // clientStorageOptionsを取得
    const clientStorageOptions = await loadSettingsAsync<ClientStorageOptions>(
      DEFAULT_CLIENT_STORAGE_OPTIONS,
      SETTINGS_KEY,
    )
    console.log('clientStorageOptions', clientStorageOptions)

    // documentOptionsとclientStorageをマージ
    const options: Options = { ...documentOptions, ...clientStorageOptions }

    // main側の言語を切り替え
    await i18n.changeLanguage(options.pluginLanguage)
    console.log('language in main updated.', options.pluginLanguage, i18n)

    // uiにoptionsを送る
    emit<LoadOptionsFromMainHandler>('LOAD_OPTIONS_FROM_MAIN', options)
  })

  on<SaveOptionsHandler>('SAVE_OPTIONS', async options => {
    const newDocumentOptions: DocumentOptions = {
      databaseId: options.databaseId,
      integrationToken: options.integrationToken,
      keyPropertyName: options.keyPropertyName,
      valuePropertyName: options.valuePropertyName,
    }
    const newClientStorageOptions: ClientStorageOptions = {
      selectedTabKey: options.selectedTabKey,
      filterString: options.filterString,
      sortValue: options.sortValue,
      sortOrder: options.sortOrder,
      selectedRowId: options.selectedRowId,
      scrollPosition: options.scrollPosition,
      targetTextRange: options.targetTextRange,
      includeComponents: options.includeComponents,
      includeInstances: options.includeInstances,
      pluginLanguage: options.pluginLanguage,
    }
    console.log('newDocumentOptions', newDocumentOptions)
    console.log('newClientStorageOptions', newClientStorageOptions)

    // 新しいオプションをDocumentに保存
    figma.root.setPluginData(SETTINGS_KEY, JSON.stringify(newDocumentOptions))

    // 新しいオプションをclientStorageに保存
    await saveSettingsAsync<ClientStorageOptions>(
      newClientStorageOptions,
      SETTINGS_KEY,
    )
  })

  on<NotifyHandler>('NOTIFY', options => {
    figma.notify(options.message, options.options)
  })

  on<ResizeWindowHandler>('RESIZE_WINDOW', windowSize => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })

  on<LoadCacheFromUIHandler>('LOAD_CACHE_FROM_UI', async () => {
    // キャッシュのデータをclientStorageから取得
    const data: NotionKeyValue[] =
      (await figma.clientStorage.getAsync(CACHE_KEY)) || []
    console.log('cache data', data)

    // UIに送る
    emit<LoadCacheFromMainHandler>('LOAD_CACHE_FROM_MAIN', data)
  })

  on<SaveCacheHandler>('SAVE_CACHE', async keyValues => {
    // キャッシュをclientStorageに保存
    await figma.clientStorage.setAsync(CACHE_KEY, keyValues)

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

  on<ChangeLanguageHandler>('CHANGE_LANGUAGE', async (language, options) => {
    // main側の言語を切り替え
    await i18n.changeLanguage(language)
    console.log('language in main updated.', language, i18n)

    // options.notifyがtrueの場合は完了通知
    if (options?.notify) {
      figma.notify(i18n.t('notifications.Settings.updateLanguage'))
    }
  })
}
