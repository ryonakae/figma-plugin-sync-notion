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

type PluginMessage =
  | ClosePluginMessage
  | NotifyMessage
  | GetOptionsMessage
  | GetOptionsSuccessMessage
  | SetOptionsMessage

type PostMessage = {
  pluginMessage: PluginMessage
}
