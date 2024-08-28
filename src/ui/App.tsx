/** @jsx h */
import { type JSX, h } from 'preact'
import { useState } from 'preact/hooks'

import { Tabs, type TabsOption } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useTranslation } from 'react-i18next'
import { useMount, useUnmount, useUpdateEffect } from 'react-use'

import { useStore } from '@/ui/Store'
import useCache from '@/ui/hooks/useCache'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'
import Fetch from '@/ui/tabs/Fetch'
import List from '@/ui/tabs/List'
import Settings from '@/ui/tabs/Settings'
import Utilities from '@/ui/tabs/Utilities'

import type { SelectedTabKey, SelectedTabValue } from '@/types/common'
import type { ChangeLanguageHandler } from '@/types/eventHandler'

export default function App() {
  const { t, i18n } = useTranslation()
  const options = useStore()
  const {
    updateOptions,
    loadOptionsFromClientStorage,
    saveOptionsToClientStorage,
  } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const { loadCacheFromDocument } = useCache()
  const [mounted, setMounted] = useState(false)
  const [selectedTabValue, setSelectedTabValue] =
    useState<SelectedTabValue>('Fetch')

  const tabOptions: TabsOption[] &
    {
      value: SelectedTabValue
    }[] = [
    {
      children: <Fetch />,
      value: t('Tabs.fetch'),
    },
    {
      children: <List />,
      value: t('Tabs.list'),
    },
    {
      children: <Utilities />,
      value: t('Tabs.utilities'),
    },
    {
      children: <Settings />,
      value: t('Tabs.settings'),
    },
  ]

  function handleTabChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newTabValue = event.currentTarget.value as SelectedTabValue
    let newTabKey: SelectedTabKey = 'fetch'

    if (newTabValue === t('Tabs.fetch')) {
      newTabKey = 'fetch'
    } else if (newTabValue === t('Tabs.list')) {
      newTabKey = 'list'
    } else if (newTabValue === t('Tabs.utilities')) {
      newTabKey = 'utilities'
    } else if (newTabValue === t('Tabs.settings')) {
      newTabKey = 'settings'
    }

    updateOptions({
      selectedTabKey: newTabKey,
    })
  }

  useMount(async () => {
    console.log('App mounted start')

    // 設定をclientStorageから取得
    await loadOptionsFromClientStorage()

    // keyValuesのキャッシュをドキュメントから取得
    await loadCacheFromDocument()

    // マウント完了
    console.log('App mounted done')
    setMounted(true)

    resizeWindow()
  })

  useUnmount(() => {
    console.log('App unmounted')
  })

  // UI側で設定が更新されたら設定をアップデート
  useUpdateEffect(() => {
    saveOptionsToClientStorage(options)
  }, [options])

  // selectedTab(key)がアップデートされたらselectedTabValueをアップデート
  useUpdateEffect(() => {
    const translatedTabValue = t(`Tabs.${options.selectedTabKey}` as const)
    setSelectedTabValue(translatedTabValue as SelectedTabValue)
  }, [options.selectedTabKey])

  // options.pluginLanguageが変更されたら言語を切り替え
  useUpdateEffect(async () => {
    console.log('pluginLanguage update on App', options.pluginLanguage)

    // UI側の言語を切り替え
    await i18n.changeLanguage(options.pluginLanguage)

    // main側の言語も切り替える
    emit<ChangeLanguageHandler>('CHANGE_LANGUAGE', options.pluginLanguage)

    // selectedTabValueを言語に合わせてアップデート
    const translatedTabValue = t(`Tabs.${options.selectedTabKey}` as const)
    setSelectedTabValue(translatedTabValue as SelectedTabValue)
  }, [options.pluginLanguage])

  if (!mounted) {
    return null
  }

  return (
    <div id="wrapper">
      <Tabs
        options={tabOptions}
        onChange={handleTabChange}
        value={selectedTabValue}
      />
    </div>
  )
}
