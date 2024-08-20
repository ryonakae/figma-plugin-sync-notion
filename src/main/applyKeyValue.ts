import type { NotionKeyValue } from '@/types/common'

export default function applyKeyValue(keyValue: NotionKeyValue) {
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
}
