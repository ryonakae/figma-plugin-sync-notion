/** @jsx h */
import { type JSX, h } from 'preact'

import {
  Button,
  Container,
  Link,
  Stack,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import { useStore } from '@/ui/Store'
import useOptions from '@/ui/hooks/useOptions'
import useResizeWindow from '@/ui/hooks/useResizeWindow'

import type { Options } from '@/types/common'

export default function Fetch() {
  const options = useStore()
  const { updateOptions } = useOptions()
  const { resizeWindow } = useResizeWindow()

  function hundleInput(key: keyof Options) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      updateOptions({
        [key]: event.currentTarget.value,
      })
    }
  }

  useMount(() => {
    console.log('Fetch mounted')

    window.requestAnimationFrame(() => resizeWindow())
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
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Notion API URL</div>
          <Textbox
            variant="border"
            onInput={hundleInput('apiUrl')}
            value={options.apiUrl}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Database ID</div>
          <Textbox
            variant="border"
            onInput={hundleInput('databaseId')}
            value={options.databaseId}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Integration token</div>
          <Textbox
            variant="border"
            onInput={hundleInput('integrationToken')}
            value={options.integrationToken}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Key property name</div>
          <Textbox
            variant="border"
            onInput={hundleInput('keyPropertyName')}
            value={options.keyPropertyName}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Value property name</div>
          <Textbox
            variant="border"
            onInput={hundleInput('valuePropertyName')}
            value={options.valuePropertyName}
          />
        </div>
      </Stack>

      <VerticalSpace space="medium" />

      <div className="flex flex-col gap-1">
        <Button
          fullWidth
          // onClick={}
          disabled={
            !options.proxyUrl ||
            !options.apiUrl ||
            !options.databaseId ||
            !options.integrationToken ||
            !options.keyPropertyName ||
            !options.valuePropertyName
          }
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
