/** @jsx h */
import { Fragment, type JSX, h } from 'preact'

import {
  Button,
  Divider,
  Dropdown,
  type DropdownOption,
  Textbox,
} from '@create-figma-plugin/ui'
import { useTranslation } from 'react-i18next'
import { useDebounce, useList, useMount, useUnmount } from 'react-use'

import { useKeyValuesStore, useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue, SortOrder, SortValue } from '@/types/common'
import KeyValueList from '@/ui/components/KeyValueList'

export default function List() {
  const { t } = useTranslation()
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const [rows, { filter, sort, reset }] = useList<NotionKeyValue>(keyValues)

  const sortValueOptions: DropdownOption[] &
    {
      value?: SortValue
    }[] = [
    {
      text: t('List.sortValue.key'),
      value: 'key',
    },
    {
      text: t('List.sortValue.value'),
      value: 'value',
    },
    {
      text: t('List.sortValue.created_time'),
      value: 'created_time',
    },
    {
      text: t('List.sortValue.last_edited_time'),
      value: 'last_edited_time',
    },
  ]
  const sortOrderOptions: DropdownOption[] &
    {
      value?: SortOrder
    }[] = [
    {
      text: t('List.sortOrder.ascending'),
      value: 'ascending',
    },
    {
      text: t('List.sortOrder.descending'),
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
    updateOptions({ selectedTabKey: 'fetch' })
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
                  placeholder={t('List.filter.placeholder')}
                />
              </div>

              {/* clear button */}
              {options.filterString.length > 0 && (
                <button
                  type="button"
                  className="h-7 p-1 hover:bg-hover rounded-2 text-link"
                  onClick={handleClearClick}
                >
                  {t('List.filter.clearButton')}
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
          <KeyValueList rows={rows} className="h-500" />

          <Divider />

          {/* status bar */}
          <div className="px-2 h-8 flex items-center justify-between text-secondary">
            <div className="flex gap-1">
              <span className="icon">highlight_mouse_cursor</span>
              <span>{t('List.statusBar.text')}</span>
            </div>
            <span>{t('List.statusBar.count', { length: rows.length })}</span>
          </div>
        </Fragment>
      ) : (
        // empty
        <div className="h-500 flex flex-col gap-4 items-center justify-center">
          <span className="text-secondary">{t('List.empty.text')}</span>

          <Button secondary onClick={handleFetchClick}>
            {t('List.empty.fetchButton')}
          </Button>
        </div>
      )}
    </div>
  )
}
