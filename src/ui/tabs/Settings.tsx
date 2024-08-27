/** @jsx h */
import { type JSX, h } from 'preact'

import {
  Button,
  Container,
  Dropdown,
  type DropdownOption,
  Link,
  Stack,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { PluginLanguage } from '@/types/common'
import type { NotifyHandler } from '@/types/eventHandler'

export default function Settings() {
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  const languageDropdownOptions: DropdownOption[] &
    {
      value?: PluginLanguage
    }[] = [
    {
      text: 'English',
      value: 'en',
    },
    {
      text: 'Japanese',
      value: 'ja',
    },
  ]

  function handleLanguageDropdownChange(
    event: JSX.TargetedEvent<HTMLInputElement>,
  ) {
    updateOptions({
      pluginLanguage: event.currentTarget.value as PluginLanguage,
    })
    emit<NotifyHandler>('NOTIFY', {
      message: 'Language updated.',
    })
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

      <div className="flex flex-col gap-1">
        <span>Language</span>
        <Dropdown
          onChange={handleLanguageDropdownChange}
          options={languageDropdownOptions}
          value={options.pluginLanguage}
          variant="border"
        />
      </div>

      <VerticalSpace space="large" />

      <Stack space="extraSmall">
        <Button
          secondary
          fullWidth
          onClick={() =>
            window.open(
              'https://www.figma.com/community/plugin/1116202373222780315/sync-notion',
              '_blank',
              'noopener, noreferrer',
            )
          }
        >
          Plugin page
        </Button>

        <Button
          secondary
          fullWidth
          onClick={() =>
            window.open(
              'https://github.com/ryonakae/figma-plugin-sync-notion',
              '_blank',
              'noopener, noreferrer',
            )
          }
        >
          GitHub
        </Button>
      </Stack>

      <VerticalSpace space="medium" />
    </Container>
  )
}
