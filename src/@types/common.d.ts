type Options = {
  integrationToken: string
  databaseId: string
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

type NotionRow = {
  id: string
  properties: {
    pageName: {
      title: { plain_text: string }[]
    }
    ja: {
      rich_text: { plain_text: string }[]
    }
  }
}
type KeyValue = {
  id: string
  key: string
  ja: string
}
