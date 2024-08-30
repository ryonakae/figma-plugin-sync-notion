import { GROUP_ID_KEY } from '@/constants'
import i18n from '@/i18n/main'
import { getTextNodes } from '@/main/util'

import type { NotionKeyValue, TargetTextRange } from '@/types/common'

async function createHighlightRectOnPage(
  keyValues: NotionKeyValue[],
  textNodes: TextNode[],
  pageNode: PageNode,
) {
  console.log('createHighlightRectOnPage', textNodes, pageNode)

  // correctLayerNameFormatTextNodesを格納する配列を用意
  let correctLayerNameFormatTextNodes: TextNode[] = []

  // Rectangleを格納する配列を用意
  let rectNodes: RectangleNode[] = []
  const correctRectNodes: RectangleNode[] = []
  const incorrectRectNodes: RectangleNode[] = []

  // textNodeの中からレイヤー名が#で始まるものだけを探してcorrectLayerNameFormatTextNodesに追加する
  correctLayerNameFormatTextNodes = textNodes.filter(textNode => {
    console.log(textNode.name)
    return textNode.name.startsWith('#')
  })

  console.log(
    'correctLayerNameFormatTextNodes',
    correctLayerNameFormatTextNodes,
  )

  if (correctLayerNameFormatTextNodes.length === 0) {
    // correctLayerNameFormatTextNodesが空の場合は処理を終了
    console.log('no matched text')
    return
  }

  // 以前生成したgroupを探して、削除
  const generatedGroupId = pageNode.getPluginData(GROUP_ID_KEY)
  const previousGeneratedGroup = pageNode.findOne(
    node => node.id === generatedGroupId,
  )
  console.log('generatedGroupId', generatedGroupId)
  console.log('previousGeneratedGroup', previousGeneratedGroup)
  if (previousGeneratedGroup) {
    previousGeneratedGroup.remove()
  }

  // correctLayerNameFormatTextNodesごとに処理を実行
  await Promise.all(
    correctLayerNameFormatTextNodes.map(async textNode => {
      // レイヤー名から#を取ってkey名にする
      // #から、?までの部分をkey名と見なす
      const key = textNode.name.split('?')[0].replace(/^#/, '')

      // key名を使ってkeyValuesからオブジェクトを検索する
      const matchedKeyValue = keyValues.find(keyValue => {
        return keyValue.key === key
      })

      // ハイライト用のrectを作る（レイヤーが表示されているものだけ）
      if (textNode.absoluteRenderBounds) {
        // rectを作って、サイズとかstrokeとか設定
        const rect = figma.createRectangle()
        rect.x = textNode.absoluteRenderBounds.x
        rect.y = textNode.absoluteRenderBounds.y
        rect.resize(
          textNode.absoluteRenderBounds.width,
          textNode.absoluteRenderBounds.height,
        )

        // keyValueオブジェクトが見つかったら、rectを青で塗りつぶす
        if (matchedKeyValue) {
          rect.fills = [figma.util.solidPaint({ r: 0, g: 0, b: 1, a: 0.3 })]
          rect.name = `⭕️ ${textNode.name}`
          // correctRectNodes配列にrectを追加
          correctRectNodes.push(rect)
        }
        // keyValueオブジェクトが見つからない場合
        // （レイヤー名は#で始まっているがkeyが間違っている場合）は、rectを赤で塗りつぶす
        else {
          rect.fills = [figma.util.solidPaint({ r: 1, g: 0, b: 0, a: 0.3 })]
          rect.name = `❌ ${textNode.name}`
          // incorrectRectNodes配列にrectを追加
          incorrectRectNodes.push(rect)
        }
      }
    }),
  )

  // correctRectNodesとincorrectRectNodesをrectNodesにマージする
  rectNodes = [...correctRectNodes, ...incorrectRectNodes]
  console.log('rectNodes', rectNodes)

  if (rectNodes.length > 0) {
    // rectNodeが1つ以上ある場合、rectをグルーピングする
    const group = figma.group(rectNodes, figma.currentPage)

    // グループをリネーム
    group.name = `${rectNodes.length} Highlights (⭕️ ${correctRectNodes.length} / ❌ ${incorrectRectNodes.length}) - Generated with Sync Text with Notion`

    // グループをロック
    group.locked = true

    // グループを折りたたむ
    group.expanded = false

    // 生成したgroupのidをcurrentPageのgeneratedGroupIdに保存する
    pageNode.setPluginData(GROUP_ID_KEY, group.id)
  }
}

export default async function highlightText(
  keyValues: NotionKeyValue[],
  options: {
    targetTextRange: TargetTextRange
    includeComponents: boolean
    includeInstances: boolean
  },
) {
  console.log('highlightText', keyValues, options)

  // targetTextRangeに応じて処理を分岐
  if (options.targetTextRange === 'allPages') {
    for (const page of figma.root.children) {
      // まず対象のpageNodeに移動
      await figma.setCurrentPageAsync(page)

      // そのページ内のtextNodeを取得
      const textNodes = await getTextNodes({
        targetTextRange: 'currentPage',
        includeComponents: options.includeComponents,
        includeInstances: options.includeInstances,
      })

      // ハイライトを実行
      await createHighlightRectOnPage(keyValues, textNodes, page)
    }
  } else {
    // targetTextRangeにもとづいてtextNodeを取得
    const textNodes = await getTextNodes(options)

    // ハイライトを実行
    await createHighlightRectOnPage(keyValues, textNodes, figma.currentPage)
  }

  // 完了通知
  figma.notify(i18n.t('notifications.highlightText.finish'))
}
