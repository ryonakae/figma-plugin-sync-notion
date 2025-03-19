import { create } from 'zustand'

import {
  DEFAULT_CLIENT_STORAGE_OPTIONS,
  DEFAULT_DOCUMENT_OPTIONS,
} from '@/constants'
import type { NotionKeyValue, Options } from '@/types/common'

const defaultOptions: Options = {
  ...DEFAULT_DOCUMENT_OPTIONS,
  ...DEFAULT_CLIENT_STORAGE_OPTIONS,
}
export const useStore = create<Options>(set => defaultOptions)

export const useKeyValuesStore = create<{ keyValues: NotionKeyValue[] }>(
  set => ({
    keyValues: [],
  }),
)
