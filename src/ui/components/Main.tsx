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

const Main: React.FC = () => {
  const {
    integrationToken,
    databaseId,
    valueName,
    setIntegrationToken,
    setDatabaseId,
    setValueName
  } = Store.useContainer()
  const keyValuesRef = useRef<KeyValue[]>([])
  const valueNameRef = useRef(valueName)

  function setOptions(options: Options) {
    valueNameRef.current = options.valueName
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set-options',
          options: {
            integrationToken: options.integrationToken,
            databaseId: options.databaseId,
            valueName: options.valueName
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

  function onValueNameChange(event: ChangeEvent<HTMLInputElement>) {
    console.log('onValueNameChange', event)
    setValueName(event.target.value)
  }

  async function fetchNotion(next_cursor?: string) {
    console.log('fetchNotion', next_cursor)

    const reqParams = {
      page_size: 100,
      start_cursor: undefined as string | undefined
    }
    if (next_cursor) {
      reqParams.start_cursor = next_cursor
    }

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
    const json = await res.json()
    const results = json.results as NotionRow[]

    results.forEach(row => {
      if (!row.properties[valueNameRef.current]) {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'notify',
              message: 'Value property name is wrong.',
              options: {
                error: true
              }
            }
          } as PostMessage,
          '*'
        )
        throw new Error('Value property name is wrong.')
      }

      keyValuesRef.current.push({
        id: row.id,
        key: (row.properties.keyName as NotionColumFomula).formula.string,
        value: (row.properties[valueNameRef.current] as NotionColumText)
          .rich_text[0].plain_text
      })
    })

    if (json.has_more) {
      await fetchNotion(json.next_cursor)
    } else {
      return
    }
  }

  async function onSyncClick() {
    console.log('onSyncClick')

    await fetchNotion()

    parent.postMessage(
      {
        pluginMessage: {
          type: 'sync',
          keyValues: keyValuesRef.current
        }
      } as PostMessage,
      '*'
    )
    keyValuesRef.current = []
  }

  useUpdateEffect(() => {
    setOptions({ integrationToken, databaseId, valueName })
  }, [integrationToken, databaseId, valueName])

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
      <input css={inputStyle} type="text" disabled />

      <Spacer y={spacing[3]} />

      <div>Value Property Name</div>
      <Spacer y={spacing[1]} />
      <input
        css={inputStyle}
        type="text"
        value={valueName}
        onChange={onValueNameChange}
      />

      <Spacer stretch={true} />

      <Button type="primary" onClick={onSyncClick}>
        <span>Sync Notion</span>
      </Button>
    </VStack>
  )
}

export default Main
