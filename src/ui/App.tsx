/** @jsx h */
import { type JSX, h } from 'preact'

import { Tabs, type TabsOption } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'
import Fetch from '@/ui/tabs/Fetch'
import List from '@/ui/tabs/List'
import Utilities from '@/ui/tabs/Utilities'

import type { SelectedTab } from '@/types/common'

export default function App() {
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

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

  function onTabChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    updateOptions({
      selectedTab: event.currentTarget.value as SelectedTab,
    })
  }

  useMount(() => {
    console.log('App mounted')

    window.requestAnimationFrame(() => resizeWindow())
  })

  useUnmount(() => {
    console.log('App unmounted')
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
