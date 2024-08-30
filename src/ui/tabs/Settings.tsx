/** @jsx h */
import { type JSX, h } from 'preact'

import {
  Button,
  Container,
  Dropdown,
  type DropdownOption,
  Stack,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useTranslation } from 'react-i18next'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { PluginLanguage } from '@/types/common'
import type { ChangeLanguageHandler, NotifyHandler } from '@/types/eventHandler'

export default function Settings() {
  const { t } = useTranslation()
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  const languageDropdownOptions: DropdownOption[] &
    {
      value?: PluginLanguage
    }[] = [
    {
      text: t('Settings.language.options.english'),
      value: 'en',
    },
    {
      text: t('Settings.language.options.japanese'),
      value: 'ja',
    },
  ]

  async function handleLanguageDropdownChange(
    event: JSX.TargetedEvent<HTMLInputElement>,
  ) {
    const newLanguage = event.currentTarget.value as PluginLanguage

    // pluginLanguageをアップデート
    updateOptions({
      pluginLanguage: newLanguage,
    })

    // 言語切替
    emit<ChangeLanguageHandler>('CHANGE_LANGUAGE', newLanguage, {
      notify: true,
    })
  }

  useMount(() => {
    console.log('Settings mounted')
    resizeWindow()
  })

  useUnmount(() => {
    console.log('Settings unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <div className="flex flex-col gap-1">
        <span>{t('Settings.language.label')}</span>
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
          {t('Settings.buttons.pluginPage')}
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
          {t('Settings.buttons.github')}
        </Button>
      </Stack>

      <VerticalSpace space="medium" />
    </Container>
  )
}
