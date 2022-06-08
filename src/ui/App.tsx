import { css, Global } from '@emotion/react'
import React, { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import 'ress'
import { useMount } from 'react-use'
import Store from '@/ui/Store'
import Main from '@/ui/components/Main'
import { typography, color } from '@/ui/styles'

const AppContent: React.FC = () => {
  const { setIntegrationToken, setDatabaseId } = Store.useContainer()

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
    setIntegrationToken(options.integrationToken)
    setDatabaseId(options.databaseId)
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

        default:
          break
      }
    }
  }

  function closePlugin() {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'close-plugin'
        }
      } as PostMessage,
      '*'
    )
    console.log('postMessage: close-plugin')
  }

  // listen keyboard shortcut
  useHotkeys(
    'esc',
    (event, handler) => {
      console.log('esc pressed', event, handler)
      closePlugin()
    },
    {
      enableOnTags: ['INPUT', 'SELECT', 'TEXTAREA']
    }
  )

  useMount(() => {
    console.log('AppContent mounted')
    getOptions()
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
