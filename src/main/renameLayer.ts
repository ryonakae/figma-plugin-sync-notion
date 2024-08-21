import type { NotionKeyValue, TargetTextRange } from '@/types/common'

export default async function renameLayer(
  keyValues: NotionKeyValue[],
  options: {
    targetTextRange: TargetTextRange
    includeComponents: boolean
    includeInstances: boolean
  },
) {
  console.log(renameLayer, keyValues, options)
}
