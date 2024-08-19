/** @jsx h */
import { type JSX, h } from 'preact'

import { Tabs, type TabsOption } from '@create-figma-plugin/ui'
import { once } from '@create-figma-plugin/utilities'
import { useMount, useUnmount, useUpdateEffect } from 'react-use'

import { useStore } from '@/ui/Store'
import useCache from '@/ui/hooks/useCache'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'
import Fetch from '@/ui/tabs/Fetch'
import List from '@/ui/tabs/List'
import Utilities from '@/ui/tabs/Utilities'

import type { Options, SelectedTab } from '@/types/common'
import type { LoadOptionsHandler } from '@/types/eventHandler'

export default function App() {
  const options = useStore()
  const { updateOptions, saveOptionsToClientStorage } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const { loadCacheFromDocument } = useCache()

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

  useMount(() => {
    console.log('App mounted')

    // 設定をmainから受け取ってUIに反映
    // fetchingだけ絶対falseにする
    once<LoadOptionsHandler>('LOAD_OPTIONS', (options: Options) => {
      updateOptions({
        ...options,
        fetching: false,
      })
    })

    // keyValuesのキャッシュをドキュメントから取得
    loadCacheFromDocument()

    resizeWindow({ delay: 100 })
  })

  useUnmount(() => {
    console.log('App unmounted')
  })

  // UI側で設定が更新されたら設定をclientStorageに保存
  useUpdateEffect(() => {
    saveOptionsToClientStorage(options)
  }, [options])

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
