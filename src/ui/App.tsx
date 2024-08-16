/** @jsx h */
import { type JSX, h } from 'preact'

import { Tabs, type TabsOption } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'
import Settings from '@/ui/tabs/Settings'

import type { Options, SelectedTab } from '@/types/common'

export default function App() {
  const options = useStore()

  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  const tabOptions: TabsOption[] = [
    {
      children: <Settings />,
      value: '設定' as SelectedTab,
    },
  ]

  function onTabChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    updateOptions({
      selectedTab: event.currentTarget.value as Options['selectedTab'],
    })
  }

  useMount(() => {
    console.log('Settings mounted')

    window.requestAnimationFrame(resizeWindow)
  })

  useUnmount(() => {
    console.log('Settings unmounted')
  })

  return (
    <div id="wrapper">
      <Tabs
        options={tabOptions}
        onChange={onTabChange}
        value={options.selectedTab}
      />
    </div>
  )
}
