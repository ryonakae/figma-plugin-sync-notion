import { css } from '@emotion/react'
import axios, { AxiosError } from 'axios'
import React, { ChangeEvent, useEffect } from 'react'
import { useMount, useUnmount } from 'react-use'
import Store from '@/ui/Store'
import Button from '@/ui/components/Button'
import Divider from '@/ui/components/Divider'
import HStack from '@/ui/components/HStack'
import Spacer from '@/ui/components/Spacer'
import VStack from '@/ui/components/VStack'
import { spacing } from '@/ui/styles'

const Main: React.FC = () => {
  const { integrationToken, databaseId, setIntegrationToken, setDatabaseId } =
    Store.useContainer()

  function setOptions() {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'set-options',
          options: {
            integrationToken,
            databaseId
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

  async function onSyncClick() {
    console.log('onSyncClick')
    const res = await fetch(
      `https://cors.ryonakae.workers.dev/https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${integrationToken}`,
          'Notion-Version': '2021-08-16',
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(res)
  }

  useEffect(() => {
    setOptions()
  }, [integrationToken, databaseId])

  return (
    <VStack
      css={css`
        position: relative;
        height: 100%;
      `}
    >
      <div>Integration Token</div>
      <input
        type="text"
        value={integrationToken}
        onChange={onIntegrationTokenChange}
      />

      <Spacer y="16px" />

      <div>Database Id</div>
      <input type="text" value={databaseId} onChange={onDatabaseIdChange} />

      <Spacer stretch={true} />

      <Button type="primary" onClick={onSyncClick}>
        <span>Sync Notion</span>
      </Button>
    </VStack>
  )
}

export default Main
