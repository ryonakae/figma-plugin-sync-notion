/** @jsx h */
import { type JSX, h } from 'preact'
import { useRef, useState } from 'preact/hooks'

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

import { useKeyValuesStore, useStore } from '@/ui/Store'
import useCache from '@/ui/hooks/useCache'
import useNotion from '@/ui/hooks/useNotion'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { NotionKeyValue, Options } from '@/types/common'
import type { NotifyHandler } from '@/types/eventHandler'

export default function Fetch() {
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
      message: 'Please wait a moment.',
    })

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
      message: 'Fetch finish.',
    })
  }

  function handleClearClick() {
    console.log('handleClearClick')

    // keyValuesStoreに空配列を入れる
    useKeyValuesStore.setState({ keyValues: [] })

    // 空配列をドキュメントにキャッシュ
    saveCacheToDocument([])

    emit<NotifyHandler>('NOTIFY', {
      message: 'Cache cleared.',
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
            onInput={handleInput('proxyUrl')}
            value={options.proxyUrl}
            placeholder="https://reverse-proxy.yourname.workers.dev/"
            disabled={fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Database ID</div>
          <Textbox
            variant="border"
            onInput={handleInput('databaseId')}
            value={options.databaseId}
            disabled={fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Integration token</div>
          <Textbox
            variant="border"
            onInput={handleInput('integrationToken')}
            value={options.integrationToken}
            disabled={fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Key property name</div>
          <Textbox
            variant="border"
            onInput={handleInput('keyPropertyName')}
            value={options.keyPropertyName}
            disabled={fetching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Value property name</div>
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
              !options.proxyUrl ||
              !options.databaseId ||
              !options.integrationToken ||
              !options.keyPropertyName ||
              !options.valuePropertyName ||
              fetching
            }
            loading={fetching}
          >
            Fetch text from Notion
          </Button>
          <p className="text-secondary">
            Fetches text from a database in Notion. The data is cached to this
            document and restored at next time it is launched. If you have
            updated Notion database, click this button again.
          </p>
        </div>

        <Button
          danger
          secondary
          fullWidth
          onClick={handleClearClick}
          disabled={keyValues.length === 0}
        >
          Clear cache ({keyValues.length} items)
        </Button>
      </Stack>

      <VerticalSpace space="medium" />
    </Container>
  )
}
