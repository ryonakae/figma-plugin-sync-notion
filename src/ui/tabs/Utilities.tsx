/** @jsx h */
import { type JSX, h } from 'preact'

import {
  Button,
  Checkbox,
  Container,
  Divider,
  Dropdown,
  type DropdownOption,
  Stack,
  Text,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { TargetTextRange } from '@/types/common'

export default function Utilities() {
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  const targetTextRangeDropdownOptions: DropdownOption[] = [
    {
      text: 'Selection',
      value: 'selection' as TargetTextRange,
    },
    {
      text: 'Current page',
      value: 'currentPage' as TargetTextRange,
    },
    {
      text: 'All pages',
      value: 'allPages' as TargetTextRange,
    },
  ]

  function handleTextRangeDropdownChange(
    event: JSX.TargetedEvent<HTMLInputElement>,
  ) {
    updateOptions({
      targetTextRange: event.currentTarget.value as TargetTextRange,
    })
  }

  function handleRenameClick() {
    console.log('handleRenameClick')
  }

  function handleHighlightClick() {
    console.log('handleHighlightClick')
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
          // onChange={}
          value={options.includeComponents}
        >
          <Text>Include text in components</Text>
        </Checkbox>

        <Checkbox
          // onChange={}
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
            // onClick={}
          >
            Apply value to text content
          </Button>
          <p className="text-secondary">
            Rename layer to key property obtained from text content. It is
            useful when text in Figma and Notion are the same, but renaming the
            layers is cumbersome.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button fullWidth onClick={handleRenameClick}>
            Rename layer from text content
          </Button>
          <p className="text-secondary">
            Rename layer to key property obtained from text content. It is
            useful when text in Figma and Notion are the same, but renaming the
            layers is cumbersome.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button fullWidth onClick={handleHighlightClick}>
            Highlight text layer
          </Button>
          <p className="text-secondary">
            Highlight text layer that has correct layer name format (# + Key
            property). Text is highlighted in blue if the key is correct and in
            red if it's incorrect. It is useful to check that the layer names
            are formatted correctly or that they have no typos.
          </p>
        </div>
      </Stack>

      <VerticalSpace space="medium" />
    </Container>
  )
}
