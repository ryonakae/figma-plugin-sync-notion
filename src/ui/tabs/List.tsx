/** @jsx h */
import { type JSX, h } from 'preact'
import { useState } from 'preact/hooks'

import {
  Container,
  Divider,
  Link,
  Textbox,
  VerticalSpace,
  useInitialFocus,
} from '@create-figma-plugin/ui'
import { useList, useMount, useUnmount, useUpdateEffect } from 'react-use'

import { useKeyValuesStore, useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue } from '@/types/common'
import Row from '@/ui/components/Row'

export default function List() {
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const [rows, { filter, reset }] = useList<NotionKeyValue>(keyValues)
  const [filterString, setFilterString] = useState('')
  const initialFocus = useInitialFocus()

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

  function hundleClearClick() {
    setFilterString('')
    reset()
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
    <div>
      {/* filter */}
      <Container space="extraSmall">
        <VerticalSpace space="extraSmall" />
        <div className="flex gap-1">
          <div className="flex-1">
            <Textbox
              {...initialFocus}
              variant="border"
              onInput={hundleFilterInput}
              value={filterString}
              placeholder="Filter key or value property"
            />
          </div>

          {/* clear button */}
          {filterString.length > 0 && (
            <button
              type="button"
              className="h-7 p-1 hover:bg-hover rounded-2 text-link"
              onClick={hundleClearClick}
            >
              Clear
            </button>
          )}
        </div>
        <VerticalSpace space="extraSmall" />
      </Container>

      <Divider />

      {/* list */}
      {rows.length > 0 ? (
        <ul className="max-h-500 overflow-x-hidden overflow-y-auto">
          {rows.map((row, index) => (
            <Row key={row.id} keyValue={row} />
          ))}
        </ul>
      ) : (
        <div className="px-4 py-20 text-center">
          <span className="text-secondary">No items.</span>
        </div>
      )}
    </div>
  )
}
