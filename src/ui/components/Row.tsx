/** @jsx h */
import { type JSX, h } from 'preact'

import { useCopyToClipboard } from 'react-use'

import type { NotionKeyValue } from '@/types/common'

type RowProps = {
  keyValue: NotionKeyValue
}

export default function Row({ keyValue }: RowProps) {
  const [state, copyToClipboard] = useCopyToClipboard()

  function hundleCopyClick(value: string) {
    return (event: JSX.TargetedEvent<HTMLButtonElement>) => {
      copyToClipboard(value)
      console.log('copied', value)
    }
  }

  return (
    <li className="border-b border-solid border-b-primary p-2 flex flex-col">
      {/* key property */}
      <div className="flex">
        <div className="w-10 py-1 text-secondary">Key</div>
        <div className="flex-1 p-1 rounded-2 hover:bg-hover group">
          <div className="relative">
            <span className="select-text">{keyValue.key}</span>
            <button
              type="button"
              className="absolute right-0 bottom-0_5 hidden group-hover:block"
              onClick={hundleCopyClick(keyValue.key)}
            >
              <span className="material-symbols-outlined text-12 cursor-pointer">
                content_copy
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* value property */}
      <div className="flex">
        <div className="w-10 py-1 text-secondary">Value</div>
        <div className="flex-1 p-1 rounded-2 hover:bg-hover group">
          <div className="relative">
            <span className="select-text">{keyValue.value}</span>
            <button
              type="button"
              className="absolute right-0 bottom-0_5 hidden group-hover:block"
              onClick={hundleCopyClick(keyValue.value)}
            >
              <span className="material-symbols-outlined text-12 cursor-pointer">
                content_copy
              </span>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
