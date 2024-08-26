/** @jsx h */
import { h } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import { useStore } from '@/ui/Store'
import Row from '@/ui/components/Row'
import useOptions from '@/ui/hooks/useOptions'

import type { NotionKeyValue } from '@/types/common'
import { useDebounce, useMount, useUnmount, useUpdateEffect } from 'react-use'

type KeyValueProps = {
  rows: NotionKeyValue[]
  className?: string
}

export default function KeyValueList({ rows, className }: KeyValueProps) {
  const options = useStore()
  const { updateOptions } = useOptions()
  const listRef = useRef<HTMLUListElement>(null)
  const [tmpScrollPosition, setTmpScrollPosition] = useState(0)
  const [scrollPositionRestored, setScrollPositionRestored] = useState(false)

  // rowをクリックした時に実行する関数
  const handleRowClick = useCallback(
    (id: string) => {
      console.log('handleRowClick', id, options.selectedRowId)

      // 選択されてなければ選択済みにする
      // すでに選択済みだったら選択解除
      if (id !== options.selectedRowId) {
        updateOptions({ selectedRowId: id })
      } else {
        updateOptions({ selectedRowId: null })
      }
    },
    [options.selectedRowId],
  )

  // スクロール時にscrollPositionを更新する関数
  const handleScroll = useCallback(() => {
    if (listRef.current) {
      setTmpScrollPosition(listRef.current.scrollTop)
    }
  }, [])

  // rowsが変更される度にイベントリスナを再設定
  useEffect(() => {
    const listElement = listRef.current

    if (listElement) {
      listElement.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (listElement) {
        listElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [rows])

  // tmpScrollPositionが更新されたらdebounceさせてからStoreに保存
  // scrollPositionRestoredがtrueのときだけ
  useDebounce(
    () => {
      if (scrollPositionRestored) {
        console.log('scrollPosition update (debounced)', tmpScrollPosition)
        updateOptions({ scrollPosition: tmpScrollPosition })
      }
    },
    100,
    [tmpScrollPosition],
  )

  useMount(() => {
    console.log('KeyValueList mounted')
  })

  useUnmount(() => {
    console.log('KeyValueList unmounted')
  })

  // scrollPositionRestoredがfalseのときだけrowが変更されたらスクロール位置を復元
  useUpdateEffect(() => {
    if (!scrollPositionRestored && listRef.current) {
      console.log('restore scroll position', options.scrollPosition)
      listRef.current.scrollTo({
        top: options.scrollPosition,
        behavior: 'instant',
      })
      setTmpScrollPosition(options.scrollPosition)
      setScrollPositionRestored(true)
    }
  }, [rows, scrollPositionRestored])

  return (
    <div className={className}>
      {rows.length > 0 ? (
        <ul className="h-full overflow-x-hidden overflow-y-auto" ref={listRef}>
          {rows.map((row, index) => (
            <Row
              key={row.id}
              keyValue={row}
              onClick={handleRowClick}
              selected={row.id === options.selectedRowId}
            />
          ))}
        </ul>
      ) : (
        // empty
        <div className="h-full flex flex-col items-center justify-center text-secondary">
          No items.
        </div>
      )}
    </div>
  )
}
