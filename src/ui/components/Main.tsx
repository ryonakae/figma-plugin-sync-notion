import { css } from '@emotion/react'
import React, { ChangeEvent, useRef } from 'react'
import { useUpdateEffect } from 'react-use'
import Store from '@/ui/Store'
import Button from '@/ui/components/Button'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import { color, radius, size, spacing } from '@/ui/styles'
import { getPropertyValue } from '@/ui/util'

const Main: React.FC = () => {
  const {
    apiUrl,
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName
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

  async function fetchNotion(next_cursor?: string) {
    console.log(
      'fetchNotion',
      next_cursor,
      integrationToken,
      databaseId,
      keyPropertyName,
      valuePropertyName
    )

    // パラメータを定義
    // 引数next_cursorがある場合は、start_cursorを設定
    const reqParams = {
      page_size: 100,
      start_cursor: next_cursor || undefined
    }

    // データベースをfetchしてpageの配列を取得
    const res = await fetch(`${apiUrl}/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${integrationToken}`,
        'Notion-Version': '2021-08-16',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqParams)
    }).catch(() => {
      throw new Error('Failed to fetch database.')
    })
    const resJson = await res.json()
    console.log(resJson)
    const pages = resJson.results as NotionPage[]

    // pagesが無かったら処理中断
    if (!pages) {
      throw new Error('No pages in this database.')
    }

    // pageごとに処理実行
    pages.forEach(row => {
      // keyPropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[keyPropertyName]) {
        throw new Error('Key property name is wrong.')
      }

      // valuePropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[valuePropertyName]) {
        throw new Error('Value property name is wrong.')
      }

      // keyPropertyNameからpropertyを探す
      // propertyのtypeを判別してkeyを取得する
      const keyProperty = row.properties[keyPropertyName]
      const key = getPropertyValue(keyProperty)
      // keyが見つからなかった(title, formula, textでない)場合は処理中断
      if (!key) {
        throw new Error('Key property type is wrong.')
      }

      // valuePropertyNameからpropertyを探す
      // propertyのtypeを判別してvalueを取得する
      const valueProperty = row.properties[valuePropertyName]
      const value = getPropertyValue(valueProperty)
      // valueが見つからなかった(title, formula, textでない)場合は処理中断
      if (!value) {
        throw new Error('Value property type is wrong.')
      }

      // keyValuesの配列にkeyとvalueを追加
      keyValuesRef.current.push({
        id: row.id,
        key,
        value
      })
    })

    // resのhas_moreフラグがtrueなら再度fetchNotion関数を実行する
    // falseなら終了
    if (resJson.has_more) {
      await fetchNotion(resJson.next_cursor)
    } else {
      return
    }
  }

  async function onSyncClick() {
    console.log('onSyncClick')

    await fetchNotion().catch((e: Error) => {
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

  useUpdateEffect(() => {
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
          href="https://www.figma.com/plugin-docs/api/api-reference/"
          target="_blank"
          rel="noreferrer"
        >
          More information
        </a>
      </p>

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

      <div>Database ID</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="password"
        value={databaseId}
        onChange={onDatabaseIdChange}
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
      >
        <span>Sync Notion</span>
      </Button>
    </VStack>
  )
}

export default Main
