/** @jsx h */
import { h } from 'preact'
import { useEffect } from 'preact/hooks'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useList, useMount, useUnmount, useUpdateEffect } from 'react-use'

import { useKeyValuesStore, useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue } from '@/types/common'

export default function List() {
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const [rows, { set, push, sort, filter, reset }] =
    useList<NotionKeyValue>(keyValues)

  useMount(() => {
    console.log('List mounted', keyValues)
    resizeWindow()
  })

  useUnmount(() => {
    console.log('List unmounted')
  })

  return (
    <div className="overflow-auto" style="max-height: 500px;">
      <ul>
        {rows.map((row, index) => (
          <li key={row.id}>
            <div>{row.key}</div>
            <div>{row.value}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
