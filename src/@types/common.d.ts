type DocumentOptions = {
  apiUrl: string
  integrationToken: string
  databaseId: string
  keyPropertyName: string
}
type ClientStorageOptions = {
  valuePropertyName: string
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
}
type SyncSuccessMessage = {
  type: 'sync-success'
}
type SyncFailedMessage = {
  type: 'sync-failed'
}
type HighlightMessage = {
  type: 'highlight'
}
type HighlightSuccessMessage = {
  type: 'highlight-success'
}
type HighlightFailedMessage = {
  type: 'highlight-failed'
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
  | HighlightMessage
  | HighlightSuccessMessage
  | HighlightFailedMessage

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
