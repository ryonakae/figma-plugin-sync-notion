const CLIENT_STORAGE_KEY_NAME = 'sync-notion'

const defaultOptions: Options = {
  integrationToken: '',
  databaseId: ''
}

async function closePlugin() {
  figma.closePlugin()
}

function notify(msg: NotifyMessage) {
  const message = msg.message
  const options = msg.options || undefined
  figma.notify(message, options)
}

async function getOptions() {
  const options: Options =
    (await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY_NAME)) ||
    defaultOptions

  figma.ui.postMessage({
    type: 'get-options-success',
    options
  } as PluginMessage)

  console.log('getOptions success', options)
}

async function setOptions(msg: SetOptionsMessage) {
  const currentOptions: Options =
    (await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY_NAME)) ||
    defaultOptions

  const newOptions: Options = {
    ...(currentOptions || defaultOptions),
    ...msg.options
  }

  await figma.clientStorage.setAsync(CLIENT_STORAGE_KEY_NAME, newOptions)

  console.log('setOptions success', newOptions)
}

figma.ui.onmessage = (msg: PluginMessage) => {
  switch (msg.type) {
    case 'close-plugin':
      closePlugin()
      break

    case 'notify':
      notify(msg)
      break

    case 'get-options':
      getOptions()
      break

    case 'set-options':
      setOptions(msg)
      break

    default:
      break
  }
}

figma.showUI(__html__, {
  width: 300,
  height: 300
})
