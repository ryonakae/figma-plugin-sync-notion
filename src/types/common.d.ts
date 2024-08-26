export type SelectedTab = 'Fetch' | 'List' | 'Utilities'

export type SortValue = 'key' | 'value' | 'created_time' | 'last_edited_time'

export type SortOrder = 'ascending' | 'descending'

export type TargetTextRange = 'selection' | 'currentPage' | 'allPages'

export type Options = {
  // fetch
  selectedTab: SelectedTab
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
