/** @jsx h */
import { type JSX, h } from 'preact'
import { useRef } from 'preact/hooks'

import {
  Button,
  Container,
  Link,
  Stack,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useCache from '@/ui/hooks/useCache'
import useNotion from '@/ui/hooks/useNotion'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue, Options } from '@/types/common'
import type { NotifyHandler } from '@/types/eventHandler'

export default function Fetch() {
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()
  const { fetchNotion } = useNotion()
  const { saveCacheToDocument } = useCache()
  const keyValuesRef = useRef<NotionKeyValue[]>([])

  function hundleInput(key: keyof Options) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      updateOptions({
        [key]: event.currentTarget.value,
      })
    }
  }

  async function handleFetchClick() {
    updateOptions({ fetching: true })

    // keyValuesRefをクリア
    keyValuesRef.current = []

    await fetchNotion({
      proxyUrl: options.proxyUrl,
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
      updateOptions({ fetching: false })
      throw new Error(error.message)
    })

    console.log('fetch done', keyValuesRef.current)

    // keyValuesをドキュメントにキャッシュ
    saveCacheToDocument(keyValuesRef.current)

    updateOptions({ fetching: false })
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
          <div className="flex justify-between">
            <div>Reverse proxy URL</div>
            <Link
              href="https://github.com/ryonakae/figma-plugin-sync-notion#%EF%B8%8F-create-a-reverse-proxy-to-avoid-cors-errors"
              target="_blank"
              rel="noreferrer"
            >
              More information
            </Link>
          </div>
          <Textbox
            variant="border"
            onInput={hundleInput('proxyUrl')}
            value={options.proxyUrl}
            placeholder="https://reverse-proxy.yourname.workers.dev/"
            disabled={options.fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Database ID</div>
          <Textbox
            variant="border"
            onInput={hundleInput('databaseId')}
            value={options.databaseId}
            disabled={options.fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Integration token</div>
          <Textbox
            variant="border"
            onInput={hundleInput('integrationToken')}
            value={options.integrationToken}
            disabled={options.fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Key property name</div>
          <Textbox
            variant="border"
            onInput={hundleInput('keyPropertyName')}
            value={options.keyPropertyName}
            disabled={options.fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Value property name</div>
          <Textbox
            variant="border"
            onInput={hundleInput('valuePropertyName')}
            value={options.valuePropertyName}
            disabled={options.fetching}
          />
        </div>
      </Stack>

      <VerticalSpace space="medium" />

      <div className="flex flex-col gap-1">
        <Button
          fullWidth
          onClick={handleFetchClick}
          disabled={
            !options.proxyUrl ||
            !options.databaseId ||
            !options.integrationToken ||
            !options.keyPropertyName ||
            !options.valuePropertyName ||
            options.fetching
          }
          loading={options.fetching}
        >
          Fetch text from Notion
        </Button>
        <p className="text-secondary">
          Fetches text from a database in Notion. The data is cached in the
          plugin and restored the next time it is launched. If you have updated
          the Notion database, click this button again.
        </p>
      </div>

      <VerticalSpace space="medium" />
    </Container>
  )
}
