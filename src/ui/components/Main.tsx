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
    syncing,
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName,
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

    // ????????????????????????
    // ??????next_cursor?????????????????????start_cursor?????????
    const reqParams = {
      page_size: 100,
      start_cursor: next_cursor || undefined
    }

    // ?????????????????????fetch??????page??????????????????
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

    // pages??????????????????????????????
    if (!pages) {
      throw new Error('No pages in this database.')
    }

    // page?????????????????????
    pages.forEach(row => {
      // keyPropertyName??????????????????????????????????????????????????????
      if (!row.properties[keyPropertyName]) {
        throw new Error('Key property name is wrong.')
      }

      // valuePropertyName??????????????????????????????????????????????????????
      if (!row.properties[valuePropertyName]) {
        throw new Error('Value property name is wrong.')
      }

      // keyPropertyName??????property?????????
      const keyProperty = row.properties[keyPropertyName]
      // key???type???title, formula, text??????????????????????????????
      if (
        keyProperty.type !== 'title' &&
        keyProperty.type !== 'rich_text' &&
        keyProperty.type !== 'formula'
      ) {
        throw new Error('Key property type is wrong.')
      }
      // property???type???????????????key???????????????
      const key = getPropertyValue(keyProperty)

      // valuePropertyName??????property?????????
      const valueProperty = row.properties[valuePropertyName]
      // value???type???title, formula, text??????????????????????????????
      if (
        valueProperty.type !== 'title' &&
        valueProperty.type !== 'rich_text' &&
        valueProperty.type !== 'formula'
      ) {
        throw new Error('Value property type is wrong.')
      }
      // property???type???????????????value???????????????
      const value = getPropertyValue(valueProperty)

      // keyValues????????????key???value?????????
      keyValuesRef.current.push({
        id: row.id,
        key,
        value
      })
    })

    // res???has_more????????????true????????????fetchNotion?????????????????????
    // false????????????
    if (resJson.has_more) {
      await fetchNotion(resJson.next_cursor)
    } else {
      return
    }
  }

  async function onSyncClick() {
    console.log('onSyncClick')

    // ????????????sync????????????
    setSyncing(true)

    await fetchNotion().catch((e: Error) => {
      // ???????????????????????????
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

      // ??????????????????????????????????????????
      keyValuesRef.current = []

      // ???????????????????????????
      setSyncing(false)

      throw new Error(e.message)
    })

    // fetchNotion???????????????keyValues???Code????????????
    parent.postMessage(
      {
        pluginMessage: {
          type: 'sync',
          keyValues: keyValuesRef.current
        }
      } as PostMessage,
      '*'
    )

    // ??????????????????????????????????????????
    keyValuesRef.current = []
  }

  useUpdateEffect(() => {
    // ?????????????????????????????????debounce??????????????????????????????
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
    </VStack>
  )
}

export default Main
