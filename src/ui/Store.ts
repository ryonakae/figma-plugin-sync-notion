import { create } from 'zustand'

import { DEFAULT_OPTIONS } from '@/constants'
import type { Options } from '@/types/common'

export const useStore = create<Options>(set => DEFAULT_OPTIONS)
