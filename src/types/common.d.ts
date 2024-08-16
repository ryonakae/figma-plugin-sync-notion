export type SelectedTab = '設定'

export type Options = {
  selectedTab: SelectedTab
  apiUrl: string
  integrationToken: string
  databaseId: string
  keyPropertyName: string
  valuePropertyName: string
  withHighlight: boolean
  usingCache: boolean
}

export type NotionTitle = {
  type: 'title'
  title: { plain_text: string }[]
}
export type NotionFomula = {
  type: 'formula'
  formula: {
    string: string
  }
}
export type NotionRichText = {
  type: 'rich_text'
  rich_text: { plain_text: string }[]
}
export type NotionPage = {
  object: 'page'
  id: string
  properties: {
    [key: string]: NotionTitle | NotionFomula | NotionRichText
  }
}

export type KeyValue = {
  id: string
  key: string
  value: string
}
