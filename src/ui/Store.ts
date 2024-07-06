// import { useState } from 'react'
// import { createContainer } from 'unstated-next'
// import { defaultOptions } from '@/code/options'

// function Store() {
//   const [apiUrl, setApiUrl] = useState(defaultOptions.apiUrl)
//   const [integrationToken, setIntegrationToken] = useState(
//     defaultOptions.integrationToken
//   )
//   const [databaseId, setDatabaseId] = useState(defaultOptions.databaseId)
//   const [keyPropertyName, setKeyPropertyName] = useState(
//     defaultOptions.keyPropertyName
//   )
//   const [valuePropertyName, setValuePropertyName] = useState(
//     defaultOptions.valuePropertyName
//   )
//   const [withHighlight, setWithHighlight] = useState(
//     defaultOptions.withHighlight
//   )
//   const [usingCache, setUsingCache] = useState(defaultOptions.usingCache)
//   const [cache, setCache] = useState<KeyValue[]>([])
//   const [syncing, setSyncing] = useState(false)

//   return {
//     apiUrl,
//     integrationToken,
//     databaseId,
//     keyPropertyName,
//     valuePropertyName,
//     withHighlight,
//     usingCache,
//     cache,
//     syncing,
//     setApiUrl,
//     setIntegrationToken,
//     setDatabaseId,
//     setKeyPropertyName,
//     setValuePropertyName,
//     setWithHighlight,
//     setUsingCache,
//     setCache,
//     setSyncing
//   }
// }

// export default createContainer(Store)

import { create } from 'zustand'

import {
  DEFAULT_CLIENT_STORAGE_OPTIONS,
  DEFAULT_DOCUMENT_OPTIONS,
} from '@/constants'
import type { ClientStorageOptions, DocumentOptions } from '@/types/common'

export const useDocumentStore = create<DocumentOptions>(
  set => DEFAULT_DOCUMENT_OPTIONS,
)

export const useClientStorageStore = create<ClientStorageOptions>(
  set => DEFAULT_CLIENT_STORAGE_OPTIONS,
)
