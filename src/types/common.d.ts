export type SelectedTabKey = 'fetch' | 'list' | 'utilities' | 'settings'
export type SelectedTabValue = 'Fetch' | 'List' | 'Utilities' | 'Settings'

export type SortValue = 'key' | 'value' | 'created_time' | 'last_edited_time'

export type SortOrder = 'ascending' | 'descending'

export type TargetTextRange = 'selection' | 'currentPage' | 'allPages'

export type PluginLanguage = 'en' | 'ja'

export type Options = {
  // fetch
  selectedTabKey: SelectedTabKey
  proxyUrl: string
  integrationToken: string
  databaseId: string
  keyPropertyName: string
  valuePropertyName: string
  // list
  filterString: string
  sortValue: SortValue
  sortOrder: SortOrder
  selectedRowId: string | null
  scrollPosition: number
  // utilities
  targetTextRange: TargetTextRange
  includeComponents: boolean
  includeInstances: boolean
  // settings
  pluginLanguage: PluginLanguage
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
  created_time: string
  last_edited_time: string
  url: string
}

export type NotionKeyValue = {
  id: string
  key: string
  value: string
  created_time: string
  last_edited_time: string
  url: string
}
