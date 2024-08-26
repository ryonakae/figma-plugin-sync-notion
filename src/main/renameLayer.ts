import { loadFontsAsync } from '@create-figma-plugin/utilities'

import { filterTextNodes, getTextNodes } from '@/main/util'

import type { NotionKeyValue, TargetTextRange } from '@/types/common'

export default async function renameLayer(
  keyValues: NotionKeyValue[],
  options: {
    targetTextRange: TargetTextRange
    includeComponents: boolean
    includeInstances: boolean
  },
) {
  console.log('renameLayer', keyValues, options)

  // textNodeを取得
  let textNodes = await getTextNodes(options.targetTextRange)

  console.log('textNodes', textNodes)

  // includeComponentsがfalse、またはincludeInstancesがfalseの場合、filterTextNodesを実行
  if (!options.includeComponents || !options.includeInstances) {
    textNodes = filterTextNodes(textNodes, {
      includeComponents: options.includeComponents,
      includeInstances: options.includeInstances,
    })
  }

  console.log('filterd textNodes', textNodes)

  // textNodeが1つもなかったら処理を終了
  if (textNodes.length === 0) {
    // 選択状態によってトーストを出し分け
    if (options.targetTextRange === 'selection') {
      figma.notify('No text layers in selection.')
    } else if (options.targetTextRange === 'currentPage') {
      figma.notify('No text layers in this page.')
    } else if (options.targetTextRange === 'allPages') {
      figma.notify('No text layers in all pages.')
    }

    return
  }

  // 事前にフォントをロード
  await loadFontsAsync(textNodes).catch((error: Error) => {
    const errorMessage = 'Error on loading font.'
    figma.notify(errorMessage, { error: true })
    throw new Error(errorMessage)
  })

  // keyValuesのvalueをキーとするマップを作成
  const valueKeyMap = new Map(
    keyValues.map(keyValue => [keyValue.value, keyValue]),
  )

  // textNodesごとに処理を実行
  textNodes.forEach(textNode => {
    // keyValuesからvalueがtextNode.charactersと一致するものを探す
    const matchedKeyValue = valueKeyMap.get(textNode.characters)
    console.log('matchedKeyValue', textNode.characters, matchedKeyValue)

    // matchedKeyValueがある場合、keyをtextNodeのレイヤー名にする
    if (matchedKeyValue) {
      textNode.name = `#${matchedKeyValue.key}`
    }
  })

  // 完了通知
  figma.notify('Renamed layer name of selected text.')
}
