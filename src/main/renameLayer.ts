import { loadFontsAsync } from '@create-figma-plugin/utilities'

import i18n from '@/i18n/main'
import { getTextNodes } from '@/main/util'

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
  const textNodes = await getTextNodes(options)

  console.log('textNodes', textNodes)

  // textNodeが1つもなかったら処理を終了
  if (textNodes.length === 0) {
    // 選択状態によってトーストを出し分け
    if (options.targetTextRange === 'selection') {
      figma.notify(i18n.t('notifications.main.noTextInSelection'))
    } else if (options.targetTextRange === 'currentPage') {
      figma.notify(i18n.t('notifications.main.noTextInCurrentPage'))
    } else if (options.targetTextRange === 'allPages') {
      figma.notify(i18n.t('notifications.main.noTextInAllPages'))
    }

    return
  }

  // 事前にフォントをロード
  await loadFontsAsync(textNodes).catch((error: Error) => {
    const errorMessage = i18n.t('notifications.main.errorLoadFonts')
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

    // matchedKeyValueがある場合、keyをtextNodeのレイヤー名にする
    if (matchedKeyValue) {
      console.log('matchedKeyValue exist', textNode.characters, matchedKeyValue)
      textNode.name = `#${matchedKeyValue.key}`
    } else {
      console.log('no matchedKeyValue', textNode.characters)
    }
  })

  // 完了通知
  figma.notify(i18n.t('notifications.renameLayer.finish'))
}
