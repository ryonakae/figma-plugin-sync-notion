type Options = {
  integrationToken: string
  databaseId: string
  keyPropertyName: string
  valuePropertyName: string
}

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

type PluginMessage =
  | ClosePluginMessage
  | NotifyMessage
  | GetOptionsMessage
  | GetOptionsSuccessMessage
  | SetOptionsMessage
  | SyncMessage

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
