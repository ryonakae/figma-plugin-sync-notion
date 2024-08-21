import type { NotionKeyValue } from '@/types/common'
import { loadFontsAsync } from '@create-figma-plugin/utilities'

export default async function applyKeyValue(keyValue: NotionKeyValue) {
  console.log('applyKeyValue', keyValue)

  // 何も選択していない場合は処理を終了
  if (figma.currentPage.selection.length === 0) {
    figma.notify('Please select at least one layer.')
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
    figma.notify('No text layers in selection.')
    return
  }

  // 事前にフォントをロード
  await loadFontsAsync(textNodes).catch((error: Error) => {
    const errorMessage = 'Error on loading font.'
    figma.notify(errorMessage, { error: true })
    throw new Error(errorMessage)
  })

  // textNodeごとに処理を実行
  textNodes.forEach(textNode => {
    // レイヤー名を# + keyPropertyにする
    textNode.name = `#${keyValue.key}`

    // テキスト本文をvaluePropertyにする
    textNode.characters = keyValue.value
  })

  // 完了通知
  figma.notify('Applied key & value to selected text.')
}
