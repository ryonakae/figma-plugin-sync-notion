type DocumentOptions = {
  apiUrl: string
  integrationToken: string
  databaseId: string
  keyPropertyName: string
}
type ClientStorageOptions = {
  valuePropertyName: string
  withHighlight: boolean
  usingCache: boolean
}

type Options = DocumentOptions & ClientStorageOptions

type ClosePluginMessage = {
  type: 'close-plugin'
}
type NotifyMessage = {
  type: 'notify'
  message: string
  options?: NotificationOptions
}
type GetOptionsMessage = {
  type: 'get-options'
}
type GetOptionsSuccessMessage = {
  type: 'get-options-success'
  options: Options
}
type SetOptionsMessage = {
  type: 'set-options'
  options: Options
}
type SyncMessage = {
  type: 'sync'
  keyValues: KeyValue[]
  withHighlight: boolean
}
type SyncSuccessMessage = {
  type: 'sync-success'
}
type SyncFailedMessage = {
  type: 'sync-failed'
}
type GetCacheMessage = {
  type: 'get-cache'
}
type GetCacheSuccessMessage = {
  type: 'get-cache-success'
  keyValues: KeyValue[]
}
type SetCacheMessage = {
  type: 'set-cache'
  keyValues: KeyValue[]
}

type PluginMessage =
  | ClosePluginMessage
  | NotifyMessage
  | GetOptionsMessage
  | GetOptionsSuccessMessage
  | SetOptionsMessage
  | SyncMessage
  | SyncSuccessMessage
  | SyncFailedMessage
  | GetCacheMessage
  | GetCacheSuccessMessage
  | SetCacheMessage

type PostMessage = {
  pluginMessage: PluginMessage
}

type NotionTitle = {
  type: 'title'
  title: { plain_text: string }[]
}
type NotionFomula = {
  type: 'formula'
  formula: {
    string: string
  }
}
type NotionRichText = {
  type: 'rich_text'
  rich_text: { plain_text: string }[]
}
type NotionPage = {
  object: 'page'
  id: string
  properties: {
    [key: string]: NotionTitle | NotionFomula | NotionRichText
  }
}

type KeyValue = {
  id: string
  key: string
  value: string
}
