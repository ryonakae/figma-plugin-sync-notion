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
import { color, spacing } from '@/ui/styles'

const Main: React.FC = () => {
  const {
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    withHighlight,
    usingCache,
    cache,
    syncing,
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName,
    setWithHighlight,
    setUsingCache,
    setCache: setCacheToStore,
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
            withHighlight: options.withHighlight,
            usingCache: options.usingCache
          }
        }
      } as PostMessage,
      '*'
    )
  }

  function setCache(keyValues: KeyValue[]) {
    // codeにkeyValuesを送信
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set-cache',
          keyValues
        }
      } as PostMessage,
      '*'
    )

    // Storeにも保存
    setCacheToStore(keyValues)
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

    // usingCacheがtrueかつ、cacheが1つ以上あったらcacheを使う
    // そうじゃなかったらfetchNotionを実行
    if (usingCache && cache.length > 0) {
      console.log('using cache, fetchNotion is skipped')
      keyValuesRef.current = cache
    } else {
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

      // 取得したkeyValueをclientStorageに保存しておく
      setCache(keyValuesRef.current)
    }

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

  function onUsingCacheClick() {
    setUsingCache(!usingCache)
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
        withHighlight,
        usingCache
      })
    }, 300)
  }, [
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    withHighlight,
    usingCache
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

      <Spacer y={spacing[3]} />

      <VStack>
        <span
          css={css`
            color: ${color.subText};
          `}
        >
          Options
        </span>

        <Spacer y={spacing[1]} />

        <HStack justify="space-between">
          <span
            css={
              cache.length === 0 &&
              css`
                color: ${color.disabled};
              `
            }
          >
            <span>Using Cache </span>
            <span>
              {cache.length > 0 ? (
                <span>(Cached {cache.length} items)</span>
              ) : (
                <span>(No cache)</span>
              )}
            </span>
          </span>
          <SegmentedControl
            state={usingCache}
            onClick={onUsingCacheClick}
            disabled={cache.length === 0}
          />
        </HStack>

        <HStack justify="space-between">
          <span>Overlay Highlight</span>
          <SegmentedControl
            state={withHighlight}
            onClick={onSyncWithHighlightClick}
          />
        </HStack>
      </VStack>

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
    </VStack>
  )
}

export default Main
