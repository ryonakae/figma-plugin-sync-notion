/** @jsx h */
import { type JSX, h } from 'preact'

import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  type DropdownOption,
  Stack,
  Text,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useMount, useUnmount } from 'react-use'

import { useKeyValuesStore, useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { TargetTextRange } from '@/types/common'
import type {
  ApplyValueHandler,
  HighlightTextHandler,
  RenameLayerHandler,
} from '@/types/eventHandler'

export default function Utilities() {
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  const targetTextRangeDropdownOptions: DropdownOption[] &
    {
      value?: TargetTextRange
    }[] = [
    {
      text: 'Selection',
      value: 'selection',
    },
    {
      text: 'Current page',
      value: 'currentPage',
    },
    {
      text: 'All pages',
      value: 'allPages',
    },
  ]

  function handleTextRangeDropdownChange(
    event: JSX.TargetedEvent<HTMLInputElement>,
  ) {
    updateOptions({
      targetTextRange: event.currentTarget.value as TargetTextRange,
    })
  }

  function handleCheckboxClick(
    option: 'includeComponents' | 'includeInstances',
  ) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      console.log('handleCheckboxClick', option)

      if (option === 'includeComponents') {
        updateOptions({
          includeComponents: event.currentTarget.checked,
        })
      } else if (option === 'includeInstances') {
        updateOptions({
          includeInstances: event.currentTarget.checked,
        })
      }
    }
  }

  function handleActionClick(
    action: 'applyValue' | 'renameLayer' | 'highlightText',
  ) {
    return (event: JSX.TargetedEvent<HTMLButtonElement>) => {
      console.log('handleActionClick', action)

      const actionOptions = {
        targetTextRange: options.targetTextRange,
        includeComponents: options.includeComponents,
        includeInstances: options.includeInstances,
      }

      if (action === 'applyValue') {
        emit<ApplyValueHandler>('APPLY_VALUE', keyValues, actionOptions)
      } else if (action === 'renameLayer') {
        emit<RenameLayerHandler>('RENAME_LAYER', keyValues, actionOptions)
      } else if (action === 'highlightText') {
        emit<HighlightTextHandler>('HIGHLIGHT_TEXT', keyValues, actionOptions)
      }
    }
  }

  useMount(() => {
    console.log('Utilities mounted')
    resizeWindow()
  })

  useUnmount(() => {
    console.log('Utilities unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <Stack space="extraSmall">
        <div className="flex flex-col gap-1">
          <span>Target text range</span>
          <Dropdown
            onChange={handleTextRangeDropdownChange}
            options={targetTextRangeDropdownOptions}
            value={options.targetTextRange}
            variant="border"
          />
        </div>

        <Checkbox
          onChange={handleCheckboxClick('includeComponents')}
          value={options.includeComponents}
        >
          <Text>Include text in components</Text>
        </Checkbox>

        <Checkbox
          onChange={handleCheckboxClick('includeInstances')}
          value={options.includeInstances}
        >
          <Text>Include text in instances</Text>
        </Checkbox>
      </Stack>

      <VerticalSpace space="large" />

      <Stack space="small">
        <div className="flex flex-col gap-1">
          <Button
            fullWidth
            onClick={handleActionClick('applyValue')}
            disabled={keyValues.length === 0}
          >
            Apply value to text content
          </Button>
          <p className="text-secondary">
            Apply value property to text content obtained from layer name
            renamed to key property. You can pass parameters (e.g.,
            #userInfo?name=John&age=24). If there are variables in Notion
            database value, it will replace the text with that value in it.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            fullWidth
            onClick={handleActionClick('renameLayer')}
            disabled={keyValues.length === 0}
          >
            Rename layer from text content
          </Button>
          <p className="text-secondary">
            Rename layer to key property obtained from text content. The text
            content and the value property in Notion database must match
            exactly. Parameters are not supported. <br />
            It is useful when text in Figma and Notion are the same, but
            renaming the layers is cumbersome.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            fullWidth
            onClick={handleActionClick('highlightText')}
            disabled={keyValues.length === 0}
          >
            Highlight text layer
          </Button>
          <p className="text-secondary">
            Highlight text layer that has correct layer name format (# + Key
            property) and the key exists in Notion database. Text is highlighted
            in blue if the key is correct and exists. Text is highlighted in red
            if it's incorrect. <br />
            It is useful to check that the layer names are formatted correctly
            or that they have no typos.
          </p>
        </div>
      </Stack>

      <VerticalSpace space="medium" />
    </Container>
  )
}
