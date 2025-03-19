import { emit, once } from '@create-figma-plugin/utilities'

import { useKeyValuesStore } from '@/ui/Store'

import type { NotionKeyValue } from '@/types/common'
import type {
  LoadCacheFromMainHandler,
  LoadCacheFromUIHandler,
  SaveCacheHandler,
} from '@/types/eventHandler'

export default function useCache() {
  function loadCacheFromClientStorage() {
    return new Promise<NotionKeyValue[]>(resolve => {
      console.log('loadCacheFromClientStorage')

      once<LoadCacheFromMainHandler>('LOAD_CACHE_FROM_MAIN', keyValues => {
        console.log('cached keyValues', keyValues)
        useKeyValuesStore.setState({ keyValues })
        resolve(keyValues)
      })

      emit<LoadCacheFromUIHandler>('LOAD_CACHE_FROM_UI')
    })
  }

  function saveCacheToClientStorage(keyValues: NotionKeyValue[]) {
    console.log('saveCacheToClientStorage', keyValues)
    emit<SaveCacheHandler>('SAVE_CACHE', keyValues)
  }

  return { loadCacheFromClientStorage, saveCacheToClientStorage }
}
