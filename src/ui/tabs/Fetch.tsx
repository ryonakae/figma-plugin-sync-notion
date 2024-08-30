/** @jsx h */
import { type JSX, h } from 'preact'
import { useRef, useState } from 'preact/hooks'

import {
  Button,
  Container,
  Stack,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useTranslation } from 'react-i18next'
import { useMount, useUnmount } from 'react-use'

import { useKeyValuesStore, useStore } from '@/ui/Store'
import useCache from '@/ui/hooks/useCache'
import useNotion from '@/ui/hooks/useNotion'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue, Options } from '@/types/common'
import type { NotifyHandler } from '@/types/eventHandler'

export default function Fetch() {
  const { t } = useTranslation()
  const options = useStore()
  const { keyValues } = useKeyValuesStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const { fetchNotion } = useNotion()
  const { saveCacheToDocument } = useCache()
  const [fetching, setFetching] = useState(false)
  const keyValuesRef = useRef<NotionKeyValue[]>([])

  function handleInput(key: keyof Options) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      updateOptions({
        [key]: event.currentTarget.value,
      })
    }
  }

  async function handleFetchClick() {
    setFetching(true)

    emit<NotifyHandler>('NOTIFY', {
      message: t('notifications.Fetch.loading'),
    })

    // keyValuesRefをクリア
    keyValuesRef.current = []

    await fetchNotion({
      proxyUrl: process.env.PROXY_URL as string,
      integrationToken: options.integrationToken,
      databaseId: options.databaseId,
      keyPropertyName: options.keyPropertyName,
      valuePropertyName: options.valuePropertyName,
      keyValuesArray: keyValuesRef.current,
    }).catch((error: Error) => {
      emit<NotifyHandler>('NOTIFY', {
        message: error.message,
        options: {
          error: true,
        },
      })
      setFetching(false)
      throw new Error(error.message)
    })

    console.log('fetch done', keyValuesRef.current)

    // keyValuesをkeyValuesStoreに保存
    useKeyValuesStore.setState({ keyValues: keyValuesRef.current })

    // keyValuesをドキュメントにキャッシュ
    saveCacheToDocument(keyValuesRef.current)

    setFetching(false)

    emit<NotifyHandler>('NOTIFY', {
      message: t('notifications.Fetch.finish'),
    })
  }

  function handleClearClick() {
    console.log('handleClearClick')

    // keyValuesStoreに空配列を入れる
    useKeyValuesStore.setState({ keyValues: [] })

    // 空配列をドキュメントにキャッシュ
    saveCacheToDocument([])

    emit<NotifyHandler>('NOTIFY', {
      message: t('notifications.Fetch.clearCache'),
    })
  }

  useMount(() => {
    console.log('Fetch mounted')
    resizeWindow()
  })

  useUnmount(() => {
    console.log('Fetch unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <Stack space="small">
        <div className="flex flex-col gap-1">
          <div>{t('Fetch.databaseId')}</div>
          <Textbox
            variant="border"
            onInput={handleInput('databaseId')}
            value={options.databaseId}
            disabled={fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>{t('Fetch.integrationToken')}</div>
          <Textbox
            variant="border"
            onInput={handleInput('integrationToken')}
            value={options.integrationToken}
            disabled={fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>{t('Fetch.keyPropertyName')}</div>
          <Textbox
            variant="border"
            onInput={handleInput('keyPropertyName')}
            value={options.keyPropertyName}
            disabled={fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>{t('Fetch.valuePropertyName')}</div>
          <Textbox
            variant="border"
            onInput={handleInput('valuePropertyName')}
            value={options.valuePropertyName}
            disabled={fetching}
          />
        </div>
      </Stack>

      <VerticalSpace space="large" />

      <Stack space="small">
        <div className="flex flex-col gap-1">
          <Button
            fullWidth
            onClick={handleFetchClick}
            disabled={
              !options.databaseId ||
              !options.integrationToken ||
              !options.keyPropertyName ||
              !options.valuePropertyName ||
              fetching
            }
            loading={fetching}
          >
            {t('Fetch.fetchButton.label')}
          </Button>
          <p className="text-secondary">{t('Fetch.fetchButton.description')}</p>
        </div>

        <Button
          danger
          secondary
          fullWidth
          onClick={handleClearClick}
          disabled={keyValues.length === 0}
        >
          {t('Fetch.clearCacheButton', { length: keyValues.length })}
        </Button>
      </Stack>

      <VerticalSpace space="medium" />
    </Container>
  )
}
