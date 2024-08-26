/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useState } from 'preact/hooks'

import {
  Button,
  Divider,
  Dropdown,
  type DropdownOption,
  Textbox,
} from '@create-figma-plugin/ui'
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

import type { NotionKeyValue, SortOrder, SortValue } from '@/types/common'
import KeyValueList from '@/ui/components/KeyValueList'

export default function List() {
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const [rows, { filter, sort, reset }] = useList<NotionKeyValue>(keyValues)
  const [windowResized, setWindowResized] = useState(false)

  const sortValueOptions: DropdownOption[] &
    {
      value?: SortValue
    }[] = [
    {
      text: 'Key',
      value: 'key',
    },
    {
      text: 'Value',
      value: 'value',
    },
    {
      text: 'Created (default)',
      value: 'created_time',
    },
    {
      text: 'Last edited',
      value: 'last_edited_time',
    },
  ]
  const sortOrderOptions: DropdownOption[] &
    {
      value?: SortOrder
    }[] = [
    {
      text: 'Ascending',
      value: 'ascending',
    },
    {
      text: 'Descending (Default)',
      value: 'descending',
    },
  ]

  function filterList(filterString: string) {
    console.log('filterList', filterString)

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
  }

  function sortList(sortValue: SortValue, sortOrder: SortOrder) {
    console.log('sortList', sortValue, sortOrder)

    sort((a, b) => {
      let comparison: number

      if (sortValue === 'created_time' || sortValue === 'last_edited_time') {
        // 日付フィールドの場合、Date オブジェクトに変換して比較
        const aDate = new Date(a[sortValue]).getTime()
        const bDate = new Date(b[sortValue]).getTime()
        comparison = aDate - bDate
      } else {
        // 文字列の場合は localeCompare を使用
        comparison = a[sortValue].localeCompare(b[sortValue])
      }

      // ソート順に応じて結果を反転
      return sortOrder === 'ascending' ? comparison : -comparison
    })
  }

  function handleFilterInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    const inputValue = event.currentTarget.value
    console.log('handleFilterInput', inputValue)

    // stateを更新
    updateOptions({
      filterString: inputValue,
    })
  }

  function handleClearClick() {
    console.log('handleClearClick')
    updateOptions({
      filterString: '',
    })
  }

  function handleSortChange(key: 'sortValue' | 'sortOrder') {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      const inputValue = event.currentTarget.value
      console.log('handleSortChange', key, inputValue)

      // stateを更新
      updateOptions({
        [key]: inputValue,
      })
    }
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

  // filterString | sortValue | sortOrderがアップデートされたらdebounceさせてから配列をフィルター&ソート
  useDebounce(
    () => {
      console.log(
        'filterString or sortValue or sortOrder update (debounced)',
        options.filterString,
        options.sortValue,
        options.sortOrder,
      )
      if (options.filterString) {
        filterList(options.filterString)
      }
      sortList(options.sortValue, options.sortOrder)
    },
    100,
    [options.filterString, options.sortValue, options.sortOrder],
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
          {/* filter & sort */}
          <div className="p-2 flex flex-col gap-1">
            {/* filter */}
            <div className="flex gap-1">
              <span className="icon text-secondary">filter_list</span>

              <div className="flex-1">
                <Textbox
                  variant="border"
                  onInput={handleFilterInput}
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

            {/* sort */}
            <div className="flex gap-1 align-center">
              <span className="icon text-secondary">swap_vert</span>

              <Dropdown
                variant="border"
                options={sortValueOptions}
                value={options.sortValue}
                onChange={handleSortChange('sortValue')}
              />

              <Dropdown
                variant="border"
                options={sortOrderOptions}
                value={options.sortOrder}
                onChange={handleSortChange('sortOrder')}
              />
            </div>
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
