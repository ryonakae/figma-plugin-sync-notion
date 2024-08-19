import { create } from 'zustand'

import { DEFAULT_OPTIONS } from '@/constants'
import type { NotionKeyValue, Options } from '@/types/common'

export const useStore = create<Options>(set => DEFAULT_OPTIONS)

export const useKeyValuesStore = create<{ keyValues: NotionKeyValue[] }>(
  set => ({
    keyValues: [],
  }),
)
