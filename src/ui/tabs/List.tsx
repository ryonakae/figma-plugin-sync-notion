/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useState } from 'preact/hooks'

import { Button, Divider, Textbox } from '@create-figma-plugin/ui'
import {
  useDebounce,
  useList,
  useMount,
  useUnmount,
  useUpdateEffect,
} from 'react-use'

import { useKeyValuesStore, useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue } from '@/types/common'
import KeyValueList from '@/ui/components/KeyValueList'

export default function List() {
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const [rows, { filter, reset }] = useList<NotionKeyValue>(keyValues)
  const [windowResized, setWindowResized] = useState(false)

  function handleFilterInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value
    console.log('handleFilterInput', inputValue)

    // stateを更新
    updateOptions({ filterString: inputValue })
  }

  function handleClearClick() {
    console.log('handleClearClick')
    updateOptions({ filterString: '' })
  }

  function handleFetchClick() {
    console.log('handleFetchClick')
    updateOptions({ selectedTab: 'Fetch' })
  }

  useMount(() => {
    console.log('List mounted')
    resizeWindow()
  })

  useUnmount(() => {
    console.log('List unmounted')
  })

  // filterStringがアップデートされたらdebounceさせてから配列をフィルター
  useDebounce(
    () => {
      console.log('filterString update (debounced)', options.filterString)

      // リストをリセット
      reset()

      // filterStringがkeyもしくはvalue propertyを含んでいたらそれに絞り込む
      filter(rows => {
        const keyProperty = rows.key.toLowerCase()
        const valueProperty = rows.value.toLowerCase()
        return (
          keyProperty.includes(options.filterString.toLowerCase()) ||
          valueProperty.includes(options.filterString.toLowerCase())
        )
      })
    },
    100,
    [options.filterString],
  )

  // windowResizedがfalseのときだけrowsが変更されたらウインドウをリサイズ
  useUpdateEffect(() => {
    if (!windowResized) {
      resizeWindow({ delay: 100 })
      setWindowResized(true)
    }
  }, [rows, windowResized])

  return (
    <div>
      {keyValues.length > 0 ? (
        <Fragment>
          {/* filter */}
          <div className="p-2 flex gap-1">
            <div className="flex-1">
              <Textbox
                variant="border"
                onInput={handleFilterInput}
                icon={<span className="icon">filter_list</span>}
                value={options.filterString}
                placeholder="Filter key or value property"
              />
            </div>

            {/* clear button */}
            {options.filterString.length > 0 && (
              <button
                type="button"
                className="h-7 p-1 hover:bg-hover rounded-2 text-link"
                onClick={handleClearClick}
              >
                Clear
              </button>
            )}
          </div>

          <Divider />

          {/* list */}
          <div className="h-500">
            <KeyValueList rows={rows} />
          </div>

          <Divider />

          {/* status bar */}
          <div className="p-2 flex justify-between text-secondary">
            <div className="flex gap-1">
              <span className="icon">highlight_mouse_cursor</span>
              <span>Click row to apply key & value to text or copy</span>
            </div>
            <span>{rows.length} items</span>
          </div>
        </Fragment>
      ) : (
        // empty
        <div className="h-500 flex flex-col gap-4 items-center justify-center">
          <span className="text-secondary">No items.</span>

          <Button secondary onClick={handleFetchClick}>
            Fetch text from Notion
          </Button>
        </div>
      )}
    </div>
  )
}
