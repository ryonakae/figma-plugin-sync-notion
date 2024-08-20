/** @jsx h */
import { Fragment, type JSX, h } from 'preact'

import { Button, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import clsx from 'clsx'
import { useCopyToClipboard } from 'react-use'

import type { NotionKeyValue } from '@/types/common'
import type { ApplyKeyValueHandler, NotifyHandler } from '@/types/eventHandler'

type CopyButtonProps = {
  title: string
  value: string
  selected: boolean
  className?: string
}
type RowProps = {
  keyValue: NotionKeyValue
  onClick: (id: string) => void
  selected: boolean
}

function CopyButton({ title, value, selected, className }: CopyButtonProps) {
  const [state, copyToClipboard] = useCopyToClipboard()

  function handleClick(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    // 親要素へのバブリングを止める
    event.stopPropagation()

    copyToClipboard(value)
    console.log('copied', value)

    emit<NotifyHandler>('NOTIFY', {
      message: `Copied ${title} to clipboard.`,
    })
  }

  return (
    <div className={className}>
      <button
        type="button"
        className={clsx(
          'bg-primary rounded-2 w-5 h-5 flex items-center justify-center hover:bg-tertiary active:bg-primary',
          selected &&
            'bg-selected hover:bg-selectedTertiary active:bg-selected',
        )}
        onClick={handleClick}
      >
        <span className="icon text-12 cursor-pointer">content_copy</span>
      </button>
    </div>
  )
}

export default function Row({ keyValue, onClick, selected }: RowProps) {
  function handleApplyClick(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    // 親要素へのバブリングを止める
    event.stopPropagation()

    console.log('handleApplyClick', keyValue)
    emit<ApplyKeyValueHandler>('APPLY_KEY_VALUE', keyValue)
  }

  return (
    <li
      className={clsx(
        'border-b border-solid border-b-primary p-2 flex flex-col',
        selected && 'bg-selected',
      )}
      onClick={() => onClick(keyValue.id)}
    >
      {/* key property */}
      <div className="w-full flex">
        <div className="w-10 py-1 text-secondary">Key</div>
        <div
          className={clsx(
            'flex-1 p-1 rounded-2 group hover:bg-hover',
            selected && 'hover:bg-selectedSecondary',
          )}
        >
          <div className="relative">
            <span>{keyValue.key}</span>
            <CopyButton
              title="Key property"
              value={keyValue.key}
              selected={selected}
              className="absolute -right-0_5 -bottom-0_5 hidden group-hover:block"
            />
          </div>
        </div>
      </div>

      {/* value property */}
      <div className="w-full flex">
        <div className="w-10 py-1 text-secondary">Value</div>
        <div
          className={clsx(
            'flex-1 p-1 rounded-2 group hover:bg-hover',
            selected && 'hover:bg-selectedSecondary',
          )}
        >
          <div className="relative">
            <span>{keyValue.value}</span>
            <CopyButton
              title="Value property"
              value={keyValue.value}
              selected={selected}
              className="absolute -right-0_5 -bottom-0_5 hidden group-hover:block"
            />
          </div>
        </div>
      </div>

      {selected && (
        <Fragment>
          <VerticalSpace space="extraSmall" />
          <Button secondary fullWidth onClick={handleApplyClick}>
            Apply key & value to selected text
          </Button>
        </Fragment>
      )}
    </li>
  )
}
