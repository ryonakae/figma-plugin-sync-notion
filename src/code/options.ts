const CLIENT_STORAGE_KEY_NAME = 'sync-notion'

export const defaultOptions: Options = {
  apiUrl: '',
  integrationToken: '',
  databaseId: '',
  keyPropertyName: '',
  valuePropertyName: '',
  withHighlight: false
}

export async function getOptions(): Promise<Options> {
  // オプションをDocumentから取得、無かったらdefaultOptionsを参照
  const documentOptions: DocumentOptions = {
    apiUrl: figma.root.getPluginData('apiUrl') || defaultOptions.apiUrl,
    integrationToken:
      figma.root.getPluginData('integrationToken') ||
      defaultOptions.integrationToken,
    databaseId:
      figma.root.getPluginData('databaseId') || defaultOptions.databaseId,
    keyPropertyName:
      figma.root.getPluginData('keyPropertyName') ||
      defaultOptions.keyPropertyName
  }

  // オプションをclientStorageから取得、無かったらdefaultOptionsを参照
  const clientStorageOptions: ClientStorageOptions =
    (await figma.clientStorage.getAsync(CLIENT_STORAGE_KEY_NAME)) || {
      valuePropertyName: defaultOptions.valuePropertyName,
      withHighlight: defaultOptions.withHighlight
    }

  // documentOptionsとclientStorageをマージ
  const options: Options = { ...documentOptions, ...clientStorageOptions }

  return options
}

export async function setOptions(msg: SetOptionsMessage) {
  // 現在のオプションをDocumentから取得、無かったらdefaultOptionsを参照
  const currentOptions = getOptions()

  // UIから送られてきたオプションを現在のものとマージ
  const newOptions: Options = {
    ...(currentOptions || defaultOptions),
    ...msg.options
  }

  // 新しいオプションをDocumentに保存
  figma.root.setPluginData('apiUrl', newOptions.apiUrl)
  figma.root.setPluginData('integrationToken', newOptions.integrationToken)
  figma.root.setPluginData('databaseId', newOptions.databaseId)
  figma.root.setPluginData('keyPropertyName', newOptions.keyPropertyName)

  // 新しいオプションをclientStorageに保存
  await figma.clientStorage.setAsync(CLIENT_STORAGE_KEY_NAME, {
    valuePropertyName: newOptions.valuePropertyName,
    withHighlight: newOptions.withHighlight
  } as ClientStorageOptions)

  console.log('setOptions success', newOptions)
}
