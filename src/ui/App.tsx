/** @jsx h */
import { type JSX, h } from 'preact'
import { useState } from 'preact/hooks'

import { Tabs, type TabsOption } from '@create-figma-plugin/ui'
import { useMount, useUnmount, useUpdateEffect } from 'react-use'

import { useStore } from '@/ui/Store'
import useCache from '@/ui/hooks/useCache'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'
import Fetch from '@/ui/tabs/Fetch'
import List from '@/ui/tabs/List'
import Utilities from '@/ui/tabs/Utilities'

import type { SelectedTab } from '@/types/common'

export default function App() {
  const options = useStore()
  const {
    updateOptions,
    loadOptionsFromClientStorage,
    saveOptionsToClientStorage,
  } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const { loadCacheFromDocument } = useCache()
  const [mounted, setMounted] = useState(false)

  const tabOptions: TabsOption[] = [
    {
      children: <Fetch />,
      value: 'Fetch' as SelectedTab,
    },
    {
      children: <List />,
      value: 'List' as SelectedTab,
    },
    {
      children: <Utilities />,
      value: 'Utilities' as SelectedTab,
    },
  ]

  function handleTabChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    updateOptions({
      selectedTab: event.currentTarget.value as SelectedTab,
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

    resizeWindow({ delay: 100 })
  })

  useUnmount(() => {
    console.log('App unmounted')
  })

  // UI側で設定が更新されたら設定をアップデート
  useUpdateEffect(() => {
    saveOptionsToClientStorage(options)
  }, [options])

  if (!mounted) {
    return null
  }

  return (
    <div id="wrapper">
      <Tabs
        options={tabOptions}
        onChange={handleTabChange}
        value={options.selectedTab}
      />
    </div>
  )
}
