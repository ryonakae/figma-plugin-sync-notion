import { css } from '@emotion/react'
import React, { ChangeEvent, useRef } from 'react'
import { useUpdateEffect } from 'react-use'
import Store from '@/ui/Store'
import Button from '@/ui/components/Button'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import fetchNotion from '@/ui/functions/fetchNotion'
import { color, radius, size, spacing } from '@/ui/styles'

const Main: React.FC = () => {
  const {
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    syncing,
    highlighting,
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName,
    setSyncing,
    setHighlighting
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
            valuePropertyName: options.valuePropertyName
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
    console.log('onSyncClick')

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
          keyValues: keyValuesRef.current
        }
      } as PostMessage,
      '*'
    )

    // 配列を空にしてクリーンアップ
    keyValuesRef.current = []
  }

  async function onHighlightClick() {
    console.log('onHighlightClick')

    // ボタンをsync中にする
    setHighlighting(true)

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
          type: 'highlight',
          keyValues: keyValuesRef.current
        }
      } as PostMessage,
      '*'
    )

    // 配列を空にしてクリーンアップ
    keyValuesRef.current = []
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
        valuePropertyName
      })
    }, 500)
  }, [apiUrl, integrationToken, databaseId, keyPropertyName, valuePropertyName])

  const inputStyle = css`
    height: ${size.input};
    border: 1px solid ${color.input};
    border-radius: ${radius.input};
    padding: 0 ${spacing[2]};

    &:hover {
      border-color: ${color.inputHover};
    }
    &:focus {
      border: 2px solid ${color.primary};
      margin: 0 -1px;
    }
  `

  return (
    <VStack
      css={css`
        position: relative;
        height: 100%;
        padding: ${spacing[3]};
      `}
    >
      <div>Notion API URL</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="url"
        value={apiUrl}
        onChange={onApiUrlChange}
      />
      <Spacer y={spacing[1]} />
      <p
        css={css`
          color: ${color.subText};
        `}
      >
        To avoid CORS errors, a reverse proxy is required.
        <br />
        e.g. https://reverse-proxy-url/https://api.notion.com
        <br />
        <a
          href="https://github.com/ryonakae/figma-plugin-sync-notion#%EF%B8%8F-create-a-reverse-proxy-to-avoid-cors-errors"
          target="_blank"
          rel="noreferrer"
        >
          More information
        </a>
      </p>

      <Spacer y={spacing[2]} />

      <div>Database ID</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="text"
        value={databaseId}
        onChange={onDatabaseIdChange}
      />

      <Spacer y={spacing[2]} />

      <div>Integration Token</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="password"
        value={integrationToken}
        onChange={onIntegrationTokenChange}
      />

      <Spacer y={spacing[2]} />

      <div>Key Property Name</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="text"
        value={keyPropertyName}
        onChange={onKeyPropertyNameChange}
      />

      <Spacer y={spacing[2]} />

      <div>Value Property Name</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
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
      <Spacer y={spacing[1]} />
      <p
        css={css`
          color: ${color.subText};
          text-align: center;
        `}
      >
        Sync all text contained in the selected element.
        <br />
        If nothing is selected, all text on this page will be synced.
      </p>

      <Spacer y={spacing[2]} />

      <Button type="border" onClick={onHighlightClick} loading={highlighting}>
        <span>{highlighting ? 'Highlighting...' : 'Highlight Text'}</span>
      </Button>
      <Spacer y={spacing[1]} />
      <p
        css={css`
          color: ${color.subText};
          text-align: center;
        `}
      >
        Highlight the text that has correct layer name:
        <br />
        {'#KeyPropertyNameOfNotion'}.
      </p>
    </VStack>
  )
}

export default Main
