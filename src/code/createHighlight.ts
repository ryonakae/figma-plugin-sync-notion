export default async function createHighlight(keyValues: KeyValue[]) {
  console.log('createHighlight', keyValues)

  // textNodeを格納する配列を用意
  let textNodes: TextNode[] = []
  let matchedTextNodes: TextNode[] = []

  // Rectangleを格納する配列を用意
  let rectNodes: RectangleNode[] = []
  const correctRectNodes: RectangleNode[] = []
  const incorrectRectNodes: RectangleNode[] = []

  // 現在のページ内の全てのtextNodeを取得
  textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })

  // textNodeの中からレイヤー名が#で始まるものだけを探してmatchedTextNodesに追加する
  matchedTextNodes = textNodes.filter(textNode => {
    console.log(textNode.name)
    return textNode.name.startsWith('#')
  })

  // 以前生成したgroupを探して、削除
  const generatedGroupId = figma.root.getPluginData('generatedGroupId')
  const previousGeneratedGroup = figma.currentPage.findOne(
    node => node.id === generatedGroupId
  )
  if (previousGeneratedGroup) {
    previousGeneratedGroup.remove()
  }

  // matchedTextNodesごとに処理を実行
  await Promise.all(
    matchedTextNodes.map(async textNode => {
      // レイヤー名から#を取ってkey名にする
      // #から、?までの部分をkey名と見なす
      const key = textNode.name.split('?')[0].replace(/^#/, '')

      // key名を使ってkeyValuesからオブジェクトを検索する
      const keyValue = keyValues.find(keyValue => {
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
          textNode.absoluteRenderBounds.height
        )

        // keyValueオブジェクトが見つかったら、rectを青で塗りつぶす
        if (keyValue) {
          rect.fills = [
            { type: 'SOLID', color: { r: 0, g: 0, b: 1 }, opacity: 0.3 }
          ]
          rect.name = `⭕️ ${textNode.name}`
          // correctRectNodes配列にrectを追加
          correctRectNodes.push(rect)
        }
        // keyValueオブジェクトが見つからない場合
        // （レイヤー名は#で始まっているがkeyが間違っている場合）は、rectを赤で塗りつぶす
        else {
          rect.fills = [
            { type: 'SOLID', color: { r: 1, g: 0, b: 0 }, opacity: 0.3 }
          ]
          rect.name = `❌ ${textNode.name}`
          // incorrectRectNodes配列にrectを追加
          incorrectRectNodes.push(rect)
        }
      }
    })
  )

  // correctRectNodesとincorrectRectNodesをrectNodesにマージする
  rectNodes = [...correctRectNodes, ...incorrectRectNodes]

  // rectNodeが1つ以上ある場合、rectをグルーピングする
  if (rectNodes.length > 0) {
    const group = figma.group(rectNodes, figma.currentPage)
    group.name = `${rectNodes.length} Highlights (⭕️ ${correctRectNodes.length} / ❌ ${incorrectRectNodes.length}) - Generated with Sync Notion`

    // をロック
    group.locked = true

    // 折りたたむ
    group.expanded = false

    // 生成したgroupのidをgeneratedGroupIdに保存する
    figma.root.setPluginData('generatedGroupId', group.id)
  }

  console.log('createHighlight success')
}
