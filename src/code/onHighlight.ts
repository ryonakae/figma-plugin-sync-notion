export default async function onHighlight() {
  console.log('onHighlight')

  // Rectangleを格納する配列を用意
  let rectNodes: RectangleNode[] = []

  // 現在のページ内の全てのtextNodeを取得
  let textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })

  console.log('textNodes', textNodes)

  // textNodeが1つも無かったら処理を中断
  if (!textNodes.length) {
    figma.notify('No text layers in this page.')

    // 失敗の旨をUIに送信
    figma.ui.postMessage({
      type: 'highlight-failed'
    } as PluginMessage)
    console.error('highlight failed: No text layers')

    return
  }

  // textNodeの中からレイヤー名が#で始まるものだけを探して新しい配列を作る
  const matchedTextNodes = textNodes.filter(textNode => {
    console.log(textNode.name)
    return textNode.name.startsWith('#')
  })

  console.log('matchedTextNodes', matchedTextNodes)

  // matchedTextNodesが空なら処理中断
  if (!matchedTextNodes.length) {
    figma.notify('No matching text.')

    // 失敗の旨をUIに送信
    figma.ui.postMessage({
      type: 'highlight-failed'
    } as PluginMessage)
    console.error('highlight failed: No matching text')

    return
  }

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
      console.log(textNode)

      // textNodeのabsoluteRenderBoundsが無い場合（非表示の場合）はスキップ
      if (!textNode.absoluteRenderBounds) {
        return
      }

      // rectを作って、サイズとかstrokeとか設定
      const rect = figma.createRectangle()
      rect.x = textNode.absoluteRenderBounds.x
      rect.y = textNode.absoluteRenderBounds.y
      rect.resize(
        textNode.absoluteRenderBounds.width,
        textNode.absoluteRenderBounds.height
      )
      rect.fills = []
      rect.strokes = [
        { type: 'SOLID', color: { r: 1, g: 0, b: 0 }, opacity: 0.5 }
      ]
      rect.strokeWeight = 2
      rect.name = textNode.name

      // rectNodes配列にrectを追加
      rectNodes.push(rect)
    })
  )

  // rectをグルーピングする
  // rectNodesが1つ以上あるときだけ
  if (rectNodes.length > 0) {
    const group = figma.group(rectNodes, figma.currentPage)
    group.name = `🟥 ${rectNodes.length} Highlights (Generated with Sync Notion)`

    // groupをロック
    group.locked = true

    // 生成したgroupのidをgeneratedGroupIdに保存する
    figma.root.setPluginData('generatedGroupId', group.id)

    // 完了の旨をトーストで表示
    figma.notify('Highlight all text that has correct layer name in this page.')

    // 完了の旨をUIに送信
    figma.ui.postMessage({
      type: 'highlight-success'
    } as PluginMessage)
    console.log('highlight success')
  }
  // rectNodeが0のとき
  else {
    // 通知出す
    figma.notify('No text layers in this page.')
    // 失敗の旨をUIに送信
    figma.ui.postMessage({
      type: 'highlight-failed'
    } as PluginMessage)
    console.error('highlight failed: No text layers')
  }

  // 配列を空にしてメモリ解放
  textNodes = []
  rectNodes = []
}
