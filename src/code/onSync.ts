import { parse } from 'query-string'

export default async function onSync(msg: SyncMessage) {
  console.log('onSync', msg.keyValues, msg.withHighlight)

  // 引数を変数に入れる
  let keyValues = msg.keyValues
  const withHighlight = msg.withHighlight

  // Rectangleを格納する配列を用意
  let correctRectNodes: RectangleNode[] = []
  let incorrectRectNodes: RectangleNode[] = []

  // textNodeを格納する配列を用意
  let textNodes: TextNode[] = []

  // textNodeを検索
  // 要素を選択している時は各選択ごとに処理
  // textならそのまま追加、group, frame, componentならその中のtextを探して追加
  // 何も選択していない時は現在のページ内の全てのtextNodeを取得
  if (figma.currentPage.selection.length) {
    figma.currentPage.selection.forEach(selection => {
      // 要素がテキストの場合、textNodesに追加
      if (selection.type === 'TEXT') {
        textNodes.push(selection)
      }
      // 要素がグループ、フレーム、コンポーネント、インスタンスなら、要素内のすべてのテキストをtextNodesに追加
      else if (
        selection.type === 'GROUP' ||
        selection.type === 'FRAME' ||
        selection.type === 'COMPONENT' ||
        selection.type === 'COMPONENT_SET' ||
        selection.type === 'INSTANCE'
      ) {
        textNodes = [
          ...textNodes,
          ...selection.findAllWithCriteria({ types: ['TEXT'] })
        ]
      }
      // それ以外の場合は何もしない
      // else {}
    })
  } else {
    textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })
  }

  console.log('textNodes', textNodes)

  // textNodeが1つも無かったら処理を中断
  if (!textNodes.length) {
    // 選択状態によってトーストを出し分け
    if (figma.currentPage.selection.length) {
      figma.notify('No text layers in selection.')
    } else {
      figma.notify('No text layers in this page.')
    }

    // 失敗の旨をUIに送信
    figma.ui.postMessage({
      type: 'sync-failed'
    } as PluginMessage)
    console.error('sync failed: No text layers')

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
      type: 'sync-failed'
    } as PluginMessage)
    console.error('sync failed: No matching text')

    return
  }

  // withHighlightがtrueの場合、以前生成したgroupを探して、削除
  if (withHighlight) {
    const generatedGroupId = figma.root.getPluginData('generatedGroupId')
    const previousGeneratedGroup = figma.currentPage.findOne(
      node => node.id === generatedGroupId
    )
    if (previousGeneratedGroup) {
      previousGeneratedGroup.remove()
    }
  }

  // matchedTextNodesごとに処理を実行
  await Promise.all(
    matchedTextNodes.map(async textNode => {
      // クエリパラメータを取得する
      // ?から後ろの部分をクエリパラメータと見なす
      const param = parse(textNode.name.split('?')[1])

      // レイヤー名から#を取ってkey名にする
      // #から、?までの部分をkey名と見なす
      const key = textNode.name.split('?')[0].replace(/^#/, '')

      // key名を使ってkeyValuesからオブジェクトを検索する
      const keyValue = keyValues.find(keyValue => {
        return keyValue.key === key
      })

      // テキストを置換する
      // keyValueオブジェクトが見つかった場合
      if (keyValue) {
        console.log('keyValue found', key)

        // 見つかったkeyValueオブジェクトからvalueを取り出す
        const value = keyValue.value
        // console.log(key, value, param)

        // テキスト置換のために事前にフォントをロード
        let fontName: FontName
        if (textNode.characters) {
          fontName = textNode.getRangeFontName(0, 1) as FontName
        } else {
          fontName = textNode.fontName as FontName
        }
        await figma.loadFontAsync(fontName)

        // テキストをvalueに置換
        // paramがある場合→valueの中の{paramKey}の置き換えを試みる
        if (Object.keys(param).length) {
          // valueの中に{paramKeyがあるか探す}
          const matchedParamKeys = value.match(/(?<=\{).*?(?=\})/g)

          // 無い場合、仕方がないので普通にvalueを入れる
          if (!matchedParamKeys) {
            return (textNode.characters = value)
          }

          // value内にある{paramKey}毎に置換
          let replacedValue = value

          matchedParamKeys.forEach(paramKey => {
            replacedValue = replacedValue.replace(
              new RegExp('{' + paramKey + '}', 'g'),
              param[paramKey] !== undefined
                ? String(param[paramKey])
                : '{' + paramKey + '}'
            )
          })

          // replacedValueをテキスト本文にする
          textNode.characters = replacedValue
        }
        // paramが無い場合→普通にvalueを入れる
        else {
          textNode.characters = value
        }
      }
      // keyValueオブジェクトが見つからなかった場合
      else {
        console.log('keyValue not found', key)
      }

      // ハイライト用のrectを作る（レイヤーが表示されているものだけ）
      if (withHighlight && textNode.absoluteRenderBounds) {
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

  // correctRectNodesとincorrectRectNodesから新しい配列を作る
  let rectNodes = [...correctRectNodes, ...incorrectRectNodes]

  // withHighlightがtrueかつrectNodesが1つ以上ある場合、rectをグルーピングする
  if (withHighlight && rectNodes.length > 0) {
    const group = figma.group(rectNodes, figma.currentPage)
    group.name = `${rectNodes.length} Highlights (⭕️ ${correctRectNodes.length} / ❌ ${incorrectRectNodes.length}) - Generated with Sync Notion`

    // をロック
    group.locked = true

    // 折りたたむ
    group.expanded = false

    // 生成したgroupのidをgeneratedGroupIdに保存する
    figma.root.setPluginData('generatedGroupId', group.id)
  }

  // 完了の旨をトーストで表示
  // 選択中かそうでないかで分岐
  if (figma.currentPage.selection.length) {
    figma.notify('Sync all text in selection with Notion.')
  } else {
    figma.notify('Sync all text in this page with Notion.')
  }

  // 配列を空にしておく
  textNodes = []
  keyValues = []
  correctRectNodes = []
  incorrectRectNodes = []
  rectNodes = []

  // 完了の旨をUIに送信
  figma.ui.postMessage({
    type: 'sync-success'
  } as PluginMessage)
  console.log('sync success')
}
