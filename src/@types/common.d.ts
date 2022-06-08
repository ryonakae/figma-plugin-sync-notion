type Options = {
  integrationToken: string
  databaseId: string
  valueName: string
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

type NotionColumFomula = {
  formula: {
    string: string
  }
}
type NotionColumText = {
  rich_text: { plain_text: string }[]
}
type NotionRow = {
  id: string
  properties: {
    [key: string]: NotionColumFomula | NotionColumText
  }
}
type KeyValue = {
  id: string
  key: string
  value: string
}
