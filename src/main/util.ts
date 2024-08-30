import times from 'lodash/times'
import uniqBy from 'lodash/uniqBy'

import i18n from '@/i18n/main'

import type { TargetTextRange } from '@/types/common'

// nodeの親がコンポーネント or Variantsかどうかを返す再帰関数
export function getIsNodeParentComponentOrVariants(node: SceneNode) {
  // 親要素がなかったらfalseを返す
  if (!node.parent) {
    return false
  }
  // 親がpage or documentならfalseを返す
  if (node.parent.type === 'PAGE' || node.parent.type === 'DOCUMENT') {
    return false
  }
  // 親要素のtypeがCOMPONENT || COMPONENT_SETならtrueを返す
  if (
    node.parent.type === 'COMPONENT' ||
    node.parent.type === 'COMPONENT_SET'
  ) {
    return true
  }
  // ↑のどれにも当てはまらなかったら親要素を対象にして関数実行
  return getIsNodeParentComponentOrVariants(node.parent)
}

// nodeのidから先祖インスタンスの配列を返す関数（自分は含まない）
export function getAncestorInstances(node: SceneNode) {
  const instanceArray: InstanceNode[] = []

  // idをセミコロンで区切って配列にしたもの
  const idArray = node.id.split(';')

  idArray.map((id, i) => {
    if (i === idArray.length - 1) {
      return
    }

    // indexに応じてidを加工
    let targetId = ''
    if (i === 0) {
      targetId = idArray[i]
    } else {
      const arr: string[] = []
      times(i + 1).map(j => arr.push(idArray[j]))
      targetId = arr.join(';')
    }

    // 加工したidを元にインスタンスを検索
    const instance = figma.getNodeById(targetId) as InstanceNode

    instanceArray.push(instance)
  })

  return instanceArray
}

// textNodesをフィルタリングする関数
function filterTextNodes(
  textNodes: TextNode[],
  options: {
    includeComponents: boolean
    includeInstances: boolean
  },
) {
  // 削除予定のtextNodeを格納する配列
  let textNodesToRemove: TextNode[] = []

  // includeComponentsがfalse
  // → コンポーネントまたはバリアントの子要素をtextNodesToRemoveに追加
  if (!options.includeComponents) {
    textNodes.forEach(textNode => {
      console.log(
        'Checking textNode is component/variant child:',
        textNode.characters,
      )

      if (getIsNodeParentComponentOrVariants(textNode)) {
        console.log(
          'Removing textNode is component/variant child:',
          textNode.characters,
        )
        textNodesToRemove.push(textNode)
      }
    })
  }

  // includeInstances
  // → インスタンスの子要素をtextNodesToRemoveに追加
  if (!options.includeInstances) {
    console.log('textNodes', textNodes)
    textNodes.forEach(textNode => {
      console.log('Checking textNode is instance child:', textNode.characters)

      const ancestorInstances = getAncestorInstances(textNode)
      if (ancestorInstances.length > 0) {
        console.log('Removing textNode is instance child:', textNode.characters)
        textNodesToRemove.push(textNode)
      }
    })
  }

  // textNodesToRemoveから重複を削除
  textNodesToRemove = uniqBy(textNodesToRemove, 'id')

  console.log('textNodesToRemove', textNodesToRemove)

  // textNodesからtextNodesToRemoveにある要素を削除
  const filteredTextNodes = textNodes.filter(textNode => {
    return !textNodesToRemove.some(
      textNodeToRemove => textNodeToRemove.id === textNode.id,
    )
  })

  // filteredTextNodesを返す
  return filteredTextNodes
}

// targetTextRangeに応じてtextNodeを取得する関数
export async function getTextNodes(options: {
  targetTextRange: TargetTextRange
  includeComponents: boolean
  includeInstances: boolean
}) {
  console.log('getTextNodes', options.targetTextRange, options)

  // textNodeを格納する配列を用意
  let textNodes: TextNode[] = []

  if (options.targetTextRange === 'currentPage') {
    // ページを読み込む
    await figma.currentPage.loadAsync()

    // targetTextRangeに応じてtextNodeを検索、配列に追加
    textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })
  } else if (options.targetTextRange === 'allPages') {
    // 各ページごとに処理を実行
    for (const page of figma.root.children) {
      // ページを読み込む
      await page.loadAsync()

      // ページは以下にあるすべてのテキストをtextNodesに追加
      textNodes = [
        ...textNodes,
        ...page.findAllWithCriteria({ types: ['TEXT'] }),
      ]
    }
  } else if (options.targetTextRange === 'selection') {
    // 何も選択していない場合は処理を終了
    if (figma.currentPage.selection.length === 0) {
      figma.notify(i18n.t('notifications.main.noSelections'))
      return textNodes
    }

    figma.currentPage.selection.forEach(node => {
      // 要素がテキストの場合、textNodesに追加
      if (node.type === 'TEXT') {
        textNodes.push(node)
      }

      // 要素がグループ、フレーム、コンポーネント、インスタンスなら、要素内のすべてのテキストをtextNodesに追加
      else if (
        node.type === 'GROUP' ||
        node.type === 'FRAME' ||
        node.type === 'COMPONENT' ||
        node.type === 'COMPONENT_SET' ||
        node.type === 'INSTANCE'
      ) {
        textNodes = [
          ...textNodes,
          ...node.findAllWithCriteria({ types: ['TEXT'] }),
        ]
      }

      // それ以外の場合は何もしない
      // else {}
    })
  }

  // includeComponentsがfalse、またはincludeInstancesがfalseの場合、filterTextNodesを実行
  if (!options.includeComponents || !options.includeInstances) {
    textNodes = filterTextNodes(textNodes, {
      includeComponents: options.includeComponents,
      includeInstances: options.includeInstances,
    })
  }

  return textNodes
}
