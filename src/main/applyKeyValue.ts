import { loadFontsAsync } from '@create-figma-plugin/utilities'

import i18n from '@/i18n/main'

import type { NotionKeyValue } from '@/types/common'

export default async function applyKeyValue(keyValue: NotionKeyValue) {
  console.log('applyKeyValue', keyValue)

  // 何も選択していない場合は処理を終了
  if (figma.currentPage.selection.length === 0) {
    figma.notify(i18n.t('notifications.main.noSelections'))
    return
  }

  // textNodeを格納する配列を用意
  const textNodes: TextNode[] = []

  // 選択要素ごとに処理を実行
  figma.currentPage.selection.forEach(node => {
    // 要素がテキストの場合、textNodesに追加
    if (node.type === 'TEXT') {
      textNodes.push(node)
    }
  })

  console.log('textNodes', textNodes)

  // textNodeが1つも無かったら処理を中断
  if (textNodes.length === 0) {
    figma.notify(i18n.t('notifications.main.noTextInSelection'))
    return
  }

  // 事前にフォントをロード
  await loadFontsAsync(textNodes).catch((error: Error) => {
    const errorMessage = i18n.t('notifications.main.errorLoadFonts')
    figma.notify(errorMessage, { error: true })
    throw new Error(errorMessage)
  })

  // textNodeごとに処理を実行
  textNodes.forEach(textNode => {
    // レイヤー名をkeyPropertyにする
    // UI側で`#${keyValue.key}?${queryString}`に加工したもの
    textNode.name = keyValue.key

    // テキスト本文をvaluePropertyにする
    textNode.characters = keyValue.value
  })

  // 完了通知
  figma.notify(i18n.t('notifications.applyKeyValue.finish'))
}
