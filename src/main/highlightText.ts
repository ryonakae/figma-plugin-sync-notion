import type { NotionKeyValue, TargetTextRange } from '@/types/common'

export default async function highlightText(
  keyValues: NotionKeyValue[],
  options: {
    targetTextRange: TargetTextRange
    includeComponents: boolean
    includeInstances: boolean
  },
) {
  console.log('highlightText', keyValues, options)
}
