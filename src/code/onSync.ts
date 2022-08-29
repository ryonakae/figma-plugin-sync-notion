import { parse } from 'query-string'

export default async function onSync(msg: SyncMessage) {
  console.log('onSync', msg.keyValues)

  let keyValues = msg.keyValues

  // textNodeを検索
  // 要素を選択している時は各選択ごとに処理
  // textならそのまま追加、group, frame, componentならその中のtextを探して追加
  // 何も選択していない時は現在のページ内の全てのtextNodeを取得
  let textNodes: TextNode[] = []
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

      // keyValueオブジェクトが見つからなかったら処理中断
      if (!keyValue) {
        return
      }

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
    })
  )

  // 完了の旨をトーストで表示
  // 選択中かそうでないかで分岐
  if (figma.currentPage.selection.length) {
    figma.notify('Sync all text in selection with Notion.')
  } else {
    figma.notify('Sync all text in this page with Notion.')
  }

  // 配列を空にしてメモリ解放
  textNodes = []
  keyValues = []

  // 完了の旨をUIに送信
  figma.ui.postMessage({
    type: 'sync-success'
  } as PluginMessage)
  console.log('sync success')
}
