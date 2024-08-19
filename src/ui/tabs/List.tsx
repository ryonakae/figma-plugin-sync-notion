/** @jsx h */
import { type JSX, h } from 'preact'
import { useState } from 'preact/hooks'

import {
  Container,
  Divider,
  Text,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
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
  const [filterString, setFilterString] = useState('')

  function hundleFilterInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value
    console.log('hundleFilterInput', inputValue)

    // stateを更新
    setFilterString(inputValue)

    // いったんリストをリセット
    reset()

    // inputValueがkeyもしくはvalue propertyを含んでいたらそれに絞り込む
    filter(rows => {
      const keyProperty = rows.key.toLowerCase()
      const valueProperty = rows.value.toLowerCase()
      return (
        keyProperty.includes(inputValue.toLowerCase()) ||
        valueProperty.includes(inputValue.toLowerCase())
      )
    })
  }

  useMount(() => {
    console.log('List mounted', keyValues)
    resizeWindow()
  })

  useUnmount(() => {
    console.log('List unmounted')
  })

  useUpdateEffect(() => {
    resizeWindow()
  }, [rows])

  return (
    <div className="max-h-[500px] overflow-auto" style="max-height: 500px;">
      {/* filter */}
      <Container space="medium">
        <VerticalSpace space="small" />
        <Textbox
          variant="border"
          onInput={hundleFilterInput}
          value={filterString}
          placeholder="Filter key or value property"
        />
        <VerticalSpace space="small" />
      </Container>

      <Divider />

      {/* list */}
      <ul>
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <li key={row.id}>
              <div>{row.key}</div>
              <div>{row.value}</div>
              <Divider />
            </li>
          ))
        ) : (
          <Container space="medium">
            <VerticalSpace space="extraLarge" />
            <Text align="center">No items are listed.</Text>
            <VerticalSpace space="extraLarge" />
          </Container>
        )}
      </ul>
    </div>
  )
}
