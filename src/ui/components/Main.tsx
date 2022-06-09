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
    keyPropertyName,
    valuePropertyName,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName
  } = Store.useContainer()
  const keyValuesRef = useRef<KeyValue[]>([])
  const keyPropertyNameRef = useRef(keyPropertyName)
  const valuePropertyNameRef = useRef(valuePropertyName)

  function setOptions(options: Options) {
    valuePropertyNameRef.current = options.valuePropertyName
    keyPropertyNameRef.current = options.keyPropertyName
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
    const results = json.results as NotionPage[]
    console.log(results, valuePropertyNameRef.current)

    results.forEach(row => {
      if (!row.properties[valuePropertyNameRef.current]) {
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

      const keyProperty = row.properties[keyPropertyNameRef.current]
      let key: string
      if (keyProperty.type === 'title') {
        if (keyProperty.title.length) {
          key = keyProperty.title[0].plain_text
        } else {
          key = ''
        }
      } else if (keyProperty.type === 'rich_text') {
        if (keyProperty.rich_text.length) {
          key = keyProperty.rich_text[0].plain_text
        } else {
          key = ''
        }
      } else if (keyProperty.type === 'formula') {
        key = keyProperty.formula.string
      } else {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'notify',
              message: 'Key property type is wrong.',
              options: {
                error: true
              }
            }
          } as PostMessage,
          '*'
        )
        throw new Error('Key property type is wrong.')
      }

      const valueProperty = row.properties[valuePropertyNameRef.current]
      let value: string
      if (valueProperty.type === 'title') {
        if (valueProperty.title.length) {
          value = valueProperty.title[0].plain_text
        } else {
          value = ''
        }
      } else if (valueProperty.type === 'rich_text') {
        if (valueProperty.rich_text.length) {
          value = valueProperty.rich_text[0].plain_text
        } else {
          value = ''
        }
      } else if (valueProperty.type === 'formula') {
        value = valueProperty.formula.string
      } else {
        parent.postMessage(
          {
            pluginMessage: {
              type: 'notify',
              message: 'Value property type is wrong.',
              options: {
                error: true
              }
            }
          } as PostMessage,
          '*'
        )
        throw new Error('Value property type is wrong.')
      }

      keyValuesRef.current.push({
        id: row.id,
        key,
        value
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
