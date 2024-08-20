/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useCallback, useState } from 'preact/hooks'

import { Button, Divider, Textbox } from '@create-figma-plugin/ui'
import {
  useDebounce,
  useList,
  useMount,
  useUnmount,
  useUpdateEffect,
} from 'react-use'

import { useKeyValuesStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue } from '@/types/common'
import Row from '@/ui/components/Row'

export default function List() {
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const [rows, { filter, reset }] = useList<NotionKeyValue>(keyValues)
  const [filterString, setFilterString] = useState('')
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)

  // filterStringがアップデートされたらdebounceさせてから配列をフィルター
  const [, cancel] = useDebounce(
    () => {
      console.log('debounced', filterString)

      // リストをリセット
      reset()

      // filterStringがkeyもしくはvalue propertyを含んでいたらそれに絞り込む
      filter(rows => {
        const keyProperty = rows.key.toLowerCase()
        const valueProperty = rows.value.toLowerCase()
        return (
          keyProperty.includes(filterString.toLowerCase()) ||
          valueProperty.includes(filterString.toLowerCase())
        )
      })
    },
    100,
    [filterString],
  )

  function handleFilterInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value
    console.log('handleFilterInput', inputValue)

    // stateを更新
    setFilterString(inputValue)
  }

  function handleClearClick() {
    console.log('handleClearClick')
    setFilterString('')
  }

  function handleFetchClick() {
    console.log('handleFetchClick')
    updateOptions({ selectedTab: 'Fetch' })
  }

  const handleRowClick = useCallback(
    (id: string) => {
      console.log('handleRowClick', id, selectedRowId)

      // 選択されてなければ選択済みにする
      // すでに選択済みだったら選択解除
      if (id !== selectedRowId) {
        setSelectedRowId(id)
      } else {
        setSelectedRowId(null)
      }
    },
    [selectedRowId],
  )

  useMount(() => {
    console.log('List mounted')
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
      {keyValues.length > 0 ? (
        <Fragment>
          {/* filter */}
          <div className="p-2 flex gap-1">
            <div className="flex-1">
              <Textbox
                variant="border"
                onInput={handleFilterInput}
                icon={<span className="icon">filter_list</span>}
                value={filterString}
                placeholder="Filter key or value property"
              />
            </div>

            {/* clear button */}
            {filterString.length > 0 && (
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
          {rows.length > 0 ? (
            <ul className="h-500 overflow-x-hidden overflow-y-auto">
              {rows.map((row, index) => (
                <Row
                  key={row.id}
                  keyValue={row}
                  onClick={handleRowClick}
                  selected={row.id === selectedRowId}
                />
              ))}
            </ul>
          ) : (
            <div className="h-500 flex flex-col items-center justify-center text-secondary">
              No items.
            </div>
          )}

          <Divider />

          {/* status bar */}
          <div className="p-2 flex justify-between text-secondary">
            <span>Click row to apply key & value to text</span>
            <span>{rows.length} items</span>
          </div>
        </Fragment>
      ) : (
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
