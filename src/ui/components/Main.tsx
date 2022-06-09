import { css } from '@emotion/react'
import React, { ChangeEvent, useRef } from 'react'
import { useUpdateEffect } from 'react-use'
import Store from '@/ui/Store'
import Button from '@/ui/components/Button'
import Divider from '@/ui/components/Divider'
import HStack from '@/ui/components/HStack'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import { color, radius, size, spacing } from '@/ui/styles'
import { getPropertyValue, notify } from '@/ui/util'

const Main: React.FC = () => {
  const {
    integrationToken,
    databaseId,
    keyPropertyName,
    valuePropertyName,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName
  } = Store.useContainer()
  const keyValuesRef = useRef<KeyValue[]>([])

  function setOptions(options: Options) {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set-options',
          options: {
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

  function onIntegrationTokenChange(event: ChangeEvent<HTMLInputElement>) {
    console.log('onIntegrationTokenChange')
    setIntegrationToken(event.target.value)
  }

  function onDatabaseIdChange(event: ChangeEvent<HTMLInputElement>) {
    console.log('onDatabaseIdChange', event)
    setDatabaseId(event.target.value)
  }

  function onKeyPropertyNameChange(event: ChangeEvent<HTMLInputElement>) {
    console.log('onKeyPropertyNameChange', event)
    setKeyPropertyName(event.target.value)
  }

  function onValuePropertyNameChange(event: ChangeEvent<HTMLInputElement>) {
    console.log('onValuePropertyNameChange', event)
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
    const res = await fetch(
      `https://cors.ryonakae.workers.dev/https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${integrationToken}`,
          'Notion-Version': '2021-08-16',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqParams)
      }
    )
    const resJson = await res.json()
    const pages = resJson.pages as NotionPage[]
    console.log(pages, valuePropertyName)

    // pageごとに処理実行
    pages.forEach(row => {
      // keyPropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[keyPropertyName]) {
        notify('Key property name is wrong.', {
          error: true
        })
        throw new Error('Key property name is wrong.')
      }

      // valuePropertyNameと同じプロパティが無かったら処理中断
      if (!row.properties[valuePropertyName]) {
        notify('Value property name is wrong.', {
          error: true
        })
        throw new Error('Value property name is wrong.')
      }

      // keyPropertyNameからpropertyを探す
      // propertyのtypeを判別してkeyを取得する
      const keyProperty = row.properties[keyPropertyName]
      const key = getPropertyValue(keyProperty)
      // keyが見つからなかったら処理中断
      if (!key) {
        notify('Key property type is wrong.', {
          error: true
        })
        throw new Error('Key property type is wrong.')
      }

      // valuePropertyNameからpropertyを探す
      // propertyのtypeを判別してvalueを取得する
      const valueProperty = row.properties[valuePropertyName]
      const value = getPropertyValue(valueProperty)
      // valueが見つからなかったら処理中断
      if (!value) {
        notify('Value property type is wrong.', {
          error: true
        })
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

    await fetchNotion()

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
    setOptions({
      integrationToken,
      databaseId,
      keyPropertyName,
      valuePropertyName
    })
  }, [integrationToken, databaseId, keyPropertyName, valuePropertyName])

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
      <div>Integration Token</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="password"
        value={integrationToken}
        onChange={onIntegrationTokenChange}
      />

      <Spacer y={spacing[3]} />

      <div>Database ID</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="password"
        value={databaseId}
        onChange={onDatabaseIdChange}
      />

      <Spacer y={spacing[3]} />

      <div>Key Property Name</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="text"
        value={keyPropertyName}
        onChange={onKeyPropertyNameChange}
      />

      <Spacer y={spacing[3]} />

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
