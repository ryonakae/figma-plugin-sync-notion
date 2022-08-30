import { css } from '@emotion/react'
import React, { ChangeEvent, useRef } from 'react'
import { useUpdateEffect } from 'react-use'
import Store from '@/ui/Store'
import Button from '@/ui/components/Button'
import HStack from '@/ui/components/HStack'
import Input from '@/ui/components/Input'
import SegmentedControl from '@/ui/components/SegmentedControl'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import fetchNotion from '@/ui/functions/fetchNotion'
import { spacing } from '@/ui/styles'

const Main: React.FC = () => {
  const {
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    withHighlight,
    syncing,
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName,
    setWithHighlight,
    setSyncing
  } = Store.useContainer()
  const keyValuesRef = useRef<KeyValue[]>([])
  const debounceTimer = useRef(0)

  function setOptions(options: Options) {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set-options',
          options: {
            apiUrl: options.apiUrl,
            integrationToken: options.integrationToken,
            databaseId: options.databaseId,
            keyPropertyName: options.keyPropertyName,
            valuePropertyName: options.valuePropertyName,
            withHighlight: options.withHighlight
          }
        }
      } as PostMessage,
      '*'
    )
  }

  function onApiUrlChange(event: ChangeEvent<HTMLInputElement>) {
    setApiUrl(event.target.value)
  }

  function onIntegrationTokenChange(event: ChangeEvent<HTMLInputElement>) {
    setIntegrationToken(event.target.value)
  }

  function onDatabaseIdChange(event: ChangeEvent<HTMLInputElement>) {
    setDatabaseId(event.target.value)
  }

  function onKeyPropertyNameChange(event: ChangeEvent<HTMLInputElement>) {
    setKeyPropertyName(event.target.value)
  }

  function onValuePropertyNameChange(event: ChangeEvent<HTMLInputElement>) {
    setValuePropertyName(event.target.value)
  }

  async function onSyncClick() {
    console.log('onSyncClick, withHighlight:', withHighlight)

    // ボタンをsync中にする
    setSyncing(true)

    await fetchNotion({
      apiUrl,
      integrationToken,
      databaseId,
      keyPropertyName,
      valuePropertyName,
      keyValuesArray: keyValuesRef.current
    }).catch((e: Error) => {
      // エラートースト表示
      parent.postMessage(
        {
          pluginMessage: {
            type: 'notify',
            message: e.message,
            options: {
              error: true
            }
          }
        } as PostMessage,
        '*'
      )

      // 配列を空にしてクリーンアップ
      keyValuesRef.current = []

      // ボタンを通常に戻す
      setSyncing(false)

      throw new Error(e.message)
    })

    // fetchNotionで取得したkeyValuesをCode側に送る
    parent.postMessage(
      {
        pluginMessage: {
          type: 'sync',
          keyValues: keyValuesRef.current,
          withHighlight
        }
      } as PostMessage,
      '*'
    )

    // 配列を空にしてクリーンアップ
    keyValuesRef.current = []
  }

  function onSyncWithHighlightClick() {
    setWithHighlight(!withHighlight)
  }

  useUpdateEffect(() => {
    // 設定値が変更されたら、debounceさせてから設定を保存
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      setOptions({
        apiUrl,
        integrationToken,
        databaseId,
        keyPropertyName,
        valuePropertyName,
        withHighlight
      })
    }, 300)
  }, [
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    withHighlight
  ])

  return (
    <VStack
      css={css`
        position: relative;
        height: 100%;
        padding: ${spacing[3]};
      `}
    >
      <Input
        title="Notion API URL"
        rightContent={
          <a
            href="https://github.com/ryonakae/figma-plugin-sync-notion#%EF%B8%8F-create-a-reverse-proxy-to-avoid-cors-errors"
            target="_blank"
            rel="noreferrer"
          >
            More information
          </a>
        }
        type="url"
        value={apiUrl}
        placeholder="https://reverse-proxy.yourname.workers.dev/https://api.notion.com"
        onChange={onApiUrlChange}
      />

      <Spacer y={spacing[2]} />

      <Input
        title="Database ID"
        type="text"
        value={databaseId}
        onChange={onDatabaseIdChange}
      />

      <Spacer y={spacing[2]} />

      <Input
        title="Integration Token"
        type="password"
        value={integrationToken}
        onChange={onIntegrationTokenChange}
      />

      <Spacer y={spacing[2]} />

      <Input
        title="Key Name"
        type="text"
        value={keyPropertyName}
        onChange={onKeyPropertyNameChange}
      />

      <Spacer y={spacing[2]} />

      <Input
        title="Value Name"
        type="text"
        value={valuePropertyName}
        onChange={onValuePropertyNameChange}
      />

      <Spacer stretch={true} />

      <Button
        type="primary"
        onClick={onSyncClick}
        disabled={
          !apiUrl ||
          !integrationToken ||
          !databaseId ||
          !keyPropertyName ||
          !valuePropertyName
        }
        loading={syncing}
      >
        <span>{syncing ? 'Syncing...' : 'Sync Notion'}</span>
      </Button>

      <Spacer y={spacing[2]} />

      <HStack justify="space-between">
        <span>Sync with Highlight</span>

        <SegmentedControl
          state={withHighlight}
          onClick={onSyncWithHighlightClick}
        />
      </HStack>
    </VStack>
  )
}

export default Main
