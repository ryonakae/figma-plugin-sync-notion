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
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  const targetTextRangeDropdownOptions: DropdownOption[] &
    {
      value?: TargetTextRange
    }[] = [
    {
      text: t('Utilities.targetTextRange.options.selection'),
      value: 'selection',
    },
    {
      text: t('Utilities.targetTextRange.options.currentPage'),
      value: 'currentPage',
    },
    {
      text: t('Utilities.targetTextRange.options.allPages'),
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
          <span>{t('Utilities.targetTextRange.label')}</span>
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
          <Text>{t('Utilities.includeComponents')}</Text>
        </Checkbox>

        <Checkbox
          onChange={handleCheckboxClick('includeInstances')}
          value={options.includeInstances}
        >
          <Text>{t('Utilities.includeInstances')}</Text>
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
            {t('Utilities.applyValueButton.label')}
          </Button>
          <p className="text-secondary">
            {t('Utilities.applyValueButton.description')}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            fullWidth
            onClick={handleActionClick('renameLayer')}
            disabled={keyValues.length === 0}
          >
            {t('Utilities.renameLayerButton.label')}
          </Button>
          <p className="text-secondary">
            {t('Utilities.renameLayerButton.description')}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Button
            fullWidth
            onClick={handleActionClick('highlightText')}
            disabled={keyValues.length === 0}
          >
            {t('Utilities.highlightTextButton.label')}
          </Button>
          <p className="text-secondary">
            {t('Utilities.highlightTextButton.description')}
          </p>
        </div>
      </Stack>

      <VerticalSpace space="medium" />
    </Container>
  )
}
