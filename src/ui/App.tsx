import { css, Global } from '@emotion/react'
import React, { useState } from 'react'
import 'ress'
import { useMount } from 'react-use'
import Store from '@/ui/Store'
import Main from '@/ui/components/Main'
import { typography, color } from '@/ui/styles'

const AppContent: React.FC = () => {
  const {
    setApiUrl,
    setIntegrationToken,
    setDatabaseId,
    setKeyPropertyName,
    setValuePropertyName,
    setWithHighlight,
    setSyncing,
    setUsingCache,
    setCache
  } = Store.useContainer()

  function getOptions() {
    parent.postMessage(
      {
        pluginMessage: { type: 'get-options' }
      } as PostMessage,
      '*'
    )
    console.log('postMessage: get-options')
  }

  function updateOptions(pluginMessage: GetOptionsSuccessMessage) {
    const options = pluginMessage.options
    setApiUrl(options.apiUrl)
    setIntegrationToken(options.integrationToken)
    setDatabaseId(options.databaseId)
    setKeyPropertyName(options.keyPropertyName)
    setValuePropertyName(options.valuePropertyName)
    setWithHighlight(options.withHighlight)
    setUsingCache(options.usingCache)
  }

  function getCache() {
    parent.postMessage(
      {
        pluginMessage: { type: 'get-cache' }
      } as PostMessage,
      '*'
    )
  }

  function listenPluginMessage() {
    console.log('listening pluginMessage...')

    onmessage = event => {
      if (!event.data.pluginMessage) {
        return
      }

      const pluginMessage: PluginMessage = event.data.pluginMessage

      switch (pluginMessage.type) {
        case 'get-options-success':
          updateOptions(pluginMessage)
          break

        case 'get-cache-success':
          setCache(pluginMessage.keyValues)
          break

        case 'sync-failed':
          setSyncing(false)
          break

        case 'sync-success':
          setSyncing(false)
          break

        default:
          break
      }
    }
  }

  useMount(() => {
    console.log('AppContent mounted')
    getOptions()
    getCache()
    listenPluginMessage()
  })

  return (
    <>
      <Global
        styles={css`
          body {
            font-family: ${typography.fontFamily};
            font-size: ${typography.fontSize};
            line-height: ${typography.lineHeight};
            font-weight: ${typography.fontWeightDefault};
            background-color: ${color.bg};
            cursor: default;
            user-select: none;
          }

          :any-link {
            color: ${color.primary};
            text-decoration: none;
            cursor: default;

            &:hover {
              cursor: pointer;
            }
          }

          #plugin {
            width: 100vw;
            height: 100vh;
          }
        `}
      />
      <Main />
    </>
  )
}

const App: React.FC = () => {
  return (
    <Store.Provider>
      <AppContent />
    </Store.Provider>
  )
}

export default App
